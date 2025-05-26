import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { ethers } from "ethers";
import {
  LitAccessControlConditionResource,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { encryptString, decryptToString } from "@lit-protocol/encryption";

type EVMChain = 'ethereum' | 'polygon' | 'fantom' | 'xdai' | 'bsc' | 'arbitrum' | 'avalanche' | 'fuji' | 'harmony' | 'mumbai' | 'goerli' | 'cronos' | 'optimism' | 'celo';

type StandardContractType = '' | 'ERC20' | 'ERC721' | 'ERC721MetadataName' | 'ERC1155' | 'CASK' | 'Creaton' | 'POAP' | 'timestamp' | 'MolochDAOv2.1' | 'ProofOfHumanity' | 'SIWE' | 'PKPPermissions' | 'LitAction';

type Comparator = 'contains' | '=' | '>' | '>=' | '<' | '<=';

// Define the correct type for EVM access control conditions
interface EVMBasicAccessControlCondition {
  contractAddress: string;
  standardContractType: StandardContractType;
  chain: EVMChain;
  method: string;
  parameters: string[];
  returnValueTest: {
    comparator: Comparator;
    value: string;
  };
}

export type AccessControlConditions = EVMBasicAccessControlCondition[];

export class LitProtocolService {
  private litNodeClient: LitJsSdk.LitNodeClient | null = null;
  private chain = 'ethereum' as EVMChain; // Always use ethereum for compatibility
  private sessionSigs: any = null; // Cache session signatures

  async connect() {
    try {
      this.litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: LIT_NETWORK.DatilDev, // Using DatilDev (free development network)
      });
      await this.litNodeClient.connect();
      return true;
    } catch (error) {
      console.error('Failed to connect to Lit Protocol:', error);
      this.litNodeClient = null;
      return false;
    }
  }

  // Add method to clear cached session signatures
  clearSessionSignatures() {
    this.sessionSigs = null;
    console.log('Cleared cached session signatures');
  }

  // Simple method to ensure chain is set to ethereum
  setChain() {
    this.chain = 'ethereum';
    console.log('Set Lit Protocol chain to:', this.chain);
    return this.chain;
  }

  async getSessionSignatures(forceRefresh = false) {
    // Return cached signatures if available and not forcing refresh
    if (this.sessionSigs && !forceRefresh) {
      console.log('Using cached session signatures');
      return this.sessionSigs;
    }

    if (!window.ethereum) {
      throw new Error('Ethereum provider not found');
    }

    if (!this.litNodeClient) {
      throw new Error('Lit Protocol not initialized');
    }

    try {
      console.log('Generating new session signatures...');
      
      // Set chain to ethereum for compatibility
      this.setChain();
      
      // Connect to the wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Get the latest blockhash
      const latestBlockhash = await this.litNodeClient.getLatestBlockhash();
      if (!latestBlockhash) {
        throw new Error('Failed to get latest blockhash');
      }

      // Define the authNeededCallback function
      const authNeededCallback = async (params: { 
        uri?: string; 
        expiration?: string; 
        resourceAbilityRequests?: Array<{
          resource: LitAccessControlConditionResource;
          ability: string;
        }>;
      }) => {
        const { uri, expiration, resourceAbilityRequests } = params;
        if (!uri || !expiration || !resourceAbilityRequests) {
          throw new Error('Missing required parameters for auth');
        }

        try {
          // Create the SIWE message
          const toSign = await createSiweMessageWithRecaps({
            uri,
            expiration,
            resources: resourceAbilityRequests as any,
            walletAddress,
            nonce: latestBlockhash,
            litNodeClient: this.litNodeClient!,
          });

          // Generate the authSig
          const authSig = await generateAuthSig({
            signer,
            toSign,
          });

          return authSig;
        } catch (error) {
          console.error('Failed to generate auth signature:', error);
          throw error;
        }
      };

      // Define the Lit resource
      const litResource = new LitAccessControlConditionResource('*');

      // Get the session signatures
      const sessionSigs = await (this.litNodeClient as any).getSessionSigs({
        chain: this.chain,
        resourceAbilityRequests: [{
          resource: litResource,
          ability: 'access-control-condition-decryption',
        }] as any,
        authNeededCallback,
      });

      // Cache the session signatures
      this.sessionSigs = sessionSigs;
      console.log('Successfully generated and cached session signatures');
      return sessionSigs;
    } catch (error) {
      console.error('Failed to get session signatures:', error);
      // Clear cached signatures on error
      this.sessionSigs = null;
      throw error;
    }
  }

  async encrypt(message: string, accessControlConditions: AccessControlConditions) {
    try {
      if (!this.litNodeClient) {
        throw new Error('Lit Protocol not initialized');
      }

      // Encrypt the message
      const { ciphertext, dataToEncryptHash } = await encryptString(
        {
          accessControlConditions: accessControlConditions as any,
          dataToEncrypt: message,
        },
        this.litNodeClient
      );

      return {
        ciphertext,
        dataToEncryptHash,
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  async decrypt(ciphertext: string, dataToEncryptHash: string, accessControlConditions: AccessControlConditions) {
    try {
      if (!this.litNodeClient) {
        throw new Error('Lit Protocol not initialized');
      }

      console.log('Starting decryption with conditions:', accessControlConditions);
      console.log('Chain:', this.chain);

      let sessionSigs;
      try {
        // Try to get session signatures
        sessionSigs = await this.getSessionSignatures();
        console.log('Got session signatures for decryption');
      } catch (authError) {
        console.warn('Session signature failed, retrying with fresh signatures:', authError);
        // Retry with fresh session signatures
        sessionSigs = await this.getSessionSignatures(true);
      }

      // Decrypt the message
      console.log('Attempting decryption...');
      const decryptedString = await decryptToString(
        {
          accessControlConditions: accessControlConditions as any,
          ciphertext,
          dataToEncryptHash,
          chain: this.chain,
          sessionSigs,
        },
        this.litNodeClient
      );

      console.log('Decryption successful');
      return decryptedString;
    } catch (error) {
      console.error('Decryption failed:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        ciphertext: ciphertext.substring(0, 50) + '...',
        dataToEncryptHash: dataToEncryptHash,
        chain: this.chain,
        accessControlConditions
      });
      
      // If decryption fails due to auth issues, clear cached signatures and retry once
      if (error instanceof Error && (
        error.message.includes('Unauthorized') || 
        error.message.includes('401') ||
        error.message.includes('signature') ||
        error.message.toLowerCase().includes('auth') ||
        error.message.includes('decryption failed')
      )) {
        console.log('Auth/decryption error detected, clearing cache and retrying...', error.message);
        this.clearSessionSignatures();
        
        try {
          // Force reconnect to Lit Protocol 
          await this.connect();
          
          // Set chain to ethereum
          this.setChain();
          
          // Get completely fresh session signatures
          const sessionSigs = await this.getSessionSignatures(true);
          
          console.log('Retrying decryption with fresh session...');
          const decryptedString = await decryptToString(
            {
              accessControlConditions: accessControlConditions as any,
              ciphertext,
              dataToEncryptHash,
              chain: this.chain,
              sessionSigs,
            },
            this.litNodeClient!
          );

          console.log('Retry decryption succeeded!');
          return decryptedString;
        } catch (retryError) {
          console.error('Retry decryption also failed:', retryError);
          throw new Error(`Decryption failed after retry. This might be due to access control condition mismatch or corrupted data. Original error: ${error.message}. Retry error: ${retryError instanceof Error ? retryError.message : String(retryError)}`);
        }
      }
      
      throw error;
    }
  }
}

// Simple function to get basic access control conditions
export const getAccessControlConditions = async (): Promise<AccessControlConditions> => {
  // Use a simple, consistent access control condition
  // This will work for any wallet address on any network
  return [{
    contractAddress: '',
    standardContractType: '' as StandardContractType,
    chain: 'ethereum' as EVMChain,
    method: 'eth_getBalance',
    parameters: [':userAddress', 'latest'],
    returnValueTest: {
      comparator: '>=' as Comparator,
      value: '0',
    },
  }];
};

// Default access control conditions (for backward compatibility)
export const defaultAccessControlConditions: AccessControlConditions = [{
  contractAddress: '',
  standardContractType: '' as StandardContractType,
  chain: 'ethereum' as EVMChain,
  method: 'eth_getBalance',
  parameters: [':userAddress', 'latest'],
  returnValueTest: {
    comparator: '>=' as Comparator,
    value: '1000000000000', // 0.000001 ETH
  },
}]; 
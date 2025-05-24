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
  private chain = 'ethereum' as EVMChain;

  async connect() {
    try {
      this.litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: LIT_NETWORK.DatilDev, // Use DatilDev for development, DatilMain for production
      });
      await this.litNodeClient.connect();
      return true;
    } catch (error) {
      console.error('Failed to connect to Lit Protocol:', error);
      this.litNodeClient = null;
      return false;
    }
  }

  async getSessionSignatures() {
    if (!window.ethereum) {
      throw new Error('Ethereum provider not found');
    }

    if (!this.litNodeClient) {
      throw new Error('Lit Protocol not initialized');
    }

    try {
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

      return sessionSigs;
    } catch (error) {
      console.error('Failed to get session signatures:', error);
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

      // Get session signatures
      const sessionSigs = await this.getSessionSignatures();

      // Decrypt the message
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

      return decryptedString;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }
}

// Example access control condition that requires the user to have at least 0.000001 ETH
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
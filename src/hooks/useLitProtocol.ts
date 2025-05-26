import { useState, useEffect } from 'react';
import { LitProtocolService, defaultAccessControlConditions, getAccessControlConditions, AccessControlConditions } from '../lib/litProtocol';

export const useLitProtocol = () => {
  const [litProtocol, setLitProtocol] = useState<LitProtocolService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initLitProtocol = async () => {
      try {
        const service = new LitProtocolService();
        const connected = await service.connect();
        if (mounted) {
          if (connected) {
            setLitProtocol(service);
            setIsConnected(true);
          } else {
            setError('Failed to connect to Lit Protocol');
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to initialize Lit Protocol');
          setIsLoading(false);
          console.error(err);
        }
      }
    };

    initLitProtocol();

    return () => {
      mounted = false;
    };
  }, []);

  const encryptData = async (
    data: string,
    accessControlConditions?: AccessControlConditions
  ) => {
    if (!litProtocol) {
      throw new Error('Lit Protocol not initialized');
    }
    try {
      // Get simple access control conditions if not provided
      const conditions = accessControlConditions || await getAccessControlConditions();
      console.log('Using access control conditions for encryption:', conditions);
      
      const result = await litProtocol.encrypt(data, conditions);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to encrypt data';
      setError(errorMessage);
      throw err;
    }
  };

  const decryptData = async (
    ciphertext: string,
    dataToEncryptHash: string,
    accessControlConditions?: AccessControlConditions
  ) => {
    if (!litProtocol) {
      throw new Error('Lit Protocol not initialized');
    }
    
    // Get simple access control conditions if not provided
    const conditions = accessControlConditions || await getAccessControlConditions();
    console.log('Using access control conditions for decryption:', conditions);
    
    try {
      const decryptedData = await litProtocol.decrypt(
        ciphertext,
        dataToEncryptHash,
        conditions
      );
      return decryptedData;
    } catch (err) {
      // If it's an auth error, try clearing and reconnecting
      if (err instanceof Error && (
        err.message.includes('Unauthorized') || 
        err.message.includes('401') ||
        err.message.includes('signature') ||
        err.message.toLowerCase().includes('auth')
      )) {
        console.log('Auth error detected in hook, attempting to clear session data...');
        try {
          // Clear any cached session data
          litProtocol.clearSessionSignatures();
          
          // Retry the decryption once more
          console.log('Retrying decryption after clearing session cache...');
          const retryResult = await litProtocol.decrypt(
            ciphertext,
            dataToEncryptHash,
            conditions
          );
          
          // Clear error if retry succeeds
          setError(null);
          return retryResult;
        } catch (retryErr) {
          console.error('Decryption retry failed:', retryErr);
          const errorMessage = retryErr instanceof Error ? retryErr.message : 'Failed to decrypt data after retry';
          setError(`Authentication failed. Please refresh the page and try again. (${errorMessage})`);
          throw retryErr;
        }
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to decrypt data';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    isConnected,
    isLoading,
    error,
    encryptData,
    decryptData,
  };
}; 
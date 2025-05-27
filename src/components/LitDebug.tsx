'use client';

import { useState } from 'react';
import { LitProtocolService, getAccessControlConditions } from '@/lib/litProtocol';

export function LitDebug() {
  const [status, setStatus] = useState<string>('Ready');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const testLitProtocol = async () => {
    try {
      setStatus('Testing Lit Protocol...');
      setError(null);
      setResult(null);

      // Test 1: Create Lit service and connect
      setStatus('Step 1: Creating Lit service...');
      const litService = new LitProtocolService();
      
      setStatus('Step 2: Connecting to Lit Protocol...');
      const connected = await litService.connect();
      if (!connected) {
        throw new Error('Failed to connect to Lit Protocol');
      }
      setStatus('✓ Connected to Lit Protocol');

      // Test 2: Check if MetaMask is available
      if (!window.ethereum) {
        throw new Error('MetaMask not available');
      }

      // Test 3: Get accounts
      setStatus('Step 3: Getting MetaMask accounts...');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (!accounts || accounts.length === 0) {
        throw new Error('No MetaMask accounts available');
      }
      setStatus(`✓ Connected to MetaMask: ${accounts[0]}`);

      // Test 4: Get access control conditions
      setStatus('Step 4: Getting access control conditions...');
      const accessControlConditions = await getAccessControlConditions();
      setStatus('✓ Got access control conditions');
      console.log('Access control conditions:', accessControlConditions);

      // Test 5: Test encrypt
      setStatus('Step 5: Testing encryption...');
      const testMessage = 'Hello, Lit Protocol!';
      const encrypted = await litService.encrypt(testMessage, accessControlConditions);
      setStatus('✓ Encryption successful');
      console.log('Encrypted result:', encrypted);

      // Test 6: Test decrypt
      setStatus('Step 6: Testing decryption...');
      const decrypted = await litService.decrypt(
        encrypted.ciphertext,
        encrypted.dataToEncryptHash,
        accessControlConditions
      );
      setStatus('✓ Decryption successful');
      console.log('Decrypted result:', decrypted);

      if (decrypted === testMessage) {
        setResult('✅ All tests passed! Lit Protocol is working correctly.');
        setStatus('Tests completed successfully');
      } else {
        throw new Error('Decrypted message does not match original');
      }

    } catch (err) {
      console.error('Lit Protocol test failed:', err);
      setError(err instanceof Error ? err.message : String(err));
      setStatus('Test failed');
    }
  };

  return (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      margin: '1rem',
      fontFamily: 'monospace'
    }}>
      <h3>Lit Protocol Debug Test</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>Status:</strong> {status}
      </div>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '1rem',
          padding: '0.5rem',
          backgroundColor: '#ffe6e6',
          borderRadius: '4px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{ 
          color: 'green', 
          marginBottom: '1rem',
          padding: '0.5rem',
          backgroundColor: '#e6ffe6',
          borderRadius: '4px'
        }}>
          {result}
        </div>
      )}
      
      <button 
        onClick={testLitProtocol}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#2ea043',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Test Lit Protocol
      </button>
      
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        This will test the complete Lit Protocol flow: connect → encrypt → decrypt
      </div>
    </div>
  );
} 
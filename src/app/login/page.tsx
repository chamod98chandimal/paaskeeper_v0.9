'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function LoginPage() {
  const router = useRouter();
  const { setAccount } = useAuth();
  const { showPageLoader, hidePageLoader } = useLoading();
  const [localAccount, setLocalAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // On mount, check for existing login
  useEffect(() => {
    const checkExistingLogin = async () => {
      try {
        const savedWallet = localStorage.getItem('paaskeeper_wallet');
        const savedToken = localStorage.getItem('paaskeeper_token');
        if (savedWallet && savedToken) {
          showPageLoader('Checking existing session...');
          setLocalAccount(savedWallet);
          setAccount(savedWallet);  // Update global auth state
          // Already logged in → go to vault
          router.replace('/vault');
        }
      } catch (error) {
        console.error('Error checking existing login:', error);
      } finally {
        setInitializing(false);
        hidePageLoader();
      }
    };

    checkExistingLogin();
  }, [router, setAccount, showPageLoader, hidePageLoader]);

  const connectWallet = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!window.ethereum) {
        setError('MetaMask is not installed.');
        return;
      }

      showPageLoader('Connecting to MetaMask...');

      // Get signer & address
      const signer = await new ethers.BrowserProvider(window.ethereum).getSigner();
      const address = await signer.getAddress();

      showPageLoader('Signing authentication message...');

      // Sign a login message
      const message = 'Log in to Paaskeeper';
      const signature = await signer.signMessage(message);

      showPageLoader('Verifying credentials...');

      // Verify on backend
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, message }),
      });

      const result = await res.json();

      if (res.ok) {
        // Save both wallet & token for persistence
        setLocalAccount(result.address);
        setAccount(result.address);  // Update global auth state
        localStorage.setItem('paaskeeper_wallet', result.address);
        localStorage.setItem('paaskeeper_token', result.token);
        console.log('Verified address:', result.address);
        
        showPageLoader('Login successful! Redirecting...');
        
        // Redirect into the vault
        router.push('/vault');
      } else {
        setError(result.error || 'Verification failed.');
        hidePageLoader();
      }
    } catch (err: unknown) {
      console.error(err);
      setError('Login failed.');
      hidePageLoader();
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <LoadingSpinner 
          size="large" 
          variant="spinner" 
          text="Initializing..."
        />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '400px', 
      margin: '0 auto',
      textAlign: 'center' 
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
        <h1 style={{ marginBottom: '0.5rem' }}>Login to Paaskeeper</h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Connect your MetaMask wallet to access your secure vault
        </p>
      </div>

      {localAccount ? (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#E8F5E9', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <p style={{ color: '#2E7D32', margin: 0 }}>
            ✅ Logged in as: {localAccount.slice(0, 6)}...{localAccount.slice(-4)}
          </p>
        </div>
      ) : (
        <button 
          onClick={connectWallet} 
          disabled={loading}
          style={{
            width: '100%',
            height: '60px',
            padding: '1rem 2rem',
            backgroundColor: loading ? '#ccc' : '#2ea043',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s ease',
            minHeight: '60px',
            boxSizing: 'border-box'
          }}
        >
          {loading && <LoadingSpinner size="small" variant="spinner" text="" />}
          {loading ? 'Connecting...' : '🦊 Connect MetaMask Wallet'}
        </button>
      )}
      
      {error && (
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#FFEBEE',
          color: '#C62828',
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}

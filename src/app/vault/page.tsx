// src/app/vault/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { storeData } from '@/lib/actions';
import { useLitProtocol } from '@/hooks/useLitProtocol';
import { useLoading } from '@/context/LoadingContext';
import LoadingSpinner from '@/components/LoadingSpinner';

interface CredentialData {
  website: string;
  username: string;
  password: string;
}

function VaultContent() {
  const router = useRouter();
  const { showPageLoader, hidePageLoader } = useLoading();
  const [wallet, setWallet] = useState<string | null>(null);
  const [formData, setFormData] = useState<CredentialData>({
    website: '',
    username: '',
    password: ''
  });
  const [status, setStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isStoring, setIsStoring] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { isConnected, encryptData } = useLitProtocol();

  useEffect(() => {
    const initializeVault = async () => {
      try {
        showPageLoader('Loading your vault...');
        const w = localStorage.getItem('paaskeeper_wallet');
        if (!w) {
          router.replace('/login');
          return;
        }
        setWallet(w);
        
        // Simulate a brief loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error('Error initializing vault:', error);
        router.replace('/login');
      } finally {
        setIsInitializing(false);
        hidePageLoader();
      }
    };

    initializeVault();
  }, [router, showPageLoader, hidePageLoader]);

  if (isInitializing || !wallet) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <LoadingSpinner 
          size="large" 
          variant="spinner" 
          text="Loading vault..."
        />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStore = async () => {
    // Validate all fields are filled
    if (!formData.website.trim() || !formData.username.trim() || !formData.password.trim()) {
      setStatus('⚠️ Please fill in all fields.');
      return;
    }

    if (!isConnected) {
      setStatus('⚠️ Lit Protocol not connected. Please try again.');
      return;
    }

    setIsStoring(true);
    setStatus('🔐 Encrypting credentials...');
    
    try {
      // First encrypt the data using Lit Protocol
      const dataString = JSON.stringify(formData);
      const { ciphertext, dataToEncryptHash } = await encryptData(dataString);

      setStatus('📡 Storing on blockchain...');
      
      // Store the encrypted data and its hash
      const encryptedPayload = JSON.stringify({ ciphertext, dataToEncryptHash });
      const txHash = await storeData(encryptedPayload);
      
      setStatus(`✅ Successfully stored! Tx: ${txHash}`);
      
      // Clear form after successful storage
      setFormData({
        website: '',
        username: '',
        password: ''
      });
      
      // Clear status after 5 seconds
      setTimeout(() => setStatus(''), 5000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus(`❌ Error: ${err.message}`);
      } else {
        setStatus(`❌ Error: ${String(err)}`);
      }
    } finally {
      setIsStoring(false);
    }
  };

  return (
    <>
      <style jsx>{`
        input::placeholder {
          color: #6e7681 !important;
          opacity: 1;
        }
      `}</style>
      <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1.5rem', color: '#c9d1d9' }}>Paaskeeper Vault</h1>
      <p style={{ marginBottom: '2rem', color: '#8b949e' }}><strong>Logged in as:</strong> <span style={{ color: '#58a6ff' }}>{wallet}</span></p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="website" style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9' }}>Website or App name</label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="Enter website URL or App name"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#0d1117',
              color: '#c9d1d9'
            }}
          />
        </div>

        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9' }}>Username or Email</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter username or email"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#0d1117',
              color: '#c9d1d9'
            }}
          />
        </div>

        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '0.5rem',
                paddingRight: '2.5rem', // Make room for the icon
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#0d1117',
                color: '#c9d1d9'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          onClick={handleStore}
          disabled={isStoring}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            height: '3rem',
            minHeight: '3rem',
            backgroundColor: isStoring ? '#ccc' : '#2ea043',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: isStoring ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            transition: 'background-color 0.2s ease'
          }}
        >
          {isStoring && <LoadingSpinner size="small" variant="spinner" text="" />}
          {isStoring ? 'Storing...' : '🔒 Store Credentials'}
        </button>

        {status && (
          <p style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '4px',
            fontSize: '0.875rem',
            backgroundColor: status.startsWith('✅')
              ? '#0d1117'
              : status.startsWith('⚠️')
              ? '#0d1117'
              : '#0d1117',
            color: status.startsWith('✅')
              ? '#2ea043'
              : status.startsWith('⚠️')
              ? '#f59e0b'
              : '#f85149',
            border: status.startsWith('✅')
              ? '1px solid #2ea043'
              : status.startsWith('⚠️')
              ? '1px solid #f59e0b'
              : '1px solid #f85149'
          }}>
            {status}
          </p>
        )}
      </div>
    </main>
    </>
  );
}

export default function VaultPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>
          Loading...
        </div>
      </div>
    }>
      <VaultContent />
    </Suspense>
  );
}

'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ADDRESS, ABI } from '@/lib/constants';
import { useLitProtocol } from '@/hooks/useLitProtocol';
import { useAuth } from '@/context/AuthContext';
import { debugLitProtocolState, clearAllAuthData } from '@/lib/browserUtils';

interface CredentialData {
  website: string;
  username: string;
  password: string;
}

interface CredentialEntry {
  id: number;
  website: string;
  username: string;
  password: string;
}

interface EncryptedData {
  ciphertext: string;
  dataToEncryptHash: string;
}

function PasswordVerification({ onVerified }: { onVerified: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { account } = useAuth();

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // check backend server is running
    // try{
    //   const response = await fetch('/api/ping');
    //   if(!response){
    //     throw new Error('Server is not running');
    //   }else{
    //     console.log('Server is running');
    //   }
    // } catch (error) {
    //   setError('Server is not running');
    //   return;
    // }

    try {
      // console.log('account', account);
      // console.log('password', password);

      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: account,
          password: password,
        }),
      });

      // console.log('response', response);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid password');
      }

      onVerified();
    } catch (error) {
      setError('Invalid password. Please try again.');
      console.error('Error verifying password:', error);
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
      <div style={{ 
        padding: '2rem',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '1.8rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          color: '#c9d1d9'
        }}>
          Enter Password
        </h1>
        <form onSubmit={handleVerifyPassword}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                paddingRight: '40px',
                border: `1px solid ${error ? '#f85149' : '#ccc'}`,
                borderRadius: '4px',
                fontSize: '1rem',
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
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#666',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {error && (
            <p style={{ color: '#f85149', marginBottom: '1rem' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#2ea043',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Unlock
          </button>
          <p style={{ 
            marginTop: '1rem', 
            fontSize: '0.9rem', 
            color: '#8b949e', 
            textAlign: 'center' 
          }}>
            If you don't set the password yet, go settings and set password please
          </p>
        </form>
      </div>
    </>
  );
}

function ViewEntriesContent() {
  const [entries, setEntries] = useState<CredentialEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleEntries, setVisibleEntries] = useState<Set<number>>(new Set());
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});
  const [deleting, setDeleting] = useState<number | null>(null);
  const { isConnected, isLoading: litLoading, decryptData } = useLitProtocol();
  
  // Track if entries have been loaded to prevent unnecessary re-loads
  const entriesLoadedRef = useRef(false);
  const loadingRef = useRef(false);

  const router = useRouter();

  const handleClearAuthData = async () => {
    // Debug current state before clearing
    await debugLitProtocolState();
    
    // Clear all authentication data
    clearAllAuthData();
    
    // Redirect to login
    router.push('/login');
  };

  const handleRefreshEntries = () => {
    // Reset flags and reload entries
    entriesLoadedRef.current = false;
    loadingRef.current = false;
    setLoading(true);
    setError(null);
    loadEntries();
  };

  const loadEntries = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (!isConnected || litLoading || loadingRef.current) {
      return;
    }

    // If already loaded entries, don't reload unless forced
    if (entriesLoadedRef.current && entries.length > 0) {
      return;
    }

    loadingRef.current = true;

    try {
      // Debug browser and auth state
      await debugLitProtocolState();
      
      if (!window.ethereum) {
        setError('Please install MetaMask to view your entries.');
        setLoading(false);
        return;
      }

      // Check network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') { // Sepolia chainId
        setError('Please connect to Sepolia testnet to view your entries.');
        setLoading(false);
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

      const fetchedEntries: CredentialEntry[] = [];
      const userAddress = await signer.getAddress();
      const entryCount = await contract.getUserEntryCount(userAddress);

      for (let i = 0; i < entryCount; i++) {
        try {
          const encryptedResult = await contract.getEntry(i);
          if (encryptedResult && encryptedResult !== "0x" && encryptedResult.trim() !== '') {
            try {
              // Parse the encrypted data
              const encryptedData: EncryptedData = JSON.parse(encryptedResult);
              
              // Decrypt the data using Lit Protocol
              const decryptedData = await decryptData(
                encryptedData.ciphertext,
                encryptedData.dataToEncryptHash
              );

              // Parse the decrypted data
              const parsedData = JSON.parse(decryptedData) as CredentialData;
              fetchedEntries.push({
                id: i,
                ...parsedData
              });
            } catch (parseErr) {
              console.error(`Error parsing/decrypting entry ${i}:`, parseErr);
              // If it's an auth error, provide helpful instructions
              if (parseErr instanceof Error && (parseErr.message.includes('Unauthorized') || parseErr.message.includes('401'))) {
                console.log('Authentication error detected for entry', i);
                // Don't throw here, just log and continue to other entries
              }
            }
          }
        } catch (entryErr) {
          console.error(`Error fetching entry ${i}:`, entryErr);
        }
      }

      setEntries(fetchedEntries);
      setError(null);
      entriesLoadedRef.current = true;
    } catch (err) {
      console.error('Error loading entries:', err);
      
      // Provide specific error messages for common auth issues
      if (err instanceof Error && (err.message.includes('Unauthorized') || err.message.includes('401'))) {
        setError('Authentication failed. Please try the following: 1) Refresh the page, 2) Disconnect and reconnect MetaMask, 3) Clear browser data for this site.');
      } else {
        setError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [decryptData, isConnected, litLoading]);

  useEffect(() => {
    // Only run once when Lit Protocol is connected and ready
    let mounted = true;
    
    if (!litLoading && isConnected && mounted) {
      loadEntries();
    }

    return () => {
      mounted = false;
    };
  }, [litLoading, isConnected]); // Removed loadEntries from dependencies to prevent infinite loop

  const toggleEntryVisibility = (index: number) => {
    setVisibleEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, field: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ [`${index}-${field}`]: true });
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [`${index}-${field}`]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async (entryId: number) => {
    try {
      setDeleting(entryId);
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

      // Call the deleteEntry function with the actual blockchain entry ID
      const tx = await contract.deleteEntry(entryId);
      await tx.wait();

      // Remove the entry from the local state
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
      setDeleting(null);
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete entry. Please try again.');
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#8b949e' }}>
          Loading your stored credentials from blockchain...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: '#f85149', marginBottom: '1rem' }}>
          {error}
        </div>
        {(error.includes('Authentication') || error.includes('Unauthorized') || error.includes('401')) && (
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={handleClearAuthData}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f85149',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                marginRight: '1rem'
              }}
            >
              Clear Auth Data & Re-login
            </button>
            <button
              onClick={() => window.location.reload()}
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
              Refresh Page
            </button>
          </div>
        )}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem', color: '#8b949e' }}>No stored entries found.</p>
        <p style={{ marginBottom: '1rem', color: '#8b949e', fontSize: '0.9rem' }}>
          If you expect to see entries here, try refreshing the page or clearing authentication data.
        </p>
        <button
          onClick={() => router.push('/vault')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2ea043',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginRight: '1rem'
          }}
        >
          Store New Credentials
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1f6feb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginRight: '1rem'
          }}
        >
          Refresh Page
        </button>
        <button
          onClick={() => router.push('/debug')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Debug Lit Protocol
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#c9d1d9' }}>Your Stored Credentials</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleRefreshEntries}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#1f6feb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Refresh
          </button>
          <button
            onClick={() => router.push('/vault')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2ea043',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Store New Credentials
          </button>
        </div>
      </div>

      {entries.map((entry, index) => (
        <div
          key={entry.id}
          style={{
            backgroundColor: '#161b22',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1rem',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
            border: '1px solid #30363d'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#c9d1d9' }}>{entry.website}</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => router.push(`/vault/edit?id=${entry.id}`)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#1f6feb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                disabled={deleting === entry.id}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: deleting === entry.id ? '#9CA3AF' : '#f85149',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: deleting === entry.id ? 'not-allowed' : 'pointer'
                }}
              >
                {deleting === entry.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#8b949e', width: '80px' }}>Username:</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ flex: 1, color: '#d1d5da' }}>{entry.username}</span>
                  <button
                    onClick={() => copyToClipboard(entry.username, 'username', index)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: copyStatus[`${index}-username`] ? '#10B981' : '#21262d',
                      color: copyStatus[`${index}-username`] ? 'white' : '#c9d1d9',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    {copyStatus[`${index}-username`] ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </label>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#8b949e', width: '80px' }}>Password:</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ flex: 1, color: '#d1d5da' }}>
                    {visibleEntries.has(index) ? entry.password : '••••••••'}
                  </span>
                  <button
                    onClick={() => toggleEntryVisibility(index)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#21262d',
                      color: '#c9d1d9',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    {visibleEntries.has(index) ? '🙈' : '👁️'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(entry.password, 'password', index)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: copyStatus[`${index}-password`] ? '#10B981' : '#21262d',
                      color: copyStatus[`${index}-password`] ? 'white' : '#c9d1d9',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    {copyStatus[`${index}-password`] ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ViewEntriesPage() {
  const [isVerified, setIsVerified] = useState(false);

  if (!isVerified) {
    return (
      <Suspense fallback={
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', color: '#8b949e' }}>
            Loading...
          </div>
        </div>
      }>
        <PasswordVerification onVerified={() => setIsVerified(true)} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#8b949e' }}>
          Loading...
        </div>
      </div>
    }>
      <ViewEntriesContent />
    </Suspense>
  );
}

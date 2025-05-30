'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ADDRESS, ABI } from '../../../lib/constants';
import { useLitProtocol } from '@/hooks/useLitProtocol';

interface CredentialData {
  website: string;
  username: string;
  password: string;
}

interface EncryptedData {
  ciphertext: string;
  dataToEncryptHash: string;
}

function EditCredentialForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entryId = searchParams.get('id');
  
  const [formData, setFormData] = useState<CredentialData>({
    website: '',
    username: '',
    password: ''
  });
  const [status, setStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const { isConnected, isLoading: litLoading, encryptData, decryptData } = useLitProtocol();

  useEffect(() => {
    async function loadEntry() {
      if (!entryId || dataLoaded) {
        if (!entryId) {
          router.push('/vault/view');
        }
        return;
      }

      try {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask to edit your entries.');
        }

        if (!isConnected) {
          setStatus('Waiting for Lit Protocol to connect...');
          return;
        }

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

        const encryptedResult = await contract.getEntry(entryId);
        if (!encryptedResult || encryptedResult === "0x" || encryptedResult.trim() === '') {
          setStatus('Entry not found or has been deleted.');
          setTimeout(() => {
            router.push('/vault/view');
          }, 2000);
          return;
        }

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
          setFormData(parsedData);
          setDataLoaded(true);
          setDecryptError(null);
        } catch (parseErr) {
          console.error('Error parsing/decrypting entry:', parseErr);
          setDecryptError(parseErr instanceof Error ? parseErr.message : 'Failed to decrypt entry');
          setStatus('Failed to decrypt entry data. Please try again.');
        }
      } catch (err) {
        console.error('Error loading entry:', err);
        if (err instanceof Error && err.message.includes('BAD_DATA')) {
          setStatus('Entry not found or has been deleted.');
          setTimeout(() => {
            router.push('/vault/view');
          }, 2000);
        } else {
          setStatus('Failed to load entry. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    if (!litLoading && isConnected) {
      loadEntry();
    }
  }, [entryId, router, isConnected, litLoading, decryptData, dataLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (!entryId) return;

    // Validate all fields are filled
    if (!formData.website.trim() || !formData.username.trim() || !formData.password.trim()) {
      setStatus('⚠️ Please fill in all fields.');
      return;
    }

    if (!isConnected) {
      setStatus('⚠️ Lit Protocol not connected. Please try again.');
      return;
    }

    setStatus('⏳ Encrypting and updating credentials…');
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

      // First encrypt the new data
      const dataString = JSON.stringify(formData);
      const { ciphertext, dataToEncryptHash } = await encryptData(dataString);
      const encryptedPayload = JSON.stringify({ ciphertext, dataToEncryptHash });

      // Create new entry first
      const createTx = await contract.createEntry(encryptedPayload);
      await createTx.wait();

      // Then delete the old entry
      const deleteTx = await contract.deleteEntry(entryId);
      await deleteTx.wait();
      
      setStatus(`✅ Updated! Create Tx: ${createTx.hash}, Delete Tx: ${deleteTx.hash}`);
      
      // Redirect back to view page after successful update
      setTimeout(() => {
        router.push('/vault/view');
      }, 2000);
    } catch (err) {
      console.error('Error updating entry:', err);
      setStatus(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
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
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem', color: '#c9d1d9' }}>Edit Credentials</h1>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#666' }}>
          Loading credential details...
        </div>
              ) : decryptError ? (
        <div style={{ color: '#f85149', padding: '1rem', backgroundColor: '#0d1117', border: '1px solid #f85149', borderRadius: '4px', marginBottom: '1rem' }}>
          <p>Error decrypting entry: {decryptError}</p>
          <button
            onClick={() => router.push('/vault/view')}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#f85149',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9' }}>
              Website
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '0.25rem',
                  backgroundColor: '#0d1117',
                  color: '#c9d1d9'
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9' }}>
              Username
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '0.25rem',
                  backgroundColor: '#0d1117',
                  color: '#c9d1d9'
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9' }}>
              Password
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    marginTop: '0.25rem',
                    backgroundColor: '#0d1117',
                    color: '#c9d1d9'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleUpdate}
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
              Update Credentials
            </button>
            <button
              onClick={() => router.push('/vault/view')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f85149',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {status && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#0d1117',
            borderRadius: '4px',
            color: status.includes('❌') ? '#f85149' : '#2ea043',
            border: status.includes('❌') ? '1px solid #f85149' : '1px solid #2ea043',
            fontSize: '0.85rem'
          }}
        >
          {status}
        </div>
      )}
    </div>
    </>
  );
}

export default function EditCredentialPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>
          Loading...
        </div>
      </div>
    }>
      <EditCredentialForm />
    </Suspense>
  );
} 
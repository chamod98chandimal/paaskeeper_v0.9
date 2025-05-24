'use client';

import { useState } from 'react';
import { useVaultContract } from '../hooks/useVaultContract';

export default function VaultForm() {
  const contract = useVaultContract();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleStore = async () => {
    if (!contract) {
      setMessage('Contract not ready.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Replace with encrypted data if you add encryption later
      const tx = await contract.storeData(input);
      await tx.wait();

      setMessage('✅ Data stored successfully!');
      setInput('');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to store data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px' }}>
      <h2>Store Encrypted Data</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter encrypted string"
        style={{ width: '100%', padding: '0.5rem' }}
      />
      <button
        onClick={handleStore}
        disabled={loading || !input}
        style={{ marginTop: '1rem' }}
      >
        {loading ? 'Storing...' : 'Store'}
      </button>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

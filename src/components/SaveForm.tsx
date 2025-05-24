'use client';

import { useState } from 'react';
import { storeData } from '@/lib/actions';

export default function SaveForm() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const txHash = await storeData(input);
      console.log('Data saved! Tx:', txHash);
      alert(`Data saved! Tx: ${txHash}`);
    } catch (err) {
      console.error('Error saving:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Encrypted data"
        className="border p-2"
      />
      <button
        onClick={handleSave}
        disabled={loading}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Saving...' : 'Save to Blockchain'}
      </button>
    </div>
  );
}

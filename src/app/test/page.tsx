'use client';

import { useState } from 'react';
import { storeData } from '@/lib/actions';

export default function ContractTestPage() {
  const [encryptedData, setEncryptedData] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleStore = async () => {
    if (!encryptedData) {
      setStatusMessage('Please enter some data to store!');
      return;
    }

    try {
      await storeData(encryptedData);
      setStatusMessage('Data successfully stored in contract!');
    } catch (error) {
      setStatusMessage('Error storing data. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Test Smart Contract</h1>
      <div>
        <textarea
          value={encryptedData}
          onChange={(e) => setEncryptedData(e.target.value)}
          placeholder="Enter encrypted data"
          rows={5}
          cols={40}
        />
      </div>
      <button onClick={handleStore}>Store Data</button>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
}

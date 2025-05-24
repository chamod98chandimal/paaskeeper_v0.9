import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractJson from '@/abi/VaultStorage.json';

const CONTRACT_ADDRESS = '0x54361eFa03584db2Cc3397Afd741bE8b8870f51D';
const contractABI = contractJson.abi;

export function useVaultContract() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const loadContract = async () => {
      if (typeof window.ethereum === 'undefined') return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const vaultContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      setContract(vaultContract);
    };

    loadContract();
  }, []);

  return contract;
}

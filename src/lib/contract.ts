// src/lib/contract.ts
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
import { Abi } from 'viem';
import contractJson from '@/abi/VaultStorage.json';

const CONTRACT_ADDRESS = '0x54361eFa03584db2Cc3397Afd741bE8b8870f51D' as const;
const CONTRACT_ABI = contractJson.abi as unknown as Abi;  // ← raw array

export function getContract() {
  const client = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum!),
  });

  return {
    client,
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  };
}

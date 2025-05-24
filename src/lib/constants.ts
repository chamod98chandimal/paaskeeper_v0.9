// Contract address on Sepolia testnet
export const CONTRACT_ADDRESS = '0x54361eFa03584db2Cc3397Afd741bE8b8870f51D';

// Contract ABI
export const ABI = [
  {
    inputs: [{ internalType: 'string', name: 'encryptedData', type: 'string' }],
    name: 'createEntry',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'entryId', type: 'uint256' }],
    name: 'getEntry',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserEntryCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'entryId', type: 'uint256' }],
    name: 'deleteEntry',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  }
]; 
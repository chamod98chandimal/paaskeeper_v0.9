// src/lib/actions.ts
import { getContract } from '@/lib/contract';

export async function storeData(encryptedData: string) {
  const { client, address, abi } = getContract();
  const [account] = await client.getAddresses();

  try {
    const txHash = await client.writeContract({
      address,
      abi,
      functionName: 'createEntry',
      args: [encryptedData],
      account,
    });
    console.log('Data stored, tx hash:', txHash);
    return txHash;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('🛑 storeData error:', err.message);
    } else {
      console.error('🛑 storeData error:', String(err));
    }
    throw err; // let the caller see the real error message
  }
}

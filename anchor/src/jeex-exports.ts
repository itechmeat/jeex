// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import JeexIDL from '../target/idl/jeex.json';
import type { Jeex } from '../target/types/jeex';

// Re-export the generated IDL and type
export { Jeex, JeexIDL };

// The programId is imported from the program IDL.
export const JEEX_PROGRAM_ID = new PublicKey(JeexIDL.address);

// This is a helper function to get the Jeex Anchor program.
export function getJeexProgram(provider: AnchorProvider) {
  return new Program(JeexIDL as Jeex, provider);
}

// This is a helper function to get the program ID for the Jeex program depending on the cluster.
export function getJeexProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Jeex program on devnet and testnet.
      // You should replace this with your actual devnet/testnet program ID
      return new PublicKey('Gkspqei1iisV5gbqiTw78henHkLbcaKCFKdbmTTpFmcF');
    case 'mainnet-beta':
    default:
      return JEEX_PROGRAM_ID;
  }
}

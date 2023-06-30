import { Keypair } from '@solana/web3.js';


export function generateSolanaWallet() {
  const wallet = Keypair.generate();
  const publicKey = wallet.publicKey.toBase58();
  const privateKey = wallet.secretKey.toString('hex');

  return {
    publicKey: publicKey,
    privateKey: privateKey
  };
}

// Example usage
const solanaWallet = generateSolanaWallet();
console.log('Solana Public Key:', solanaWallet.publicKey);
console.log('Solana Private Key:', solanaWallet.privateKey);
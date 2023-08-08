import { ethers } from 'ethers';

export function generateEthereumWallet() {
  const wallet = ethers.Wallet.createRandom();
  const privateKey = wallet.privateKey;
  const publicKey = wallet.publicKey;
  const address = wallet.address;

  return {
    privateKey: privateKey,
    publicKey: publicKey,
    address: address
  };
}

// Example usage
const ethereumWallet = generateEthereumWallet();
// console.log('Ethereum Private Key:', ethereumWallet.privateKey);
// console.log('Ethereum Public Key:', ethereumWallet.publicKey);
// console.log('Ethereum Address:', ethereumWallet.address);
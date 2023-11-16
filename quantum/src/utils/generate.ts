import CoinKey from 'coinkey'
import { ethers } from 'ethers';
import { Keypair } from '@solana/web3.js';

export function generateBitcoinWallet() {
    const wallet = new CoinKey.createRandom();
    return wallet
};

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


 

  export function generateSolanaWallet() {
    const wallet = Keypair.generate();
    const publicKey = wallet.publicKey.toBase58();
    const privateKey = wallet.secretKey.toString();
  
    return {
      publicKey: publicKey,
      privateKey: privateKey
    };
  }
  
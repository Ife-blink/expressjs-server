import { generateBitcoinWallet, generateEthereumWallet, generateSolanaWallet } from "./data.js";

const wallet = await generateBitcoinWallet()
console.log(wallet.addressFromXpub, wallet.privateKey)

const ethwallet = await generateEthereumWallet()
console.log(ethwallet.privateKey, ethwallet.address)
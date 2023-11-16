import { generateBitcoinWallet } from "./data.js";
import { generateEthereumWallet } from "./addressGenerators/ethereum.js";
import { generateSolanaWallet } from "./addressGenerators/solana.js";
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv'


dotenv.config();

// Supabase project credentials
const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

// Initialize Supabase client
const supabase = createClient(url, privateKey, {
  auth: {
    persistSession: false
  
}});

// Function to store wallet addresses for a user
export async function createWalletAddresses(uuid) {
  try {
     
    const solWallet = generateSolanaWallet();
   // console.log('Solana Public Key:', solWallet.publicKey);
   // console.log('Solana Private Key:', solWallet.privateKey);

    const btcWallet = generateBitcoinWallet();
    //console.log("SAVE BUT DO NOT SHARE THIS:", btcWallet.privateKey.toString('hex'));
    //console.log("Address:", btcWallet.publicAddress);

    const ethWallet = generateEthereumWallet();
    // console.log('Ethereum Private Key:', ethWallet.privateKey);
    // console.log('Ethereum Public Key:', ethWallet.publicKey);
    // console.log('Ethereum Address:', ethWallet.address);
    // Construct the data objects with user ID and wallet addresses for each cryptocurrency
    const bitcoinWallet = {
      publicKey: btcWallet.publicAddress,
      privateKey: btcWallet.privateKey.toString('hex'),
    };

    const solanaWallet = {
      publicKey: solWallet.publicKey,
      privateKey: solWallet.privateKey,
    };

    const ethereumWallet = {
      publicKey: ethWallet.address,
      privateKey: ethWallet.privateKey,
    };

    const id = uuid
    

    const { data, error } = await supabase.from('wallets').insert({ user_id: id, bitcoin_wallet: bitcoinWallet, eth_wallet: ethereumWallet, sol_wallet: solanaWallet });
    
   // console.log(data);
    //console.log(error)
    console.log('Wallet addresses stored successfully');
  } catch (error) {
    console.error('Error storing wallet addresses:', error.message);
  }
}


// Usage example
// const userId = 'USER_ID'; // Provide the user ID for whom you want to store wallet addresses
// const walletAddresses = {
//   bitcoin: ['BITCOIN_ADDRESS_1', 'BITCOIN_ADDRESS_2'], // Provide Bitcoin wallet addresses
//   solana: ['SOLANA_ADDRESS_1', 'SOLANA_ADDRESS_2'], // Provide Solana wallet addresses
//   ethereum: ['ETHEREUM_ADDRESS_1', 'ETHEREUM_ADDRESS_2'], // Provide Ethereum wallet addresses
// };

//createWalletAddresses();

import Mnemonic  from "bitcore-mnemonic";
import bip39 from 'bip39'
import solanaWeb3, { Keypair } from '@solana/web3.js'



async function getKeyCreatedBySolanaKeygenFromMnemonic(mnemonic, password) {
    const pass = ''
    const seed = await bip39.mnemonicToSeed(mnemonic, pass)
    let derivedSeed = seed.subarray(0, 32);
    const kp = Keypair.fromSeed(derivedSeed);
    return kp;
}

async function main() {
    var code = new Mnemonic(Mnemonic.Words.SPANISH);
    const mnemonic = code.toString();
    const kp = await getKeyCreatedBySolanaKeygenFromMnemonic(mnemonic);
    console.log('Public key', kp.publicKey.toBase58())
}

main();
  
  //generateSolanaKeypairFromMnemonic().catch((err) => console.error(err));
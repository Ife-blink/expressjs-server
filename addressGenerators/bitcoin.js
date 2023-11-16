import CoinKey from 'coinkey'

export function generateBitcoinWallet() {
    const wallet = new CoinKey.createRandom();
    return wallet
}

const wallet = generateBitcoinWallet();

console.log("SAVE BUT DO NOT SHARE THIS:", wallet.privateKey.toString('hex'));
console.log("Address:", wallet.publicAddress);

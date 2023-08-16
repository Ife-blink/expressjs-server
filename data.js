import { TatumBtcSDK } from '@tatumio/btc'
import { TatumEthSDK } from '@tatumio/eth'
import { TatumSolanaSDK } from '@tatumio/solana'

const btcSDK = TatumBtcSDK({ apiKey: '89c8f5be-d4cf-407d-b721-28a696965e3d' })
const { mnemonic, xpub } = await btcSDK.wallet.generateWallet(undefined, { testnet: false })

export async function generateBitcoinWallet() {

  //console.log(`Mnemonic: ${mnemonic}`)
  // console.log(`Xpub: ${xpub}`)

  // Generate an BTC private key
  // You can find more details in https://apidoc.tatum.io/tag/Bitcoin#operation/BtcGenerateAddressPrivateKey
  const privateKey = await btcSDK.wallet.generatePrivateKeyFromMnemonic(mnemonic, 0, { testnet: false })
 // console.log(`Private key: ${privateKey}`)

  // Generate BTC deposit address from xpub
  // You can find more details in https://apidoc.tatum.io/tag/Bitcoin#operation/BtcGenerateAddress
  const addressFromXpub = btcSDK.wallet.generateAddressFromXPub(xpub, 0, { testnet: false })
  //console.log(`Address from xpub: ${addressFromXpub}`)

  return {
      mnemonic,
      addressFromXpub,
      privateKey
  }
}

// const wallet = await generateBitcoinWallet()
// console.log(wallet.addressFromXpub, wallet.privateKey)


export async function generateEthereumWallet() {

  const ethSDK = TatumEthSDK({ apiKey: '89c8f5be-d4cf-407d-b721-28a696965e3d' })

    // Generate ethereum wallet
    // https://apidoc.tatum.io/tag/Ethereum#operation/EthGenerateWallet
    const { xpub: ethxpub } = await ethSDK.wallet.generateWallet(undefined, { testnet: true })
  
    // Generate public address from xpub
    // https://apidoc.tatum.io/tag/Ethereum#operation/EthGenerateAddress
    const address = ethSDK.wallet.generateAddressFromXPub(ethxpub, 0)
    //console.log(`Public address is ${address}`)
  
    // Generate private key from mnemonic
    // https://apidoc.tatum.io/tag/Ethereum#operation/EthGenerateAddressPrivateKey
    const ethprivateKey = await ethSDK.wallet.generatePrivateKeyFromMnemonic(mnemonic, 0, { testnet: true })
    // console.log(`private key is ${ethprivateKey}`)
 

  return {
    privateKey: ethprivateKey,
    address: address
  };
}


 

export function generateSolanaWallet() {
  const solanaSDK = TatumSolanaSDK({ apiKey: '89c8f5be-d4cf-407d-b721-28a696965e3d' })

  const { privateKey: solprivateKey, address: soladdress } = solanaSDK.wallet.wallet()
//    console.log(
//    `Address: ${soladdress}`,
//  )
 
//  console.log(
//    `My public address is ${soladdress}, with private key ${solprivateKey}.`,
//  )

return {
  privateKey: solprivateKey,
  address: soladdress
};
}


// const wallet = await generateSolanaWallet()
// console.log(wallet.privateKey, wallet.address)


 
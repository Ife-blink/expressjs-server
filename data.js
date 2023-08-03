import { TatumBtcSDK } from '@tatumio/btc'
import { TatumEthSDK } from '@tatumio/eth'

  const btcSDK = TatumBtcSDK({ apiKey: '89c8f5be-d4cf-407d-b721-28a696965e3d' })
  const { mnemonic, xpub } = await btcSDK.wallet.generateWallet(undefined, { testnet: false })
  console.log(`Mnemonic: ${mnemonic}`)
  console.log(`Xpub: ${xpub}`)

  // Generate an BTC private key
  // You can find more details in https://apidoc.tatum.io/tag/Bitcoin#operation/BtcGenerateAddressPrivateKey
  const privateKey = await btcSDK.wallet.generatePrivateKeyFromMnemonic(mnemonic, 0, { testnet: false })
  console.log(`Private key: ${privateKey}`)

  // Generate BTC deposit address from xpub
  // You can find more details in https://apidoc.tatum.io/tag/Bitcoin#operation/BtcGenerateAddress
  const addressFromXpub = btcSDK.wallet.generateAddressFromXPub(xpub, 0, { testnet: false })
  console.log(`Address from xpub: ${addressFromXpub}`)

  // const ethSDK = TatumEthSDK({ apiKey: '89c8f5be-d4cf-407d-b721-28a696965e3d' })


  //   // Generate ethereum wallet
  //   // https://apidoc.tatum.io/tag/Ethereum#operation/EthGenerateWallet
  //   const { mnemonic, xpub } = await ethSDK.wallet.generateWallet(undefined, { testnet: true })
  
  //   // Generate public address from xpub
  //   // https://apidoc.tatum.io/tag/Ethereum#operation/EthGenerateAddress
  //   const address = ethSDK.wallet.generateAddressFromXPub(xpub, 0)
  //   console.log(`Public address is ${address}`)
  
  //   // Generate private key from mnemonic
  //   // https://apidoc.tatum.io/tag/Ethereum#operation/EthGenerateAddressPrivateKey
  //   const privateKey = await ethSDK.wallet.generatePrivateKeyFromMnemonic(mnemonic, 0, { testnet: true })
  //   console.log(`private key is ${privateKey}`)
 
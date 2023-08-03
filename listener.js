import { TatumBtcSDK } from '@tatumio/btc'

export async function btcSubscriptionsExample() {
  const btcSDK = TatumBtcSDK({ apiKey: '89c8f5be-d4cf-407d-b721-28a696965e3d' })

  // Create subscription notification for receiving webhooks on all incoming/outgoing transactions on the address.
  // FREE plans are limited to 10 addresses monitoring per api key, this call will likely fail with the default api key.
  // You can find more details in https://apidoc.tatum.io/tag/Notification-subscriptions#operation/createSubscription
  try {
    const { id } = await btcSDK.subscriptions.createSubscription({
      type: 'ADDRESS_TRANSACTION',
      attr: {
        address: 'bc1q2qt52jej0tewknalr0xfmv5svmg4vpp3skj8wp',
        chain: 'BTC',
        url: 'https://dashboard.tatum.io/webhook-handler',
      },
    })
    console.log(`Subscription ID: ${id}, could be deleted later using deleteSubscription(id)`)
    await btcSDK.subscriptions.deleteSubscription(id)
  } catch (e) {
    console.log(`Subscription: ${e.message}`)
  }

  // See a list of all fired webhooks
  // You can find more details in https://apidoc.tatum.io/tag/Notification-subscriptions#operation/getAllWebhooks
  const webhooks = await btcSDK.subscriptions.getAllWebhooks(50)
  console.log(`Webhooks: ${JSON.stringify(webhooks)}`)
}

async function run() {
    const resp = await fetch(
      `https://api.tatum.io/v3/subscription`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '89c8f5be-d4cf-407d-b721-28a696965e3d'
        },
        body: JSON.stringify({
          type: 'ADDRESS_TRANSACTION',
          attr: {
            address: 'bc1q2qt52jej0tewknalr0xfmv5svmg4vpp3skj8wp',
            chain: 'BTC',
            url: 'https://dashboard.tatum.io/webhook-handler',
          }
        })
      }
    );
  
    const data = await resp.json();
    console.log(data);
  }
  
  run();

//btcSubscriptionsExample()
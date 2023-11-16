import WebSocket from "ws";

// WebSocket connection URL
const wsUrl = 'wss://ws.blockchain.info/inv';

// Create a WebSocket instance
const ws = new WebSocket(wsUrl);

// Keep track of subscribed addresses using a Set
const subscribedAddresses = new Set();

// Function to subscribe to an address
function subscribeToAddress(address) {
  // Check if not already subscribed
  if (!subscribedAddresses.has(address)) {
    // Subscribe to the address
    const subscribeMessage = {
      op: 'addr_sub',
      addr: address,
    };
    ws.send(JSON.stringify(subscribeMessage));

    // Add to the set of subscribed addresses
    subscribedAddresses.add(address);
  }
}

// Function to unsubscribe from an address
function unsubscribeFromAddress(address) {
  // Check if subscribed
  if (subscribedAddresses.has(address)) {
    // Unsubscribe from the address
    const unsubscribeMessage = {
      op: 'addr_unsub',
      addr: address,
    };
    ws.send(JSON.stringify(unsubscribeMessage));

    // Remove from the set of subscribed addresses
    subscribedAddresses.delete(address);
  }
}

// Handle WebSocket connection open event
ws.on('open', () => {
  console.log('WebSocket connection opened');

  // Subscribe to multiple addresses
  const addressesToSubscribe = ['1EnwEjpEiHUMy3DKQvJzTGwCKzB4WMH1KZ', '1HCkZNMegXyf9eY3CVZiGAzWLkQyfd8b4x'];
  addressesToSubscribe.forEach((address) => subscribeToAddress(address));
});

// Handle WebSocket message event
ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('Received message:', message);

  // Check if it's a new transaction
  if (message.op === 'utx') {
    console.log('New transaction for address:', message.x);
  }
});

// Handle WebSocket connection close event
ws.on('close', () => {
  console.log('WebSocket connection closed');
});

// Handle WebSocket connection error event
ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

import WebSocket from 'ws';

const ws = new WebSocket('wss://ws.blockchain.info/inv');

ws.on('open', () => {
    console.log('Listening to changes in address');
    const subscriptionMessage = {
        // op: 'unconfirmed_sub',
        op: "addr_sub",
        addr: "1NpsjXkxk2B3B2WxRQFQHv2eHFHVRN4nLz"
      };
      
      ws.send(JSON.stringify(subscriptionMessage));
  });

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    
    // Handle the received message
    console.log('Received message:', message);
  });

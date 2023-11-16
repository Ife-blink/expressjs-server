import WebSocket from "ws";

const ws = new WebSocket('wss://3000-ifeblink-expressjsserve-r1rztzv3pl9.ws-eu106.gitpod.io');

ws.on('open', () => {
  console.log('Connected to WebSocket server');

  // Send a test message to the server
  if (ws.readyState === WebSocket.OPEN) {
    ws.send('Hello, WebSocket server!');
  }
});

ws.on('message', (data) => {
  console.log('Received message from server:', data);


  // Convert the buffer to a string
  const jsonString = data.toString('utf-8');

  console.log(jsonString);
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('Connection closed');
});

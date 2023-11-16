// src/websocket.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  sendMessage(message: string) {
    console.log('message: ' + message)
    this.server.clients.forEach(client => {
      // Check if the client is still open
      if (client.readyState === WebSocket.OPEN) {
        // Send the message to the client
        client.send(message);
      }
    });
  }
}

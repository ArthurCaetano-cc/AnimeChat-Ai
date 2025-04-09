import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from 'src/messages/dto/send-message.dto';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: /\/chat\/[0-9a-fA-F-]{36}/,
})
export class ChatGateways
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessagesService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }
  handleConnection(client: Socket) {
    console.log(
      `Client connected: ${client.id} (namespace: ${client.nsp.name})`,
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    client: Socket,
    payload: {
      chatId: string;
      userId: string;
      content: string;
      role: 'USER' | 'AGENT';
    },
  ) {
    const chatId = client.nsp.name.split('/').pop();
    if (!chatId) {
      console.error('Chat ID not found in namespace');
      client.disconnect();
      return;
    }

    this.messageService
      .sendMessage({
        chatId: payload.chatId,
        userId: payload.userId,
        content: payload.content,
        role: payload.role,
      })
      .then((response) => {
        client.emit('message', response);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        client.emit('error', {
          message: 'Error sending message',
          error: (error as Error).message,
        });
      });
  }
}

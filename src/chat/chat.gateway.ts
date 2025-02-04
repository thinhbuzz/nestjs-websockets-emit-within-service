import { Logger } from '@nestjs/common/services';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
  namespace: 'websocket',
  transports: ['websocket'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;
  private logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    // this.roomService.server = server;
  }

  @SubscribeMessage('chat')
  async handleChatEvent(@MessageBody() payload: string): Promise<void> {
    try {
      this.server.emit('chat', payload);
    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}

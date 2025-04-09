import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatGateways } from './chat.gateway';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService, ChatGateways, MessagesService],
})
export class ChatModule {}

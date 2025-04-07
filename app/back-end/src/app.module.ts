import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentsModule } from './agents/agents.module';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [AgentsModule, ChatModule, UsersModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

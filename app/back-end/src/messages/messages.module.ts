import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessagesController } from './messages.controller';
import { HttpService } from '@nestjs/axios';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, HttpService],
})
export class MessagesModule {}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async sendMessage(createMessageDto: SendMessageDto) {
    try {
      const { chatId, userId, content } = createMessageDto;

      console.log(JSON.stringify(createMessageDto));

      if (!chatId || !userId || !content) {
        throw new BadRequestException({
          message: 'Chat ID, User ID, and content are required',
          error: 'Bad Request',
        });
      }

      const chat = await this.prisma.chat.findUnique({
        where: {
          id: chatId,
        },
        include: {
          agent: true,
        },
      });
      if (!chat) {
        throw new NotFoundException({
          message: 'Chat not found',
        });
      }

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException({
          message: 'User not found',
        });
      }

      await this.prisma.message.create({
        data: {
          chatId: chat.id,
          userId: user.id,
          content,
        },
      });

      const response = this.httpService.post<{
        answer: string;
      }>(`${process.env.AI_SERVICE_URL}/ask`, {
        chatId: chat.id,
        text: content,
        personagem: chat.agent.name,
      });

      const { data } = await firstValueFrom(response);
      await this.prisma.message.create({
        data: {
          chatId: chat.id,
          content: data.answer,
          role: 'AGENT',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }

  async findAllOfAChat(chatId: string) {
    try {
      const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
      if (!chat) {
        throw new NotFoundException({
          message: 'Chat not found',
        });
      }

      const messages = await this.prisma.message.findMany({
        where: {
          chatId: chat.id,
        },
      });

      return messages;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }
}

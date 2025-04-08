import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMessageDto: SendMessageDto) {
    try {
      const { chatId, userId, content } = createMessageDto;

      const chat = await this.prisma.chat.findUnique({
        where: {
          id: chatId,
        },
      });
      if (!chat) {
        throw new NotFoundException({
          message: 'Chat not found',
        });
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new NotFoundException({
          message: 'User not found',
        });
      }

      const createdMessage = await this.prisma.message.create({
        data: {
          chatId: chat.id,
          userId: user.id,
          content,
        },
      });

      return {
        location: `/messages/${createdMessage.id}`,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }

  findAllOfAChat(chatId: string) {
    try {
      const messages = this.prisma.message.findMany({
        where: {
          chatId,
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

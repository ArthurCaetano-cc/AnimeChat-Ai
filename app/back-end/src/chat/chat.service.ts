import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChatDto: CreateChatDto) {
    try {
      const { userId, agentId } = createChatDto;
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

      const agent = await this.prisma.agent.findUnique({
        where: {
          id: agentId,
        },
      });

      if (!agent) {
        throw new NotFoundException({
          message: 'Agent not found',
        });
      }

      const createdChat = await this.prisma.chat.create({
        data: {
          userId: user.id,
          agentId: agent.id,
        },
      });

      return {
        location: `/chat/${createdChat.id}`,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }

  async findAllOfAUser(userId: string) {
    try {
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

      const chats = await this.prisma.chat.findMany({
        where: {
          userId: user.id,
        },
      });

      return chats;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }
  async findOne(id: string) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: {
          id,
        },
      });

      if (!chat) {
        throw new NotFoundException({
          message: 'Chat not found',
        });
      }

      return chat;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }
  async remove(id: string) {
    try {
      await this.prisma.chat.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Chat deleted successfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Agent not found');
        }
      }
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }
}

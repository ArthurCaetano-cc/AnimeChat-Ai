import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAgentDto: CreateAgentDto) {
    try {
      const createdAgent = await this.prisma.agent.create({
        data: {
          name: createAgentDto.name,
          description: createAgentDto.description,
          defaultInstruction: createAgentDto.defaultInstruction,
        },
      });

      return {
        location: `/agents/${createdAgent.id}`,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation error',
          errors: error.issues,
        });
      }
    }
  }

  async findAll() {
    return await this.prisma.agent.findMany();
  }

  async findOne(id: string) {
    try {
      const agent = await this.prisma.agent.findUnique({
        where: {
          id,
        },
      });
      if (!agent) {
        throw new NotFoundException('Agent not found');
      }
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.agent.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Agent not found');
        }
      }
      throw new InternalServerErrorException();
    }
  }
}

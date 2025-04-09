import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password } = createUserDto;

      const saltRounds = 10;
      const hashedPassword = await hash(password, saltRounds);

      const createdUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return {
        location: `/users/${createdUser.id}`,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException({
            message: 'Email already exists',
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany({
        omit: {
          password: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
        omit: {
          password: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'User not found',
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'User not found',
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: (error as Error).message,
      });
    }
  }
}

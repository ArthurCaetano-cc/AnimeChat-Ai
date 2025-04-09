import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDTO } from './dto/create-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async singIn(signInDTO: SignInDTO) {
    const { email, password } = signInDTO;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Compare password with hashed password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return await this.jwtService.signAsync(payload);
  }
}

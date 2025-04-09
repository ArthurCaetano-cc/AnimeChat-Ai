import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/create-auth.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOkResponse({
    description: 'Login successful',
    schema: {
      example: {
        message: 'Login successful',
        token: 'your-jwt-token',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid password',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async create(
    @Body() signInDTO: SignInDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.singIn(signInDTO);
    response.json({
      message: 'Login successful',
      token,
    });
  }
}

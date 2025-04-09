import { createZodDto } from 'nestjs-zod';
import { createUserSchema } from './schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends createZodDto(createUserSchema) {
  @ApiProperty({
    description: "User's name",
    example: 'arthur',
    minLength: 1,
    maxLength: 50,
  })
  readonly name: string;

  @ApiProperty({
    description: "User's email",
    example: 'arthur@email.com',
  })
  readonly email: string;

  @ApiProperty({
    description: "User's password",
    example: 'password123',
    minLength: 8,
    maxLength: 255,
  })
  readonly password: string;
}

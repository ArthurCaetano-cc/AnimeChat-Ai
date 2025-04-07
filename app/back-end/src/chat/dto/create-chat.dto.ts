import { createZodDto } from 'nestjs-zod';
import { createChatSchema } from './schemas';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto extends createZodDto(createChatSchema) {
  @ApiProperty({
    description: "Agent's id",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  readonly agentId: string;

  @ApiProperty({
    description: "User's id",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  readonly userId: string;
}

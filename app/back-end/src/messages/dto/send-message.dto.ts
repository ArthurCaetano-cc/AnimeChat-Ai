import { createZodDto } from 'nestjs-zod';
import { sendMessageSchema } from './schema';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto extends createZodDto(sendMessageSchema) {
  @ApiProperty({
    description: 'The ID of the chat to send the message to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  readonly chatId: string;

  @ApiProperty({
    description: 'The ID of the user sending the message',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  readonly userId?: string;

  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, how can I help you?',
  })
  readonly content: string;

  @ApiProperty({
    description: 'The role of who is sending the message',
    example: 'USER',
    enum: ['USER', 'AGENT'],
  })
  readonly role: 'USER' | 'AGENT';
}

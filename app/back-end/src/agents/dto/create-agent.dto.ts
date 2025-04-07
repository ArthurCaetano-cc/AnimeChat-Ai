import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { createAgentSchema } from './schema';

export class CreateAgentDto extends createZodDto(createAgentSchema) {
  @ApiProperty({
    description: "Agent's name",
    example: 'goku',
    minLength: 1,
    maxLength: 50,
  })
  readonly name: string;

  @ApiProperty({
    description: "Agent's description",
    example: 'greatest anime character',
    maxLength: 200,
  })
  readonly description: string;

  @ApiProperty({
    description: "Agent's default instruction",
    example: 'You are now acting like goku, the gratest character in anime',
    maxLength: 255,
  })
  readonly defaultInstruction: string;
}

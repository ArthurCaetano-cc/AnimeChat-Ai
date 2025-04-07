import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';

@ApiTags('chats')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOkResponse({
    description: 'The chat has been successfully created.',
    schema: {
      example: { location: '/chat/ab11a8f1-290f-4f49-94f9-443f5b32f587' },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Chats successfully retrieved.' })
  @ApiNotFoundResponse({ description: 'user not found' })
  findAllOfAUser(@Body() userId: string) {
    return this.chatService.findAllOfAUser(userId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Chat successfully retrieved.' })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(id);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Chat successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  remove(@Param('id') id: string) {
    return this.chatService.remove(id);
  }
}

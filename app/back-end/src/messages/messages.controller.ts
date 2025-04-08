import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOkResponse({
    description: 'Message created successfully',
    schema: {
      example: {
        location: '/messages/1',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  create(@Body() createMessageDto: SendMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get(':chatId')
  @ApiOkResponse({ description: 'Messages retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findAllOfAChat(@Param() chatId: string) {
    return this.messagesService.findAllOfAChat(chatId);
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':chatId')
  @ApiOkResponse({ description: 'Messages retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findAllOfAChat(@Param('chatId') chatId: string) {
    return this.messagesService.findAllOfAChat(chatId);
  }
}

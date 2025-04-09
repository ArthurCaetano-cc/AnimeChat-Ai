import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOkResponse({
    description: 'The agent has been successfully created.',
    schema: {
      example: {
        location: '/agents/ab11a8f1-290f-4f49-94f9-443f5b32f587',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentsService.create(createAgentDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Agents successfully retrieved.',
  })
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Agent successfully retrieved.',
  })
  @ApiNotFoundResponse({ description: 'Agent not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Agent successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Agent not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }
}

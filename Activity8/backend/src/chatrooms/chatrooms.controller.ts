import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ChatroomsService } from './chatrooms.service'
import { CreateChatroomDto, ChatroomResponseDto } from '../dtos/chatroom.dto'
import { MessagesService } from '../messages/messages.service'
import { CreateMessageDto, MessageResponseDto } from '../dtos/message.dto'

@ApiTags('chatrooms')
@Controller('chatrooms')
export class ChatroomsController {
  constructor(
    private readonly chatroomsService: ChatroomsService,
    private readonly messagesService: MessagesService,
  ) {}

  @ApiOperation({ summary: 'Create a new chatroom' })
  @ApiResponse({ status: 201, description: 'Chatroom created', type: ChatroomResponseDto })
  @Post()
  create(@Body() dto: CreateChatroomDto) {
    return this.chatroomsService.create(dto)
  }

  @ApiOperation({ summary: 'Get all chatrooms' })
  @ApiResponse({ status: 200, description: 'List of chatrooms', type: [ChatroomResponseDto] })
  @Get()
  findAll() {
    return this.chatroomsService.findAll()
  }

  @ApiOperation({ summary: 'Get chatroom by ID with messages' })
  @ApiResponse({ status: 200, description: 'Chatroom with messages', type: ChatroomResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const chatroom = await this.chatroomsService.findOne(Number(id))
    const messages = await this.messagesService.findByChatroom(Number(id))
    return { ...chatroom, messages }
  }

  @ApiOperation({ summary: 'Add message to chatroom' })
  @ApiResponse({ status: 201, description: 'Message created', type: MessageResponseDto })
  @Post(':id/messages')
  addMessage(@Param('id') id: string, @Body() dto: CreateMessageDto) {
    return this.messagesService.create(Number(id), dto)
  }

  @ApiOperation({ summary: 'Update chatroom' })
  @ApiResponse({ status: 200, description: 'Chatroom updated', type: ChatroomResponseDto })
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateChatroomDto) {
    return this.chatroomsService.update(Number(id), dto)
  }

  @ApiOperation({ summary: 'Delete chatroom' })
  @ApiResponse({ status: 200, description: 'Chatroom deleted' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatroomsService.remove(Number(id))
  }
}

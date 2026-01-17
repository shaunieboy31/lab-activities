import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatroomsController } from './chatrooms.controller'
import { ChatroomsService } from './chatrooms.service'
import { Chatroom } from './chatroom.entity'
import { MessagesModule } from '../messages/messages.module'

@Module({
  imports: [TypeOrmModule.forFeature([Chatroom]), MessagesModule],
  controllers: [ChatroomsController],
  providers: [ChatroomsService],
  exports: [ChatroomsService],
})
export class ChatroomsModule {}

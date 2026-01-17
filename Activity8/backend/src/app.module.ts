import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatroomsModule } from './chatrooms/chatrooms.module'
import { MessagesModule } from './messages/messages.module'
import { Chatroom } from './chatrooms/chatroom.entity'
import { Message } from './messages/message.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Chatroom, Message],
      synchronize: true,
    }),
    ChatroomsModule,
    MessagesModule,
  ],
})
export class AppModule {}

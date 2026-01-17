import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Chatroom } from '../chatrooms/chatroom.entity'

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  content: string

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @ManyToOne(() => Chatroom, (chatroom) => chatroom.messages, { onDelete: 'CASCADE' })
  chatroom: Chatroom

  @Column()
  chatroomId: number
}

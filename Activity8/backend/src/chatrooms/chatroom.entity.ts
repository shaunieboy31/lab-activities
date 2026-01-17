import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Message } from '../messages/message.entity'

@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  description?: string

  @Column({ type: 'integer', default: 0 })
  memberCount: number

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @OneToMany(() => Message, (message) => message.chatroom, { cascade: true })
  messages: Message[]
}

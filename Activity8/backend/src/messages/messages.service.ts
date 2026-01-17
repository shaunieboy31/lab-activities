import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message } from './message.entity'
import { CreateMessageDto } from '../dtos/message.dto'

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(chatroomId: number, dto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create({
      ...dto,
      chatroomId,
    })
    return this.messageRepository.save(message)
  }

  async findByChatroom(chatroomId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { chatroomId },
      order: { createdAt: 'ASC' },
    })
  }

  async remove(id: number): Promise<void> {
    await this.messageRepository.delete(id)
  }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Chatroom } from './chatroom.entity'
import { CreateChatroomDto } from '../dtos/chatroom.dto'

@Injectable()
export class ChatroomsService {
  constructor(
    @InjectRepository(Chatroom)
    private chatroomRepository: Repository<Chatroom>,
  ) {}

  async create(dto: CreateChatroomDto): Promise<Chatroom> {
    const chatroom = this.chatroomRepository.create(dto)
    return this.chatroomRepository.save(chatroom)
  }

  async findAll(): Promise<Chatroom[]> {
    return this.chatroomRepository.find({ relations: ['messages'] })
  }

  async findOne(id: number): Promise<Chatroom> {
    return this.chatroomRepository.findOne({
      where: { id },
      relations: ['messages'],
    })
  }

  async update(id: number, dto: Partial<CreateChatroomDto>): Promise<Chatroom> {
    await this.chatroomRepository.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    await this.chatroomRepository.delete(id)
  }

  async incrementMembers(id: number): Promise<void> {
    const chatroom = await this.findOne(id)
    chatroom.memberCount += 1
    await this.chatroomRepository.save(chatroom)
  }

  async decrementMembers(id: number): Promise<void> {
    const chatroom = await this.findOne(id)
    if (chatroom.memberCount > 0) {
      chatroom.memberCount -= 1
      await this.chatroomRepository.save(chatroom)
    }
  }
}

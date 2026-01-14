import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(data: Partial<User>) {
    const u = this.repo.create(data)
    return this.repo.save(u)
  }

  findAll() {
    return this.repo.find()
  }
}

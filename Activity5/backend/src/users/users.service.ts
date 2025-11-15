import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(user: Partial<User>) {
    const e = this.repo.create(user as any);
    return this.repo.save(e);
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async findByUsernameOrEmail(identifier: string) {
    return this.repo.findOne({ where: [{ username: identifier }, { email: identifier }] });
  }

  async findAll() {
    return this.repo.find();
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }
}
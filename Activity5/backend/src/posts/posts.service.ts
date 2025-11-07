import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../auth/user.entity';
import { Comment } from '../comments/comment.entity';


@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  findAll(page = 1, limit = 5) {
    return this.postsRepo.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.postsRepo.findOne({ where: { id }, relations: ['comments'] });
  }

  async create(title: string, content: string, userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    const newPost = this.postsRepo.create({ title, content, user });    
    return this.postsRepo.save(newPost);
  }

  async update(id: number, data: any) {
    await this.postsRepo.update(id, data);
    return this.postsRepo.findOneBy({ id });
  }

  remove(id: number) {
    return this.postsRepo.delete(id);
  }
}

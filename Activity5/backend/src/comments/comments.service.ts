import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(postId: number, userId: number, content: string) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const comment = this.commentRepo.create({ content, post, user });
    return this.commentRepo.save(comment);
  }

  async findAllByPost(postId: number) {
    return this.commentRepo.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
  }
}

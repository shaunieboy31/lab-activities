import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Post) private postsRepo: Repository<Post>,
  ) {}

  async create(postId: number, user: User, content: string) {
    const post = await this.postsRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.commentRepo.create({ content, post, user } as any);
    await this.commentRepo.save(comment);
    return comment;
  }

  async findAllByPost(postId: number) {
    return this.commentRepo.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
  }
}

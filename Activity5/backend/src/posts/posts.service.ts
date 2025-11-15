import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { Comment } from '../comments/comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async findAll() {
    return this.postsRepository.find({ relations: ['user', 'comments', 'comments.user'] });
  }

  async create(data: any, userId: number) {
    try {
      const post = this.postsRepository.create({ ...data, user: { id: userId } });
      const saved = await this.postsRepository.save(post);
      return this.postsRepository.findOne({ where: { id: saved.id }, relations: ['user', 'comments', 'comments.user'] });
    } catch (err) {
      console.error('PostsService.create error', err);
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async addComment(postId: number, userId: number, content: string) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    // create via repository using the DB column name 'text'
    const comment = this.commentsRepository.create({
      text: content,            // <-- use 'text' (DB column) not 'content'
      post: { id: postId },
      user: { id: userId },
    });

    const saved = await this.commentsRepository.save(comment);
    return this.commentsRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }

  async update(postId: number, userId: number, data: any) {
    const post = await this.postsRepository.findOne({ where: { id: postId }, relations: ['user', 'comments'] });
    if (!post) throw new NotFoundException('Post not found');
    if (post.user?.id !== userId) throw new ForbiddenException('Not owner');

    post.title = data.title ?? post.title;
    post.content = data.content ?? post.content;
    post.image = data.image ?? post.image;

    const saved = await this.postsRepository.save(post);
    return this.postsRepository.findOne({ where: { id: saved.id }, relations: ['user', 'comments', 'comments.user'] });
  }

  async remove(postId: number, userId: number) {
    const post = await this.postsRepository.findOne({ where: { id: postId }, relations: ['user'] });
    if (!post) throw new NotFoundException('Post not found');
    if (post.user?.id !== userId) throw new ForbiddenException('Not owner');

    await this.postsRepository.remove(post);
    return { success: true };
  }
}
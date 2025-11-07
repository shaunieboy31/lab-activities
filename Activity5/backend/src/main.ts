import { Controller, Get, Post as PostReq, Param, Body } from '@nestjs/common';
import { CommentsService } from './comments/comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':postId')
  getByPost(@Param('postId') postId: number) {
    return this.commentsService.findAllByPost(postId);
  }

  @PostReq()
  create(@Body() body) {
    return this.commentsService.create(body.postId, body.userId, body.text);
  }
}
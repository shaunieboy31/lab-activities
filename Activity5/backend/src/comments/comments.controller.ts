import { Controller, Get, Post as PostReq, Body, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':postId')
  getComments(@Param('postId') postId: number) {
    return this.commentsService.findAllByPost(postId);
  }

  @PostReq()
  create(@Body() body: { postId: number; userId: number; text: string }) {
    return this.commentsService.create(body.postId, body.userId, body.text);
  }
}

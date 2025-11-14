import { Controller, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DevAuthGuard } from '../common/dev-auth.guard';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @UseGuards(DevAuthGuard)
  async create(@Param('postId') postId: string, @Body() body: CreateCommentDto, @Req() req: any) {
    const user = req.user;
    return this.commentsService.create(Number(postId), user, body.content);
  }
}

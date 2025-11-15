import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.postsService.create(body, req.user?.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  addComment(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.postsService.addComment(+id, req.user.id, body.content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.postsService.update(+id, req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.postsService.remove(+id, req.user?.id);
  }
}
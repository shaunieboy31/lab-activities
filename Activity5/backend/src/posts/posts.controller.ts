import { Controller, Get, Post as PostReq, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.postsService.findAll(page, limit);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @PostReq()
  create(@Body() body: { title: string; content: string; userId: number }) {
    return this.postsService.create(body.title, body.content, body.userId);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.postsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postsService.remove(id);
  }
}

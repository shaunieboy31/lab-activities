import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'List of all posts' })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.postsService.create(body, req.user?.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add comment to post' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  addComment(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.postsService.addComment(+id, req.user.id, body.content);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.postsService.update(+id, req.user.id, body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.postsService.remove(+id, req.user?.id);
  }
}
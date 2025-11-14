import { Controller, Get, Post as PostReq, Param, Body } from '@nestjs/common';
import { CommentsService } from './comments/comments.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ensure API routes are prefixed with /api
  app.setGlobalPrefix('api');

  // enable CORS so browser requests from frontend succeed
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
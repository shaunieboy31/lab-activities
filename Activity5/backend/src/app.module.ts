import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { User } from './auth/user.entity';
import { Post } from './posts/post.entity';
import { Comment } from './comments/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', 
      database: 'db.sqlite', 
      entities: [User, Post, Comment],
      synchronize: true, 
    }),
    AuthModule,
    PostsModule,
    CommentsModule,
  ],
})
export class AppModule {}

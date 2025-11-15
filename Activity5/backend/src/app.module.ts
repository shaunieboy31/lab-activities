import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    // ensure TypeORM loads all entity files (including comments)
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // includes User, Post, Comment
      synchronize: true,
      logging: false,
      keepConnectionAlive: true,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    // import CommentsModule here if you create one
  ],
})
export class AppModule {}
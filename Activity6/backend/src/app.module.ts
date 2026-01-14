import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Movie } from './entities/movie.entity';
import { Review } from './entities/review.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Movie, Review, User],
      synchronize: true,
    }),
    MoviesModule,
    ReviewsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

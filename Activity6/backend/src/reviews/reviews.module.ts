import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { Movie } from '../entities/movie.entity';
import { User } from '../users/user.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Movie, User])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

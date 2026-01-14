import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../entities/movie.entity';
import { Review } from '../entities/review.entity';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Review])],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}

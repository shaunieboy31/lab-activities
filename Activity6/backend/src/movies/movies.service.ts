import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { Review } from '../entities/review.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepo: Repository<Movie>,
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
  ) {}

  create(data: Partial<Movie>) {
    const m = this.movieRepo.create(data);
    return this.movieRepo.save(m);
  }

  findAll() {
    return this.movieRepo.find({ relations: ['reviews', 'reviews.user'] });
  }

  findOne(id: number) {
    return this.movieRepo.findOne({ where: { id }, relations: ['reviews', 'reviews.user'] });
  }

  async update(id: number, data: Partial<Movie>) {
    await this.movieRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.movieRepo.delete(id);
  }

  async recomputeAverage(movieId: number) {
    const reviews = await this.reviewRepo.find({ where: { movie: { id: movieId } } });
    if (!reviews || reviews.length === 0) {
      await this.movieRepo.update(movieId, { averageRating: 0 });
      return 0;
    }
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const avg = parseFloat((sum / reviews.length).toFixed(2));
    await this.movieRepo.update(movieId, { averageRating: avg });
    return avg;
  }
}

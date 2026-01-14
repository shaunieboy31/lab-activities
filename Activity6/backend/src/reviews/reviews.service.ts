import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Movie } from '../entities/movie.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(Movie)
    private movieRepo: Repository<Movie>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(movieId: number, data: Partial<Review>, userId: number) {
    const movie = await this.movieRepo.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException('Movie not found');
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const review = this.reviewRepo.create({ ...data, movie, user } as any);
    const savedRaw = await this.reviewRepo.save(review);
    const saved = Array.isArray(savedRaw) ? savedRaw[0] : savedRaw;
    await this.recomputeAverage(movieId);
    return this.reviewRepo.findOne({ where: { id: (saved as any).id }, relations: ['user'] });
  }

  findByMovie(movieId: number) {
    return this.reviewRepo.find({ where: { movie: { id: movieId } }, relations: ['user'] });
  }

  async update(id: number, data: Partial<Review>, user?: any) {
    const r = await this.reviewRepo.findOne({ where: { id }, relations: ['movie', 'user'] });
    if (!r) throw new NotFoundException('Review not found');
    // allow only author or admin to update
    if (user && user.role !== 'admin' && r.user?.id !== user.id) {
      throw new ForbiddenException('Not allowed to update this review');
    }
    Object.assign(r, data);
    const saved = await this.reviewRepo.save(r);
    await this.recomputeAverage(saved.movie.id);
    return this.reviewRepo.findOne({ where: { id: saved.id }, relations: ['user'] });
  }

  async remove(id: number) {
    const r = await this.reviewRepo.findOne({ where: { id }, relations: ['movie'] });
    if (!r) throw new NotFoundException('Review not found');
    const movieId = r.movie?.id;
    await this.reviewRepo.delete(id);
    if (movieId) await this.recomputeAverage(movieId);
    return { deleted: true };
  }

  private async recomputeAverage(movieId: number) {
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

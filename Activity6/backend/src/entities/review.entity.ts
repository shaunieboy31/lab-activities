import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from '../users/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, (movie) => movie.reviews, { onDelete: 'CASCADE' })
  movie: Movie;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  user: User | null;

  @Column('int')
  rating: number;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}

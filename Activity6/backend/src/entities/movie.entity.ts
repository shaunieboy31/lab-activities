import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  releaseDate: string;

  @Column('float', { default: 0 })
  averageRating: number;

  @OneToMany(() => Review, (review) => review.movie, { cascade: true })
  reviews: Review[];
}

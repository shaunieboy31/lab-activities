import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Author, (author) => author.books)
  author: Author;

  @ManyToOne(() => Category, (category) => category.books)
  category: Category;
}

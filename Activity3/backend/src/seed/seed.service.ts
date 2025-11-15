import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../authors/author.entity';
import { Book } from '../books/book.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async seed() {
    const author = this.authorRepository.create({
      name: 'Jane Doe',
      bio: 'Writes about the wonders of coding.',
    });
    await this.authorRepository.save(author);

    const category = this.categoryRepository.create({ name: 'Technology' });
    await this.categoryRepository.save(category);

    const book = this.bookRepository.create({
      title: 'NestJS for Beginners',
      description: 'A guide to NestJS fundamentals.',
      author,
      category,
    });
    await this.bookRepository.save(book);

    console.log('✅ Seeding complete!');
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Author } from '../authors/author.entity';
import { Book } from '../books/book.entity';
import { Category } from '../categories/category.entity';
import { AuthorsModule } from '../authors/authors.module';
import { CategoriesModule } from '../categories/categories.module';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Author, Book, Category]),
    AuthorsModule,
    CategoriesModule,
    BooksModule,
  ],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}

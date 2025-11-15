import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'bookshelf.db',
      synchronize: true,
      autoLoadEntities: true,
    }),
    BooksModule,
    AuthorsModule,
    CategoriesModule,
    SeedModule, 
  ],
})
export class AppModule {}

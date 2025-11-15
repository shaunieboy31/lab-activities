import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  create(data: Partial<Author>) {
    const author = this.authorRepository.create(data);
    return this.authorRepository.save(author);
  }

  findAll() {
    return this.authorRepository.find({ relations: ['books'] });
  }
}

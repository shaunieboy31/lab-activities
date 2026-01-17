import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto, BookResponseDto } from './create-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private service: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'List of books', type: [BookResponseDto] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiResponse({ status: 200, description: 'Book details', type: BookResponseDto })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully', type: BookResponseDto })
  create(@Body() dto: CreateBookDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiResponse({ status: 200, description: 'Book updated successfully', type: BookResponseDto })
  update(@Param('id') id: number, @Body() dto: UpdateBookDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}

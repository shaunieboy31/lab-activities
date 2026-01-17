import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { AuthorDto, CreateAuthorDto } from './author.dto';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private service: AuthorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiResponse({ status: 200, description: 'List of authors', type: [AuthorDto] })
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new author' })
  @ApiResponse({ status: 201, description: 'Author created successfully', type: AuthorDto })
  create(@Body() body: CreateAuthorDto) {
    return this.service.create(body);
  }
}

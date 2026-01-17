import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryDto, CreateCategoryDto } from './category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of categories', type: [CategoryDto] })
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: CategoryDto })
  create(@Body() body: CreateCategoryDto) {
    return this.service.create(body);
  }
}

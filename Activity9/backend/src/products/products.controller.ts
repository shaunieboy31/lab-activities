import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ProductsService } from './products.service'
import { CreateProductDto, UpdateProductDto } from './product.dto'
import { Product } from './product.entity'

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all available products' })
  @ApiResponse({ status: 200, description: 'Returns all products' })
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Returns product details' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id)
  }
}

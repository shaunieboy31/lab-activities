import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './product.entity'
import { CreateProductDto, UpdateProductDto } from './product.dto'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto)
    return this.productRepository.save(product)
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ where: { isAvailable: true } })
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } })
    if (!product) throw new NotFoundException('Product not found')
    return product
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id)
  }

  async checkStock(productId: number, quantity: number): Promise<boolean> {
    const product = await this.findOne(productId)
    return product.stock >= quantity
  }

  async reduceStock(productId: number, quantity: number): Promise<void> {
    const product = await this.findOne(productId)
    if (product.stock < quantity) {
      throw new BadRequestException(`Insufficient stock for ${product.name}`)
    }
    product.stock -= quantity
    await this.productRepository.save(product)
  }
}

import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator'

export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Mouse' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'Ergonomic wireless mouse with USB receiver' })
  @IsString()
  description: string

  @ApiProperty({ example: 599.99 })
  @IsNumber()
  @Min(0)
  price: number

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock: number

  @ApiProperty({ example: 'https://example.com/mouse.jpg', required: false })
  imageUrl?: string
}

export class UpdateProductDto {
  @ApiProperty({ example: 'Wireless Mouse', required: false })
  name?: string

  @ApiProperty({ example: 'Updated description', required: false })
  description?: string

  @ApiProperty({ example: 549.99, required: false })
  price?: number

  @ApiProperty({ example: 45, required: false })
  stock?: number

  @ApiProperty({ example: 'https://example.com/mouse-new.jpg', required: false })
  imageUrl?: string
}

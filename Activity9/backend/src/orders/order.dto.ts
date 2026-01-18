import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'

export class OrderItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  productId: number

  @ApiProperty({ example: 'Wireless Mouse' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 599.99 })
  @IsNumber()
  @IsPositive()
  price: number

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  quantity: number
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Juan Dela Cruz' })
  @IsString()
  @IsNotEmpty()
  customerName: string

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string

  @ApiProperty({ example: '09123456789' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]
}

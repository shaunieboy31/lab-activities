import { Controller, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './order.dto'
import { Order } from './order.entity'

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new order with GCash QR code' })
  @ApiResponse({ status: 201, description: 'Order created with QR code' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    try {
      return await this.ordersService.create(dto)
    } catch (error) {
      throw error
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Returns all orders' })
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Returns order details with QR code' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.findOne(id)
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: Order['status'],
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, status)
  }
}

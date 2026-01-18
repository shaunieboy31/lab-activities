import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from './order.entity'
import { CreateOrderDto } from './order.dto'
import { ProductsService } from '../products/products.service'
import * as QRCode from 'qrcode'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private productsService: ProductsService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    console.log('Received order DTO:', JSON.stringify(dto, null, 2))
    
    // Validate items array
    if (!dto.items || dto.items.length === 0) {
      throw new Error('Order must contain at least one item')
    }

    // Validate stock for all items
    for (const item of dto.items) {
      console.log('Checking item:', item)
      if (!item.productId) {
        throw new Error(`Product ID is required for all items. Received: ${JSON.stringify(item)}`)
      }
      const hasStock = await this.productsService.checkStock(item.productId, item.quantity)
      if (!hasStock) {
        throw new Error(`Insufficient stock for ${item.name} (Product ID: ${item.productId})`)
      }
    }

    // Calculate total
    const totalAmount = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Generate GCash QR code data
    const qrData = await this.generateGCashQR(totalAmount, dto.customerName)

    const order = this.orderRepository.create({
      ...dto,
      totalAmount,
      qrCodeData: qrData,
    })

    const savedOrder = await this.orderRepository.save(order)

    // Reduce stock for all items
    for (const item of dto.items) {
      await this.productsService.reduceStock(item.productId, item.quantity)
    }

    return savedOrder
  }

  async findAll(): Promise<Order[]> {
    try {
      return await this.orderRepository.find({ order: { createdAt: 'DESC' } })
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  }

  async findOne(id: number): Promise<Order> {
    return this.orderRepository.findOne({ where: { id } })
  }

  async updateStatus(id: number, status: Order['status']): Promise<Order> {
    await this.orderRepository.update(id, { status })
    return this.findOne(id)
  }

  private async generateGCashQR(amount: number, customerName: string): Promise<string> {
    // GCash QR format: account number, amount, and reference
    const gcashNumber = '09171234567' // Replace with actual GCash merchant number
    const reference = `ORDER-${Date.now()}`
    const qrText = `GCASH:${gcashNumber}:${amount.toFixed(2)}:${customerName}:${reference}`
    
    try {
      return await QRCode.toDataURL(qrText)
    } catch (err) {
      throw new Error('Failed to generate QR code')
    }
  }
}

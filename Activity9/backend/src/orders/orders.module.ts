import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { Order } from './order.entity'
import { ProductsModule } from '../products/products.module'

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

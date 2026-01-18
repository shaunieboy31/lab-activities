import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsModule } from './products/products.module'
import { OrdersModule } from './orders/orders.module'
import { Product } from './products/product.entity'
import { Order } from './orders/order.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Product, Order],
      synchronize: true,
    }),
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}

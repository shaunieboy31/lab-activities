import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DataSource } from 'typeorm'
import { Product } from './products/product.entity'

async function seed() {
  const app = await NestFactory.create(AppModule)
  const dataSource = app.get(DataSource)
  const productRepo = dataSource.getRepository(Product)

  const sampleProducts = [
    {
      name: 'Wireless Headphones',
      description: 'Premium noise-canceling wireless headphones',
      price: 2499.00,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      isAvailable: true,
    },
    {
      name: 'Smart Watch',
      description: 'Fitness tracker with heart rate monitor',
      price: 3999.00,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      isAvailable: true,
    },
    {
      name: 'Laptop Stand',
      description: 'Aluminum adjustable laptop stand',
      price: 899.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      isAvailable: true,
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB backlit gaming keyboard',
      price: 1599.00,
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
      isAvailable: true,
    },
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with precision tracking',
      price: 799.00,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
      isAvailable: true,
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI and card reader',
      price: 1299.00,
      stock: 18,
      imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
      isAvailable: true,
    },
  ]

  for (const productData of sampleProducts) {
    const exists = await productRepo.findOne({ where: { name: productData.name } })
    if (!exists) {
      const product = productRepo.create(productData)
      await productRepo.save(product)
      console.log(`✓ Created: ${productData.name}`)
    } else {
      console.log(`⊘ Skipped: ${productData.name} (already exists)`)
    }
  }

  console.log('\\n✅ Seeding complete!')
  await app.close()
}

seed().catch(console.error)

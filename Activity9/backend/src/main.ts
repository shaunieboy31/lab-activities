import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as express from 'express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // Serve Swagger UI static assets
  app.use('/api', express.static(join(__dirname, '..', '..', 'node_modules', 'swagger-ui-dist')))

  const config = new DocumentBuilder()
    .setTitle('Mini E-Commerce API')
    .setDescription('E-Commerce with GCash QR Code Payment')
    .setVersion('1.0')
    .addTag('products')
    .addTag('orders')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const port = 3003
  await app.listen(port)
  console.log(`🚀 E-Commerce API running on http://localhost:${port}`)
  console.log(`📖 Swagger docs available at http://localhost:${port}/api`)
}
bootstrap()

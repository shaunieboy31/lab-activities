import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import * as express from 'express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidUnknownValues: false }))

  // Serve Swagger UI assets
  app.use('/api', express.static(join(__dirname, '..', '..', 'node_modules', 'swagger-ui-dist')))

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API for managing projects and tasks')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`\n✅ Server running at http://localhost:${port}`)
  console.log(`📚 Swagger docs at http://localhost:${port}/api\n`)
}

bootstrap()

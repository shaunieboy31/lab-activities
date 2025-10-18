import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000', 
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());


  const config = new DocumentBuilder()
    .setTitle('To-Do List API')
    .setDescription('API documentation for the To-Do List app built with NestJS, SQLite, and React.')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
  console.log('🚀 Server running on http://localhost:3001');
  console.log('📘 Swagger docs available at http://localhost:3001/api');
}
bootstrap();

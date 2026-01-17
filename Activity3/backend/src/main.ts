import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = 3001;
  await app.listen(port);
  console.log(`\n✅ Server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api\n`);
}
bootstrap();

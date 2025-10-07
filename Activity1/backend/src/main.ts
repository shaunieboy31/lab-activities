import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api'); // ✅ so frontend uses /api/tasks
  await app.listen(3001);
  console.log('Backend running on http://localhost:3001/api/tasks 💖');
}
bootstrap();
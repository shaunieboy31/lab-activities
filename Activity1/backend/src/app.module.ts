import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // or 'sqlite'
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'todo_db',
      entities: [Task],
      synchronize: true,
      // For SQLite, use:
      // type: 'sqlite',
      // database: 'todo_db.sqlite',
    }),
    TasksModule,
  ],
})
export class AppModule {}
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from './projects/project.entity'
import { Task } from './tasks/task.entity'
import { User } from './users/user.entity'
import { ProjectsModule } from './projects/projects.module'
import { TasksModule } from './tasks/tasks.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Project, Task, User],
      synchronize: true,
    }),
    ProjectsModule,
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}

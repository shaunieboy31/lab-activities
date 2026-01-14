import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from './project.entity'
import { ProjectsService } from './projects.service'
import { ProjectsController } from './projects.controller'
import { Task } from '../tasks/task.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}

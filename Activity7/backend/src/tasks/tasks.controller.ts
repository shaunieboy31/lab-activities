import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':projectId')
  create(@Param('projectId') projectId: string, @Body() body: any) {
    return this.tasksService.create(Number(projectId), body)
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.tasksService.findByProject(Number(projectId))
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.update(Number(id), body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(Number(id))
  }
}

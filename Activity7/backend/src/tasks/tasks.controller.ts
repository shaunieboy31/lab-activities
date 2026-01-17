import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { TasksService } from './tasks.service'
import { CreateTaskDto, TaskResponseDto } from './task.dto'

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create task in project' })
  @ApiResponse({ status: 201, description: 'Task created', type: TaskResponseDto })
  @Post(':projectId')
  create(@Param('projectId') projectId: string, @Body() body: CreateTaskDto) {
    return this.tasksService.create(Number(projectId), body)
  }

  @ApiOperation({ summary: 'Get tasks by project' })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [TaskResponseDto] })
  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.tasksService.findByProject(Number(projectId))
  }

  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated', type: TaskResponseDto })
  @Put(':id')
  update(@Param('id') id: string, @Body() body: CreateTaskDto) {
    return this.tasksService.update(Number(id), body)
  }

  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(Number(id))
  }
}

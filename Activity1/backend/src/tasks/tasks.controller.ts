import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  update(@Param('id') id: string, @Body() updateTaskDto: Partial<Task>) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}

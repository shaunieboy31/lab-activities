import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiTags, ApiBody, ApiParam, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // 📘 CREATE TASK
  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({
    description: 'Example task creation request',
    required: true,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Activity 1' },
        description: { type: 'string', example: 'Finish the report' },
        completed: { type: 'boolean', example: false },
        deadline: { type: 'string', format: 'date-time', example: '2025-10-25T23:59:59Z' },
      },
    },
    examples: {
      Example1: {
        summary: 'Basic task example',
        value: {
          title: 'Activity 1',
          description: 'Finish the report',
          completed: false,
          deadline: '2025-10-25T23:59:59Z',
        },
      },
      Example2: {
        summary: 'Team meeting preparation task',
        value: {
          title: 'Prepare slides',
          description: 'Create presentation for the Monday meeting',
          completed: false,
          deadline: '2025-10-20T09:00:00Z',
        },
      },
      Example3: {
        summary: 'Completed task sample',
        value: {
          title: 'Submit project',
          description: 'Upload project files to GitHub',
          completed: true,
          deadline: '2025-10-15T17:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  // 📘 GET ALL TASKS
  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Returns all tasks.' })
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  // 📘 GET TASK BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Returns the task with the specified ID.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  // 📘 UPDATE TASK
  @Patch(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', example: 1 })
  @ApiBody({
    description: 'Example task update request',
    required: true,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Updated task title' },
        description: { type: 'string', example: 'Updated task description' },
        completed: { type: 'boolean', example: true },
        deadline: { type: 'string', format: 'date-time', example: '2025-10-30T23:59:59Z' },
      },
    },
    examples: {
      Example1: {
        summary: 'Mark as complete',
        value: { completed: true },
      },
      Example2: {
        summary: 'Update title and deadline',
        value: {
          title: 'Revised report',
          deadline: '2025-11-01T12:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  update(@Param('id') id: string, @Body() updateTaskDto: Partial<Task>) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  // 📘 DELETE TASK
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}

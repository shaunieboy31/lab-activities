import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Activity 1', description: 'Title of the task' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Finish the report', description: 'Task description' })
  @IsString()
  description: string;

  @ApiProperty({ example: false, description: 'Whether the task is completed', required: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({ example: '2025-10-25T23:59:59Z', description: 'Deadline of the task', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}

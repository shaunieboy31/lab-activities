import { ApiProperty } from '@nestjs/swagger'

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement login page' })
  title: string

  @ApiProperty({ example: 'Create authentication form', required: false })
  description?: string

  @ApiProperty({ example: '2026-02-01', required: false })
  dueDate?: string

  @ApiProperty({ example: 'todo', enum: ['todo', 'doing', 'done'] })
  status?: 'todo' | 'doing' | 'done'

  @ApiProperty({ example: 'John Doe', required: false })
  assigneeName?: string
}

export class TaskResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'Implement login page' })
  title: string

  @ApiProperty({ example: 'Create authentication form' })
  description?: string

  @ApiProperty({ example: '2026-02-01' })
  dueDate?: string

  @ApiProperty({ example: 'todo' })
  status: 'todo' | 'doing' | 'done'

  @ApiProperty({ example: 'John Doe' })
  assigneeName?: string
}

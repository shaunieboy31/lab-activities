import { ApiProperty } from '@nestjs/swagger'

export class CreateProjectDto {
  @ApiProperty({ example: 'Website Redesign' })
  name: string

  @ApiProperty({ example: 'Redesign company website', required: false })
  description?: string

  @ApiProperty({ example: 'open', enum: ['open', 'in-progress', 'done'] })
  status?: 'open' | 'in-progress' | 'done'
}

export class ProjectResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'Website Redesign' })
  name: string

  @ApiProperty({ example: 'Redesign company website' })
  description?: string

  @ApiProperty({ example: 'open' })
  status: 'open' | 'in-progress' | 'done'

  @ApiProperty({ example: [] })
  tasks?: any[]
}

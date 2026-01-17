import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ProjectsService } from './projects.service'
import { CreateProjectDto, ProjectResponseDto } from './project.dto'

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created', type: ProjectResponseDto })
  @Post()
  create(@Body() body: CreateProjectDto) {
    return this.projectsService.create(body)
  }

  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'List of projects', type: [ProjectResponseDto] })
  @Get()
  findAll() {
    return this.projectsService.findAll()
  }

  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project found', type: ProjectResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(Number(id))
  }

  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated', type: ProjectResponseDto })
  @Put(':id')
  update(@Param('id') id: string, @Body() body: CreateProjectDto) {
    return this.projectsService.update(Number(id), body)
  }

  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 200, description: 'Project deleted' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(Number(id))
  }
}

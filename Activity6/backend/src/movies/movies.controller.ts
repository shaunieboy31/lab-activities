import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MoviesService } from './movies.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { CreateMovieDto, MovieResponseDto } from '../dtos/movie.dto'

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new movie (admin only)' })
  @ApiResponse({ status: 201, description: 'Movie created', type: MovieResponseDto })
  create(@Body() body: CreateMovieDto) {
    return this.moviesService.create(body)
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'List of movies', type: [MovieResponseDto] })
  findAll() {
    return this.moviesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID with reviews' })
  @ApiResponse({ status: 200, description: 'Movie with reviews', type: MovieResponseDto })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(Number(id))
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a movie (admin only)' })
  @ApiResponse({ status: 200, description: 'Movie updated', type: MovieResponseDto })
  update(@Param('id') id: string, @Body() body: CreateMovieDto) {
    return this.moviesService.update(Number(id), body)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a movie (admin only)' })
  @ApiResponse({ status: 200, description: 'Movie deleted' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(Number(id))
  }
}

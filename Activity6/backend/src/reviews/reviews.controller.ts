import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ReviewsService } from './reviews.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { CreateReviewDto, ReviewResponseDto } from '../dtos/review.dto'

@ApiTags('reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('movies/:id/reviews')
  @ApiOperation({ summary: 'Submit a review for a movie' })
  @ApiResponse({ status: 201, description: 'Review created', type: ReviewResponseDto })
  create(@Param('id') id: string, @Body() body: CreateReviewDto, @Request() req: any) {
    return this.reviewsService.create(Number(id), body, req.user.id)
  }

  @Get('movies/:id/reviews')
  @ApiOperation({ summary: 'Get all reviews for a movie' })
  @ApiResponse({ status: 200, description: 'List of reviews', type: [ReviewResponseDto] })
  findByMovie(@Param('id') id: string) {
    return this.reviewsService.findByMovie(Number(id))
  }

  @UseGuards(JwtAuthGuard)
  @Put('reviews/:id')
  @ApiOperation({ summary: 'Update your review' })
  @ApiResponse({ status: 200, description: 'Review updated', type: ReviewResponseDto })
  update(@Param('id') id: string, @Body() body: CreateReviewDto, @Request() req: any) {
    return this.reviewsService.update(Number(id), body, req.user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('reviews/:id')
  @ApiOperation({ summary: 'Delete a review (admin only)' })
  @ApiResponse({ status: 200, description: 'Review deleted' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(Number(id))
  }
}

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('movies/:id/reviews')
  create(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.reviewsService.create(Number(id), body, req.user.id);
  }

  @Get('movies/:id/reviews')
  findByMovie(@Param('id') id: string) {
    return this.reviewsService.findByMovie(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Put('reviews/:id')
  update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.reviewsService.update(Number(id), body, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('reviews/:id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(Number(id));
  }
}

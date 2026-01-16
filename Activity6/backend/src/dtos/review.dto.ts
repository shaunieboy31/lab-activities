import { ApiProperty } from '@nestjs/swagger'

export class CreateReviewDto {
  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  rating: number

  @ApiProperty({ example: 'Loved it!' })
  comment?: string
}

export class ReviewResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 5 })
  rating: number

  @ApiProperty({ example: 'Loved it!' })
  comment?: string

  @ApiProperty({ example: { id: 1, username: 'alice' } })
  user?: { id: number; username: string }
}

import { ApiProperty } from '@nestjs/swagger'

export class CreateMovieDto {
  @ApiProperty({ example: 'The First Adventure' })
  title: string

  @ApiProperty({ example: 'An exciting journey.' })
  description?: string

  @ApiProperty({ example: '2020-05-01' })
  releaseDate?: string
}

export class MovieResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'The First Adventure' })
  title: string

  @ApiProperty({ example: 'An exciting journey.' })
  description?: string

  @ApiProperty({ example: '2020-05-01' })
  releaseDate?: string

  @ApiProperty({ example: 4.5 })
  averageRating?: number
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Gatsby' })
  title!: string;

  @ApiProperty({ example: 1 })
  authorId!: number;

  @ApiProperty({ example: 2 })
  categoryId!: number;

  @ApiProperty({ example: 'A classic novel about wealth and love', required: false })
  description?: string;
}

export class UpdateBookDto {
  @ApiProperty({ example: 'The Great Gatsby', required: false })
  title?: string;

  @ApiProperty({ example: 1, required: false })
  authorId?: number;

  @ApiProperty({ example: 2, required: false })
  categoryId?: number;

  @ApiProperty({ example: 'A classic novel about wealth and love', required: false })
  description?: string;
}

export class BookResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'The Great Gatsby' })
  title: string;

  @ApiProperty({ example: 'A classic novel about wealth and love' })
  description?: string;

  @ApiProperty({ example: { id: 1, name: 'F. Scott Fitzgerald' } })
  author?: { id: number; name: string };

  @ApiProperty({ example: { id: 2, name: 'Fiction' } })
  category?: { id: number; name: string };
}

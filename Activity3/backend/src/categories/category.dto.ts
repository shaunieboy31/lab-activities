import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Fiction' })
  name: string;
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'Fiction' })
  name: string;
}

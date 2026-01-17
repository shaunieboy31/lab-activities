import { ApiProperty } from '@nestjs/swagger';

export class AuthorDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  name: string;
}

export class CreateAuthorDto {
  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  name: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteDto {
  @ApiProperty({ example: 'Updated note title', required: false })
  title?: string;

  @ApiProperty({ example: 'Updated content', required: false })
  content?: string;
}
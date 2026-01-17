import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ example: 'My first note' })
  title: string;

  @ApiProperty({ example: 'This is the content of my note' })
  content: string;
}

export class NoteResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My first note' })
  title: string;

  @ApiProperty({ example: 'This is the content of my note' })
  content: string;

  @ApiProperty({ example: '2026-01-17T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-17T10:30:00Z' })
  updatedAt: Date;
}
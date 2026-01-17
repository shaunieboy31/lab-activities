import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateMessageDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({ example: 'Hello everyone!' })
  @IsString()
  @IsNotEmpty()
  content: string
}

export class MessageResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'john_doe' })
  username: string

  @ApiProperty({ example: 'Hello everyone!' })
  content: string

  @ApiProperty({ example: '2026-01-17T16:30:00Z' })
  createdAt: Date

  @ApiProperty({ example: 1 })
  chatroomId: number
}

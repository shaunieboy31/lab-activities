import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateChatroomDto {
  @ApiProperty({ example: 'General Chat' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'A room for general discussion', required: false })
  @IsOptional()
  @IsString()
  description?: string
}

export class ChatroomResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'General Chat' })
  name: string

  @ApiProperty({ example: 'A room for general discussion' })
  description?: string

  @ApiProperty({ example: 5 })
  memberCount: number

  @ApiProperty({ example: '2026-01-17T16:30:00Z' })
  createdAt: Date

  @ApiProperty({ example: [] })
  messages?: any[]
}

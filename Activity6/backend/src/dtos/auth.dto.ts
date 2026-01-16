import { ApiProperty } from '@nestjs/swagger'

export class SignupDto {
  @ApiProperty({ example: 'alice' })
  username: string

  @ApiProperty({ example: 'password123' })
  password: string
}

export class LoginDto {
  @ApiProperty({ example: 'alice' })
  username: string

  @ApiProperty({ example: 'password123' })
  password: string
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string
}

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'alice' })
  username: string

  @ApiProperty({ example: 'user', enum: ['user', 'admin'] })
  role: string
}

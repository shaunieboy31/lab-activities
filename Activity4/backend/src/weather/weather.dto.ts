import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty({ example: 'London' })
  city: string;

  @ApiProperty({ example: 'Clouds' })
  weather: string;

  @ApiProperty({ example: 15.5 })
  temperature: number;

  @ApiProperty({ example: 72 })
  humidity: number;

  @ApiProperty({ example: 1013 })
  pressure: number;

  @ApiProperty({ example: 3.5 })
  windSpeed: number;
}

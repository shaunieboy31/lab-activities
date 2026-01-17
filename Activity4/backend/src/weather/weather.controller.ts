import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { WeatherResponseDto } from './weather.dto';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private svc: WeatherService) {}

  @ApiOperation({ summary: 'Get weather by city' })
  @ApiQuery({ name: 'city', description: 'City name', example: 'London' })
  @ApiResponse({ status: 200, description: 'Weather data', type: WeatherResponseDto })
  @Get()
  async get(@Query('city') city: string) {
    return this.svc.getWeatherByCity(city);
  }
}
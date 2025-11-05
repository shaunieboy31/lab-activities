import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private svc: WeatherService) {}

  // GET /weather?city=London
  @Get()
  async get(@Query('city') city: string) {
    return this.svc.getWeatherByCity(city);
  }
}
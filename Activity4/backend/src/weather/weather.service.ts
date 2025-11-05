import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
  constructor(private config: ConfigService) {}

  async getWeatherByCity(city: string) {
    if (!city) throw new HttpException('city query is required', HttpStatus.BAD_REQUEST);

    const key = this.config.get<string>('OPENWEATHER_API_KEY');
    if (!key) throw new HttpException('API key not configured', HttpStatus.INTERNAL_SERVER_ERROR);

    try {
      const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: { q: city, appid: key, units: 'metric' },
      });
      const d = res.data;
      return {
        city: d.name,
        temperature: d.main?.temp,
        condition: d.weather?.[0]?.main,
        description: d.weather?.[0]?.description,
      };
    } catch (err) {
      const status = err.response?.status ?? 500;
      throw new HttpException(err.response?.data?.message ?? 'Failed to fetch weather', status);
    }
  }
}
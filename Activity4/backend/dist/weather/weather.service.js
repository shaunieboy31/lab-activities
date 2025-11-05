"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("@nestjs/config");
let WeatherService = class WeatherService {
    constructor(config) {
        this.config = config;
    }
    async getWeatherByCity(city) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (!city)
            throw new common_1.HttpException('city query is required', common_1.HttpStatus.BAD_REQUEST);
        const key = this.config.get('OPENWEATHER_API_KEY');
        if (!key)
            throw new common_1.HttpException('API key not configured', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        try {
            const res = await axios_1.default.get('https://api.openweathermap.org/data/2.5/weather', {
                params: { q: city, appid: key, units: 'metric' },
            });
            const d = res.data;
            return {
                city: d.name,
                temperature: (_a = d.main) === null || _a === void 0 ? void 0 : _a.temp,
                condition: (_c = (_b = d.weather) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.main,
                description: (_e = (_d = d.weather) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.description,
            };
        }
        catch (err) {
            const status = (_g = (_f = err.response) === null || _f === void 0 ? void 0 : _f.status) !== null && _g !== void 0 ? _g : 500;
            throw new common_1.HttpException((_k = (_j = (_h = err.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.message) !== null && _k !== void 0 ? _k : 'Failed to fetch weather', status);
        }
    }
};
WeatherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WeatherService);
exports.WeatherService = WeatherService;
//# sourceMappingURL=weather.service.js.map
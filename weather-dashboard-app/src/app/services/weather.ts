import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CurrentWeatherResponse {
  name: string; 
  sys: { country: string }; 
  main: { temp: number; humidity: number };
  wind: { speed: number };
  weather: { description: string }[];
}

export interface ForecastResponse {
  daily: {
    dt: number;
    temp: { day: number; min: number; max: number };
    weather: { description: string }[];
    windSpeed: number;
    humidity: number;
  }[];
}

@Injectable({
  providedIn: 'root', 
})
export class WeatherService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private cache = new Map<string, { timestamp: number; data: CurrentWeatherResponse }>();
  private cacheDuration = 10 * 60 * 1000;
  private lastRequest = new Map<string, number>();
  private throttleDuration = 2000;

  private forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily';
  private forecastCache = new Map<string, { timestamp: number; data: ForecastResponse }>();
  private forecastCacheDuration = 10 * 60 * 1000;
  private lastForecastRequest = new Map<string, number>();
  private forecastThrottleDuration = 2000;

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string, unit: 'metric' | 'imperial'): Observable<CurrentWeatherResponse> {
    const key = `${city}-${unit}`;
    const now = Date.now();

    const lastTime = this.lastRequest.get(key);
    if (lastTime && now - lastTime < this.throttleDuration) {
      return throwError(() => new Error('Request throttled: please wait a moment'));
    }
    this.lastRequest.set(key, now);

    const cached = this.cache.get(key);
    if (cached && now - cached.timestamp < this.cacheDuration) {
      return of(cached.data);
    }

    const url = `${this.apiUrl}?q=${encodeURIComponent(city)}&units=${unit}&appid=${environment.weatherApiKey}`;

    return this.http.get<CurrentWeatherResponse>(url).pipe(
      tap(data => this.cache.set(key, { timestamp: now, data })),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) return throwError(() => new Error('City not found'));
        if (error.status === 401) return throwError(() => new Error('Invalid API key'));
        return throwError(() => new Error('Network error'));
      })
    );
  }

  getForecast(city: string, country: string | undefined, unit: 'metric' | 'imperial'): Observable<ForecastResponse> {
    const key = `${city}-${country ?? ''}-${unit}`;
    const now = Date.now();

    const lastTime = this.lastForecastRequest.get(key);
    if (lastTime && now - lastTime < this.forecastThrottleDuration) {
      return throwError(() => new Error('Request throttled: please wait a moment'));
    }
    this.lastForecastRequest.set(key, now);

    const cached = this.forecastCache.get(key);
    if (cached && now - cached.timestamp < this.forecastCacheDuration) {
      return of(cached.data);
    }

    const query = country ? `${city},${country}` : city;
    const url = `${this.forecastApiUrl}?q=${encodeURIComponent(query)}&cnt=7&units=${unit}&appid=${environment.weatherApiKey}`;

    return this.http.get<any>(url).pipe(
      map(rawData => {
        const data: ForecastResponse = {
          daily: rawData.list.map((d: any) => ({
            dt: d.dt,
            temp: { day: d.temp.day, min: d.temp.min, max: d.temp.max },
            weather: d.weather,
            windSpeed: d.speed, 
            humidity: d.humidity,
          })),
        };
        this.forecastCache.set(key, { timestamp: now, data });
        return data;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) return throwError(() => new Error('City not found'));
        if (error.status === 401) return throwError(() => new Error('Invalid API key'));
        return throwError(() => new Error('Network error'));
      })
    );
  }
}

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
    date: string;
    min?: number;
    max?: number;
    condition?: string;
    icon?: string;
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
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(query)}&units=metric&appid=${environment.weatherApiKey}`;

    return this.http.get<any>(url).pipe(
      map(rawData => {
        const dailyMap = new Map<string, ForecastResponse['daily'][0]>();
        rawData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000).toISOString().split('T')[0];
          const tempMin = item.main.temp_min;
          const tempMax = item.main.temp_max;
          const condition = item.weather[0]?.description;
          const icon = item.weather[0]?.icon;

          if (!dailyMap.has(date)) {
            dailyMap.set(date, { date, min: tempMin, max: tempMax, condition, icon });
          } else {
            const day = dailyMap.get(date)!;
            day.min = Math.min(day.min ?? tempMin, tempMin);
            day.max = Math.max(day.max ?? tempMax, tempMax);
          }
        });

        const dailyArray: ForecastResponse['daily'] = Array.from(dailyMap.values()).slice(0, 5);
        const data: ForecastResponse = { daily: dailyArray };
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

  askAI(prompt: string): Observable<string> {
    const url = 'https://router.huggingface.co/v1/chat/completions';

    return this.http.post<any>(
      url,
      {
        model: 'Qwen/Qwen3-Coder-Next:novita',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100
      },
      {
        headers: {
          Authorization: `Bearer ${environment.huggingFaceToken}`,
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      map(res => {
        if (res?.choices?.[0]?.message?.content) {
          return res.choices[0].message.content;
        }
        throw new Error('AI response missing content');
      }),
      catchError(err => {
        console.error('Error calling Hugging Face AI', err);
        return throwError(() => new Error('Unable to get AI response.'));
      })
    );
  }
}

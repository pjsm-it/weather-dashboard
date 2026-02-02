import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CurrentWeatherResponse {
  name: string; 
  sys: { country: string }; 
  main: { temp: number; humidity: number };
  wind: { speed: number };
  weather: { description: string }[];
}

@Injectable({
  providedIn: 'root', 
})
export class WeatherService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string, unit: 'metric' | 'imperial'): Observable<CurrentWeatherResponse> {
    const url = `${this.apiUrl}?q=${encodeURIComponent(city)}&units=${unit}&appid=${environment.weatherApiKey}`;

    return this.http.get<CurrentWeatherResponse>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) return throwError(() => new Error('City not found'));
        if (error.status === 401) return throwError(() => new Error('Invalid API key'));
        return throwError(() => new Error('Network error'));
      })
    );
  }
}

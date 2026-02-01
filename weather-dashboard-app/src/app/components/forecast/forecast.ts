import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast.html',
  styleUrl: './forecast.css',
})
export class Forecast {
  @Input()
  protected forecastDays: ForecastDay[] = [];

  @Input()
  protected unit: 'metric' | 'imperial' = 'metric';

  protected getDisplayTemperature(temp?: number): number | undefined {
    if (temp === undefined) return undefined;
    return this.unit === 'metric'
      ? temp
      : temp * 9 / 5 + 32;
  }
}

export interface ForecastDay {
  date: string;
  temperature?: number;
  condition?: string;
}

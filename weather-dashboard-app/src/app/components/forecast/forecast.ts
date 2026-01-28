import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast.html',
  styleUrl: './forecast.css',
})
export class Forecast {
  protected forecastDays: ForecastDay[] = [];
}

export interface ForecastDay {
  date: string;
  temperature?: number;
  condition?: string;
}
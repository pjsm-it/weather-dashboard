import { Component, Input, signal, effect, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, ForecastResponse } from '../../services/weather';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast.html',
  styleUrl: './forecast.css',
})
export class Forecast {

  @Input() citySignal!: Signal<string>;
  @Input() countrySignal!: Signal<string | undefined>;
  @Input() unitSignal!: Signal<'metric' | 'imperial'>;

  protected forecastDays = signal<ForecastResponse['daily']>([]);
  protected loading = signal(false);

  constructor(private weatherService: WeatherService) {
    effect(() => {
      const city = this.citySignal();
      const country = this.countrySignal();
      const unit = this.unitSignal();

      if (!city) return;

      this.fetchForecast(city, country, unit);
    });
  }

  private fetchForecast(city: string, country: string | undefined, unit: 'metric' | 'imperial') {
    this.loading.set(true);
    this.forecastDays.set([]);

    this.weatherService.getForecast(city, country, unit).subscribe({
      next: data => {
        this.forecastDays.set(data.daily);
        this.loading.set(false);
      },
      error: err => {
        console.error('Forecast API error:', err.message);
        this.loading.set(false);
      }
    });
  }

  protected getDisplayTemperature(temp?: number): number | undefined {
    if (temp === undefined) return undefined;
    return this.unit === 'metric' ? temp : temp * 9 / 5 + 32;
  }

  protected getDisplayWindSpeed(speed?: number): number | undefined {
    if (speed === undefined) return undefined;
    return this.unit === 'metric' ? speed : speed * 2.237;
  }

  protected get city() {
    return this.citySignal();
  }

  protected get unit() {
    return this.unitSignal();
  }
}

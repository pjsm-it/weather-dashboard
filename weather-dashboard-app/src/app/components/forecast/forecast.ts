import { Component, Input, signal, effect, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, ForecastResponse } from '../../services/weather';

/**
 * Forecast component displays a 5-day weather forecast for a selected city.
 * 
 * Automatically updates when the city, country, or unit signals change.
 */
@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast.html',
  styleUrl: './forecast.css',
})
export class Forecast {
  /** Signal containing the selected city name */
  @Input() citySignal!: Signal<string>;

  /** Signal containing the selected country code (optional) */
  @Input() countrySignal!: Signal<string | undefined>;

  /** Signal containing the current unit of measurement ('metric' or 'imperial') */
  @Input() unitSignal!: Signal<'metric' | 'imperial'>;

  /** Array of forecasted daily weather objects */
  protected forecastDays = signal<ForecastResponse['daily']>([]);

  /** Loading state while fetching forecast data */
  protected loading = signal(false);

  constructor(private weatherService: WeatherService) {
    // Automatically fetch forecast whenever city, country, or unit changes
    effect(() => {
      const city = this.citySignal();
      const country = this.countrySignal();
      const unit = this.unitSignal();

      if (!city) return;

      this.fetchForecast(city, country, unit);
    });
  }

  /**
   * Fetches forecast data from WeatherService.
   * Updates forecastDays and loading signals.
   * 
   * @param city Name of the city
   * @param country Optional ISO country code to reduce ambiguity
   * @param unit 'metric' or 'imperial'
   */
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

  /**
   * Converts a temperature to the currently selected unit.
   * @param temp Temperature in metric units (°C)
   * @returns Temperature in the current unit
   */
  protected getDisplayTemperature(temp?: number): number | undefined {
    if (temp === undefined) return undefined;
    return this.unit === 'metric' ? temp : temp * 9 / 5 + 32;
  }

  /**
   * Converts wind speed to the currently selected unit.
   * @param speed Wind speed in metric units (m/s)
   * @returns Wind speed in the current unit
   */
  protected getDisplayWindSpeed(speed?: number): number | undefined {
    if (speed === undefined) return undefined;
    return this.unit === 'metric' ? speed : speed * 2.237;
  }

  /** Convenience getter for the current city */
  protected get city() {
    return this.citySignal();
  }

  /** Convenience getter for the current unit */
  protected get unit() {
    return this.unitSignal();
  }
}

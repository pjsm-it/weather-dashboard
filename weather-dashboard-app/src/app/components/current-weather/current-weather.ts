import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, CurrentWeatherResponse } from '../../services/weather';

/**
 * CurrentWeather component displays real-time weather information
 * for a selected city, including temperature, humidity, wind speed, and condition.
 *
 * Note: Cities with the same name in different countries may cause ambiguity.
 *       Providing the country code reduces the risk of showing incorrect data.
 */
@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './current-weather.html',
  styleUrls: ['./current-weather.css']
})
export class CurrentWeather implements OnChanges {
  /** Selected city name (optional) */
  @Input() city?: string;

  /** Selected country code (optional) */
  @Input() country?: string;

  /** Unit system for temperature and wind speed ('metric' or 'imperial') */
  @Input() unit?: 'metric' | 'imperial';

  /** Current temperature in selected unit */
  protected temperature = signal<number | undefined>(undefined);

  /** Current weather condition description */
  protected condition = signal<string | undefined>(undefined);

  /** Current humidity percentage */
  protected humidity = signal<number | undefined>(undefined);

  /** Current wind speed in selected unit */
  protected windSpeed = signal<number | undefined>(undefined);

  /** Country code signal */
  protected countrySignal = signal<string | undefined>(undefined);

  /** Base temperature in metric for unit conversion */
  private baseTemperature?: number;

  /** Base wind speed in metric for unit conversion */
  private baseWindSpeed?: number;

  constructor(private weatherService: WeatherService) {}

  /**
   * Detects changes in city or unit input properties.
   * Fetches weather when city changes and converts units when unit changes.
   * @param changes Changes object from Angular
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['city']) {
      this.fetchWeather();
    }
    if (changes['unit']) {
      this.applyUnitConversion();
    }
  }

  /**
   * Fetches current weather data from the WeatherService.
   * Updates signals for temperature, condition, humidity, wind, and country.
   */
  protected fetchWeather() {
    if (!this.city) return;

    this.temperature.set(undefined);
    this.humidity.set(undefined);
    this.windSpeed.set(undefined);
    this.condition.set(undefined);
    this.countrySignal.set(undefined);

    this.weatherService.getCurrentWeather(this.city, 'metric').subscribe({
      next: (data: CurrentWeatherResponse) => {
        this.baseTemperature = data.main.temp;
        this.baseWindSpeed = data.wind.speed;

        this.humidity.set(data.main.humidity);
        this.condition.set(data.weather[0]?.description);
        this.countrySignal.set(data.sys.country);

        this.applyUnitConversion();
      },
      error: (err: Error) => {
        console.error('Weather API error:', err.message);
      }
    });
  }

  /**
   * Converts base temperature and wind speed to the currently selected unit.
   */
  private applyUnitConversion() {
    if (this.baseTemperature !== undefined) {
      this.temperature.set(
        this.unit === 'metric'
          ? this.baseTemperature
          : this.baseTemperature * 9 / 5 + 32 
      );
    }

    if (this.baseWindSpeed !== undefined) {
      this.windSpeed.set(
        this.unit === 'metric'
          ? this.baseWindSpeed
          : this.baseWindSpeed * 2.23694 
      );
    }
  }

  /** Returns the temperature in the currently selected unit */
  protected get displayTemperature(): number | undefined {
    return this.temperature();
  }

  /** Returns the wind speed in the currently selected unit */
  protected get displayWind(): number | undefined {
    return this.windSpeed();
  }
}

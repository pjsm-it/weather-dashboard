import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, CurrentWeatherResponse } from '../../services/weather';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './current-weather.html',
  styleUrls: ['./current-weather.css']
})
export class CurrentWeather implements OnChanges {

  @Input() city?: string;
  @Input() country?: string;
  @Input() unit?: 'metric' | 'imperial';

  protected temperature = signal<number | undefined>(undefined);
  protected condition = signal<string | undefined>(undefined);
  protected humidity = signal<number | undefined>(undefined);
  protected windSpeed = signal<number | undefined>(undefined);
  protected countrySignal = signal<string | undefined>(undefined);

  private baseTemperature?: number;
  private baseWindSpeed?: number;

  constructor(private weatherService: WeatherService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['city']) {
      this.fetchWeather();
    }
    if (changes['unit']) {
      this.applyUnitConversion();
    }
  }

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

  protected get displayTemperature(): number | undefined {
    return this.temperature();
  }

  protected get displayWind(): number | undefined {
    return this.windSpeed();
  }
}

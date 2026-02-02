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

  @Input() city!: string;
  @Input() country?: string;
  @Input() unit!: 'metric' | 'imperial';

  protected temperature = signal<number | undefined>(undefined);
  protected condition = signal<string | undefined>(undefined);
  protected humidity = signal<number | undefined>(undefined);
  protected windSpeed = signal<number | undefined>(undefined);
  protected countrySignal = signal<string | undefined>(undefined);

  constructor(private weatherService: WeatherService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['city'] || changes['unit']) {
      this.fetchWeather();
    }
  }

  protected fetchWeather() {
    if (!this.city) return;

    this.temperature.set(undefined);
    this.humidity.set(undefined);
    this.windSpeed.set(undefined);
    this.condition.set(undefined);
    this.countrySignal.set(undefined);

    this.weatherService.getCurrentWeather(this.city, this.unit).subscribe({
      next: (data: CurrentWeatherResponse) => {
        this.temperature.set(data.main.temp);
        this.humidity.set(data.main.humidity);
        this.windSpeed.set(data.wind.speed);
        this.condition.set(data.weather[0]?.description);
        this.countrySignal.set(data.sys.country);
      },
      error: (err: Error) => {
        console.error('Weather API error:', err.message);
      }
    });
  }

  protected get displayTemperature(): number | undefined {
    return this.temperature();
  }

  protected get displayWind(): number | undefined {
    return this.windSpeed();
  }
}

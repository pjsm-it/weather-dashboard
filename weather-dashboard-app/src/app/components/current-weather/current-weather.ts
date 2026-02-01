import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './current-weather.html',
  styleUrls: ['./current-weather.css']
})
export class CurrentWeather {

  @Input()
  city!: string;

  @Input()
  unit!: 'metric' | 'imperial';

  protected temperature?: number;
  protected condition?: string;
  protected humidity?: number;
  protected windSpeed?: number;

  get displayTemperature(): number | undefined {
    if (this.temperature === undefined) return undefined;
    return this.unit === 'metric'
      ? this.temperature
      : this.temperature * 9 / 5 + 32;
  }

  get displayWind(): number | undefined {
    if (this.windSpeed === undefined) return undefined;
    return this.unit === 'metric'
      ? this.windSpeed
      : this.windSpeed * 2.23694;
  }
}

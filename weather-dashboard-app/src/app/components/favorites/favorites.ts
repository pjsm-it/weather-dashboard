import { Component, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, CurrentWeatherResponse } from '../../services/weather';

export interface CityQuery {
  name: string;
  country?: string;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnChanges {
  @Input() selectedCitySignal!: CityQuery; 
  @Input() loadWeather!: (query: CityQuery) => void;

  protected lastCities: CityQuery[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCitySignal'] && this.selectedCitySignal?.name) {
      this.addCity(this.selectedCitySignal);
    }
  }

  private addCity(city: CityQuery) {
    this.lastCities = this.lastCities.filter(c => !(c.name === city.name && c.country === city.country));
    this.lastCities.unshift(city);
    if (this.lastCities.length > 5) this.lastCities.pop();
  }

  protected selectCity(city: CityQuery) {
    if (this.loadWeather) this.loadWeather(city);
  }
}

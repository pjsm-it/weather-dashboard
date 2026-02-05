import { Component, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityQuery } from '../search/search';

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

  private storageKey = 'favoriteCities';

  constructor() {
    this.loadFromStorage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCitySignal'] && this.selectedCitySignal?.name) {
      this.addCity(this.selectedCitySignal);
    }
  }

  private addCity(city: CityQuery) {
    this.lastCities = this.lastCities.filter(c => !(c.name === city.name && c.country === city.country));
    this.lastCities.unshift(city);
    if (this.lastCities.length > 5) this.lastCities.pop();
    this.saveToStorage();
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.lastCities));
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.lastCities = JSON.parse(stored);
      } catch {
        this.lastCities = [];
      }
    }
  }

  protected selectCity(city: CityQuery) {
    if (this.loadWeather) this.loadWeather(city);
  }

  protected clearStorage() {
    localStorage.removeItem(this.storageKey);
    this.lastCities = [];
  }
}

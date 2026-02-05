import { Component, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityQuery } from '../search/search';

/**
 * Favorites component maintains a list of the last 5 searched cities.
 * Stores cities in localStorage to persist across sessions.
 * Clicking a favorite city triggers loading its weather via the parent callback.
 */
@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnChanges {
  /** Signal containing the currently selected city */
  @Input() selectedCitySignal!: CityQuery;

  /**
   * Callback function provided by parent to load weather data
   * when a favorite city is clicked.
   */
  @Input() loadWeather!: (query: CityQuery) => void;

  /** Array holding last 5 favorite cities */
  protected lastCities: CityQuery[] = [];

  /** Key used for storing favorites in localStorage */
  private storageKey = 'favoriteCities';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Detects changes to the selectedCitySignal and adds new cities to favorites.
   * @param changes Changes object from Angular
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCitySignal'] && this.selectedCitySignal?.name) {
      this.addCity(this.selectedCitySignal);
    }
  }

  /**
   * Adds a city to the favorites list, ensuring no duplicates.
   * Limits the list to 5 cities and updates localStorage.
   * @param city CityQuery object to add
   */
  private addCity(city: CityQuery) {
    this.lastCities = this.lastCities.filter(c => !(c.name === city.name && c.country === city.country));
    this.lastCities.unshift(city);
    if (this.lastCities.length > 5) this.lastCities.pop();
    this.saveToStorage();
  }

  /** Saves current favorites to localStorage */
  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.lastCities));
  }

  /** Loads favorites from localStorage */
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

  /**
   * Triggers the parent callback to load weather for the selected favorite city.
   * @param city CityQuery object to load
   */
  protected selectCity(city: CityQuery) {
    if (this.loadWeather) this.loadWeather(city);
  }

  /** Clears localStorage and empties the favorites list */
  protected clearStorage() {
    localStorage.removeItem(this.storageKey);
    this.lastCities = [];
  }
}

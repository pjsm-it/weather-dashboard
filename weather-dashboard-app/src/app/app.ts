import { Component, signal } from '@angular/core';
import { Search, CityQuery } from './components/search/search';
import { CurrentWeather } from './components/current-weather/current-weather';
import { Forecast } from './components/forecast/forecast';
import { Favorites } from './components/favorites/favorites';
import { Footer } from './components/footer/footer';
import { AiPrompt } from './components/ai-prompt/ai-prompt';

/**
 * App component - root component of the Weather Dashboard application.
 *
 * Manages the selected city, country, and unit (metric/imperial) signals.
 * Coordinates communication between Search, CurrentWeather, Forecast, Favorites, and AiPrompt components.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Search,
    CurrentWeather,
    Forecast,
    Favorites,
    Footer,
    AiPrompt
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /** Application title */
  protected readonly title = signal('weather-dashboard-app');

  /** Currently selected city name */
  protected readonly selectedCity = signal('Braga');

  /** Currently selected country code (optional) */
  protected readonly selectedCountry = signal<string | undefined>(undefined);

  /** Full CityQuery object for selected city and optional country */
  protected readonly selectedCityQuery = signal<CityQuery>({ name: 'Braga' });

  /** Unit of measurement: 'metric' (°C/m/s) or 'imperial' (°F/mph) */
  protected readonly unit = signal<'metric' | 'imperial'>('metric');

  /**
   * Handles selection of a city from the Search component.
   * Updates selectedCity, selectedCountry, and selectedCityQuery signals.
   * @param query CityQuery object containing city name and optional country code
   */
  protected onCitySelected(query: CityQuery) {
    this.selectedCity.set(query.name);
    this.selectedCountry.set(query.country);
    this.selectedCityQuery.set(query);
  }

  /**
   * Toggles the unit of measurement between metric and imperial.
   */
  protected toggleUnit() {
    this.unit.set(this.unit() === 'metric' ? 'imperial' : 'metric');
  }

  /**
   * Loads weather for a city selected from Favorites component.
   * Reuses selectedCity, selectedCountry, and selectedCityQuery signals.
   * @param query CityQuery object containing city name and optional country code
   */
  protected loadWeatherFromFavorites(query: CityQuery) {
    this.selectedCity.set(query.name);
    this.selectedCountry.set(query.country);
    this.selectedCityQuery.set(query);
  }
}

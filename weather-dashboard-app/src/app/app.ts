import { Component, signal } from '@angular/core';
import { Search, CityQuery } from './components/search/search';
import { CurrentWeather } from './components/current-weather/current-weather';
import { Forecast } from './components/forecast/forecast';
import { Favorites } from './components/favorites/favorites';
import { Footer } from './components/footer/footer';
import { AiPrompt } from './components/ai-prompt/ai-prompt';
import { single } from 'rxjs';

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
  protected readonly title = signal('weather-dashboard-app');

  protected readonly selectedCity = signal('Braga');
  protected readonly selectedCountry = signal<string | undefined>(undefined);

  protected readonly unit = signal<'metric' | 'imperial'>('metric');

  protected onCitySelected(query: CityQuery) {
    this.selectedCity.set(query.name);
    this.selectedCountry.set(query.country);
  }

  protected toggleUnit() {
    this.unit.set(this.unit() === 'metric' ? 'imperial' : 'metric');
  }
}

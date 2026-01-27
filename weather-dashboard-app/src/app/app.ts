import { Component, signal } from '@angular/core';
import { Search } from './components/search/search';
import { CurrentWeather } from './components/current-weather/current-weather';
import { Forecast } from './components/forecast/forecast';
import { Favorites } from './components/favorites/favorites';
import { Footer } from './components/footer/footer';
import { AiPrompt } from "./components/ai-prompt/ai-prompt";

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
}

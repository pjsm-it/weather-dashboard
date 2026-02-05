import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 

/**
 * Represents a city search query, optionally including a country code.
 */
export interface CityQuery {
  /** Name of the city */
  name: string;
  /** Optional ISO country code to reduce ambiguity */
  country?: string;
}

/**
 * Search component for entering a city (and optionally country) to fetch weather data.
 *
 * Emits a CityQuery object when a city is selected.
 *
 * Note: Cities with the same name in different countries may cause ambiguity.
 *       Including a country code in the search reduces this risk.
 */
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
})
export class Search {
  /** Current value of the search input */
  protected readonly city = signal('');

  /** Current error message for validation feedback */
  protected readonly errorMessage = signal('');

  /** Event emitted when a city is selected */
  @Output()
  protected readonly citySelected = new EventEmitter<CityQuery>();

  /**
   * Handles the search action when the user clicks the search button or presses Enter.
   *
   * Splits input by comma to separate city and optional country code.
   * Emits a CityQuery object via citySelected EventEmitter.
   */
  protected searchCity() {
    const value = this.city().trim();
    if (!value) {
      this.errorMessage.set('City name cannot be empty!');
      return;
    }

    this.errorMessage.set('');

    const parts = value.split(',').map(p => p.trim());
    const query: CityQuery = { name: parts[0] };
    if (parts[1]) query.country = parts[1];

    this.citySelected.emit(query);
  }

  /**
   * Handles keyboard events in the input.
   * Triggers searchCity() when Enter key is pressed.
   * @param event KeyboardEvent from input field
   */
  protected handleKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchCity();
    }
  }
}

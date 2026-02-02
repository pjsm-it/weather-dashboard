import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 

export interface CityQuery {
  name: string;
  country?: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
})
export class Search {
  protected readonly city = signal('');
  protected readonly errorMessage = signal('');

  @Output()
  protected readonly citySelected = new EventEmitter<CityQuery>();

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

  protected handleKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchCity();
    }
  }
}

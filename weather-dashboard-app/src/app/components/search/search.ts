import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search {
  protected readonly city = signal('');

  @Output()
  protected readonly citySelected = new EventEmitter<string>();

  protected searchCity() {
    const value = this.city();
    if (value.trim()) {
      this.citySelected.emit(value.trim());
    }
  }

  protected handleKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchCity();
    }
  }
}

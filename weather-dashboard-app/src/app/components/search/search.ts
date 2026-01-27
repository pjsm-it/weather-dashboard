import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 

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
  protected readonly citySelected = new EventEmitter<string>();

  protected searchCity() {
    const value = this.city();
    if (!value.trim()) {
      this.errorMessage.set('City name cannot be empty!');
      return;
    }
    this.errorMessage.set('');
    this.citySelected.emit(value.trim());
  }

  protected handleKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchCity();
    }
  }
}

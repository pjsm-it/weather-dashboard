import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  protected favoriteCities: string[] = [];
}

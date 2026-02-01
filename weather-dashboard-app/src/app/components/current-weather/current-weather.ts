import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './current-weather.html',
  styleUrls: ['./current-weather.css']
})
export class CurrentWeather {

  @Input()
  city!: string;

  @Input()
  unit!: 'metric' | 'imperial';

  protected temperature?: number;
  protected condition?: string;
  protected humidity?: number;
  protected windSpeed?: number;
}

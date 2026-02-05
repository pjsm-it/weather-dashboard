import { Component, signal, effect, Input } from '@angular/core';
import { WeatherService } from '../../services/weather';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-prompt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-prompt.html',
  styleUrls: ['./ai-prompt.css'],
})
export class AiPrompt {
  protected prompt = signal('');
  protected aiResponse = signal('');
  protected loading = signal(false);

  private cache = new Map<string, string>();
  private lastRequest = 0;
  private throttleDuration = 2000;

  constructor(private weatherService: WeatherService) {
    effect(() => {
      if (!this.prompt()) {
        this.aiResponse.set('');
      }
    });
  }

  protected sendPrompt() {
    const question = this.prompt().trim();
    if (!question) return;

    const now = Date.now();
    if (now - this.lastRequest < this.throttleDuration) return;
    this.lastRequest = now;

    if (this.cache.has(question)) {
      this.aiResponse.set(this.cache.get(question)!);
      return;
    }

    this.loading.set(true);
    this.aiResponse.set('');

    this.weatherService.askAI(question).subscribe({
      next: (res: any) => {
        const answer = res[0]?.generated_text ?? 'No response';
        this.aiResponse.set(answer);
        this.cache.set(question, answer);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('AI API error:', err);
        this.aiResponse.set('Error: Unable to get AI response.');
        this.loading.set(false);
      }
    });
  }
}

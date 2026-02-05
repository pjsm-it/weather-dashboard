import { Component, signal, effect } from '@angular/core';
import { WeatherService } from '../../services/weather';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * AiPrompt component allows the user to send a natural language query
 * about the current weather to an AI service and displays a concise response.
 *
 * Includes caching and throttling to minimize repeated API calls.
 */
@Component({
  selector: 'app-ai-prompt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-prompt.html',
  styleUrls: ['./ai-prompt.css'],
})
export class AiPrompt {
  /** Current text input from the user */
  protected prompt = signal('');

  /** Current AI response to the user's prompt */
  protected aiResponse = signal('');

  /** Loading state while waiting for AI response */
  protected loading = signal(false);

  /** Cache to store previous prompt responses */
  private cache = new Map<string, string>();

  /** Timestamp of last API request for throttling */
  private lastRequest = 0;

  /** Minimum delay between requests in milliseconds */
  private throttleDuration = 2000;

  constructor(private weatherService: WeatherService) {
    // Clear AI response if the input prompt is empty
    effect(() => {
      if (!this.prompt()) {
        this.aiResponse.set('');
      }
    });
  }

  /**
   * Sends the current prompt to the AI service if valid,
   * using cached responses if available and respecting throttling.
   */
  protected sendPrompt() {
    const userInput = this.prompt().trim();
    if (!userInput) return;

    const now = Date.now();
    if (now - this.lastRequest < this.throttleDuration) return;
    this.lastRequest = now;

    if (this.cache.has(userInput)) {
      this.aiResponse.set(this.cache.get(userInput)!);
      return;
    }

    this.loading.set(true);
    this.aiResponse.set('');

    const question = `Answer concisely about the current weather in one or two sentences: ${userInput}`;

    this.weatherService.askAI(question).subscribe({
      next: (res: string) => {
        this.aiResponse.set(res);
        this.cache.set(userInput, res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('AI API error:', err);
        this.aiResponse.set('Error: Unable to get AI response.');
        this.loading.set(false);
      }
    });
  }

  /**
   * Handles keyboard input, sending prompt on Enter key.
   * @param event KeyboardEvent triggered by user input
   */
  protected handleKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendPrompt();
    }
  }
}

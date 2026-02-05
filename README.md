# Weather Dashboard

Real-time weather dashboard built with Angular. This application allows users to fetch current weather data and a 5-day forecast for any city in the world using the OpenWeatherMap API. It features a clean, responsive UI, favorites management, and basic error handling. Developed as a portfolio project by Paulo Melo.

---

## Features

- **City Search:** Search for any city with optional country code to reduce ambiguity.  
- **Current Weather:** Displays temperature, weather condition, humidity, wind speed, and country.  
- **Favorites:** Stores the last 5 searched cities in `localStorage` for quick access.  
- **Unit Toggle:** Switch between Metric (°C, m/s) and Imperial (°F, mph) units.  
- **AI Prompt:** Ask questions about the current weather and get concise AI-generated responses.  
- **Responsive UI:** Works on mobile and desktop devices.  
- **Error Handling:** Handles invalid cities, API key errors, and network issues.

---

## Technologies

- Angular (Standalone Components)  
- TypeScript  
- RxJS  
- OpenWeatherMap API  
- HuggingFace API for AI prompts  
- LocalStorage for favorites  
- HTML5 & CSS3 (Responsive Design)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git

2. Navigate into the project:
    ```bash
    cd weather-dashboard/weather-dashboard-app

3. Install dependencies:
    ```bash
    npm install

4. Creante an .env file (or update environment.ts) with your API keys:
    ```bash
    cd weather-dashboard/weather-dashboard-app

5. Run the development server:
    ```bash
    ng serve

## Usage
* Enter a city name (optionally with country code) and click "Search" or press Enter.
* Toggle units between Metric and Imperial.
* Click on a favorite city to reload its weather data.
* Use the AI prompt to ask concise weather-related questions.

## Future Improvements
* Enter a city name (optionally with country code) and click "Search" or press Enter.
* Toggle units between Metric and Imperial.
* Click on a favorite city to reload its weather data.
* Use the AI prompt to ask concise weather-related questions.

## License
This project is licensed under the MIT License.

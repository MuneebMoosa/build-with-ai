import axios from 'axios';

export interface WeatherData {
  temperature: number;
  condition: string;
  locationName: string;
}

const interpretWeatherCode = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 55) return 'Drizzle';
  if (code <= 65) return 'Rain';
  if (code <= 75) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Unknown';
};

export const fetchWeatherData = async (lat: number, lon: number, locationName: string = 'Current Location'): Promise<WeatherData> => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const current = response.data.current_weather;
    return {
      temperature: current.temperature,
      condition: interpretWeatherCode(current.weathercode),
      locationName: locationName
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return { temperature: 30, condition: 'Partly cloudy', locationName: locationName };
  }
};

export const fetchCityCoordinates = async (cityName: string): Promise<{lat: number, lon: number, name: string} | null> => {
  try {
    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );
    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      return { lat: result.latitude, lon: result.longitude, name: result.name };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch coordinates:', error);
    return null;
  }
};

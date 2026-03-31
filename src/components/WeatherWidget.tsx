import React, { useState } from 'react';
import { CloudRain, Sun, Cloud, MapPin, Search } from 'lucide-react';
import { type WeatherData } from '../services/weather';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  loading: boolean;
  onChangeLocation: (city: string) => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, loading, onChangeLocation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cityInput, setCityInput] = useState('');

  if (loading) {
    return (
      <div className="bg-green-700 bg-opacity-30 px-3 py-1.5 rounded-full flex gap-2 items-center animate-pulse">
        <div className="w-5 h-5 bg-green-500 rounded-full"></div>
        <div className="w-10 h-3 bg-green-500 rounded"></div>
      </div>
    );
  }

  if (!weather) return null;

  const getWeatherIcon = (condition: string) => {
    const lCondition = condition.toLowerCase();
    if (lCondition.includes('rain') || lCondition.includes('drizzle')) return <CloudRain className="w-5 h-5 text-blue-200" />;
    if (lCondition.includes('cloud') || lCondition.includes('fog')) return <Cloud className="w-5 h-5 text-gray-200" />;
    return <Sun className="w-5 h-5 text-yellow-300" />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      onChangeLocation(cityInput.trim());
      setIsEditing(false);
      setCityInput('');
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-full overflow-hidden shadow-inner max-w-[150px]">
        <input 
          autoFocus
          className="bg-transparent px-3 py-1 text-sm text-gray-800 w-full focus:outline-none" 
          placeholder="സ്ഥലം തിരയൂ..."
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
        />
        <button type="submit" className="p-1 text-green-600 hover:text-green-800 rounded-full mr-1">
          <Search className="w-4 h-4 cursor-pointer" />
        </button>
      </form>
    );
  }

  return (
    <div 
      title="സ്ഥലം മാറ്റുക" 
      onClick={() => setIsEditing(true)}
      className="bg-green-700 bg-opacity-50 px-3 py-1.5 rounded-full flex items-center gap-2 cursor-pointer hover:bg-opacity-70 transition-colors shadow-sm"
    >
      {getWeatherIcon(weather.condition)}
      <div className="flex flex-col">
        <span className="text-sm font-bold leading-none">{weather.temperature}°C</span>
        <span className="text-[10px] font-medium leading-none mt-1 text-green-100 flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5 inline" /> {weather.locationName}
        </span>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CropSelector } from './components/CropSelector';
import { WeatherWidget } from './components/WeatherWidget';
import { ChatInterface, type ChatMessage } from './components/ChatInterface';
import { fetchWeatherData, fetchCityCoordinates, type WeatherData } from './services/weather';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateFarmingAdvice } from './services/gemini';

const App: React.FC = () => {
  // Global State via LocalStorage
  const [crops, setCrops] = useLocalStorage<string[]>('krishiCrops', ['Rice 🌾', 'Banana 🍌', 'Coconut 🥥']);
  const [activeCrop, setActiveCrop] = useLocalStorage<string>('krishiActiveCrop', 'Rice 🌾');

  // Component State
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [suggestedCrop, setSuggestedCrop] = useState<string | null>(null);
  const [chatExpanded, setChatExpanded] = useState(false);


  const commonCrops = ['banana', 'tomato', 'mango', 'rubber', 'tapioca', 'pepper', 'cardamom', 'coffee', 'tea', 'cashew', 'ginger', 'turmeric', 'nutmeg', 'jackfruit', 'paddy', 'rice', 'coconut', 'wheat', 'potato'];


  // Fetch Weather based on Lat/Lon
  const loadWeather = async (lat: number, lon: number, locationName: string) => {
    setWeatherLoading(true);
    const data = await fetchWeatherData(lat, lon, locationName);
    setWeather(data);
    setWeatherLoading(false);
  };

  // On mount, grab user's GPS natively
  useEffect(() => {
    setWeatherLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeather(position.coords.latitude, position.coords.longitude, "Local");
        },
        (error) => {
          console.warn("Geolocation denied or failed. Defaulting to Kerala center.", error);
          loadWeather(10.5276, 76.2144, "Kerala");
        }
      );
    } else {
      loadWeather(10.5276, 76.2144, "Kerala");
    }
  }, []);

  // Handle manual city search
  const handleChangeLocation = async (city: string) => {
    setWeatherLoading(true);
    const coords = await fetchCityCoordinates(city);
    if (coords) {
      await loadWeather(coords.lat, coords.lon, coords.name);
    } else {
      // Failed to find city
      setWeatherLoading(false);
    }
  };

  const handleSendMessage = async (text: string, image?: string) => {
    // Add user message to chat UI
    setMessages((prev) => [...prev, { text, isUser: true, image }]);
    setChatLoading(true);

    // Look for new crops mentioned in the user's message
    const lowerText = text.toLowerCase();
    const found = commonCrops.find(c => lowerText.includes(c));
    if (found) {
      const hasCrop = crops.some(userCrop => userCrop.toLowerCase().includes(found));
      if (!hasCrop) {
         setSuggestedCrop(found.charAt(0).toUpperCase() + found.slice(1));
      }
    }

    try {
      // Create advice given the input
      const temperature = weather ? weather.temperature : 30;
      const condition = weather ? weather.condition : 'Unknown';
      const loc = weather ? weather.locationName : 'Kerala';
      
      const advice = await generateFarmingAdvice(
        `${text} [Please keep in mind the current location is ${loc}]`, 
        crops,
        activeCrop, 
        temperature, 
        condition, 
        image
      );
      
      setMessages((prev) => [...prev, { text: advice, isUser: false }]);
    } catch (error) {
       setMessages((prev) => [...prev, { text: 'ക്ഷമിക്കണം, ഉത്തരം ലഭിക്കാൻ കഴിഞ്ഞില്ല.', isUser: false }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleAddCrop = (newCrop: string) => {
    setCrops((prev) => [...prev, newCrop]);
    setActiveCrop(newCrop);
  };

  const handleRemoveCrop = (cropToRemove: string) => {
    const updatedCrops = crops.filter(c => c !== cropToRemove);
    setCrops(updatedCrops);
    if (activeCrop === cropToRemove) {
      setActiveCrop(updatedCrops.length > 0 ? updatedCrops[0] : '');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 overflow-hidden font-sans pb-10">
      <div className="max-w-md mx-auto h-screen bg-white shadow-2xl sm:pt-4 sm:h-[95vh] sm:rounded-3xl sm:mt-4 flex flex-col overflow-hidden relative border border-gray-100 pb-2">
        
        <Header>
           <WeatherWidget 
             weather={weather} 
             loading={weatherLoading} 
             onChangeLocation={handleChangeLocation} 
           />
        </Header>
        
        <main className="flex-1 flex flex-col overflow-hidden px-4 pb-4">
          {/* Crop Selector: collapses when chat is expanded */}
          <div className={`transition-all duration-300 overflow-hidden ${
            chatExpanded ? 'max-h-0 opacity-0 mb-0 pointer-events-none' : 'max-h-96 opacity-100 mb-0'
          }`}>
            <CropSelector 
              crops={crops} 
              activeCrop={activeCrop} 
              onSelectCrop={setActiveCrop} 
              onAddCrop={handleAddCrop} 
              onRemoveCrop={handleRemoveCrop}
            />
          </div>

          {/* Drag handle to expand/collapse chat */}
          <div
            onClick={() => setChatExpanded(prev => !prev)}
            className="flex items-center justify-center gap-2 mb-2 cursor-pointer group select-none"
            title={chatExpanded ? 'Collapse chat' : 'Expand chat'}
          >
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full bg-gray-100 group-hover:bg-green-100 transition-colors">
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-green-500 transition-colors"></div>
                <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-green-500 transition-colors"></div>
                <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-green-500 transition-colors"></div>
              </div>
              <span className="text-[10px] text-gray-400 group-hover:text-green-600 font-medium leading-none mt-0.5">
                {chatExpanded ? '▼ ചുരുക്കുക' : '▲ വിസ്തരിക്കുക'}
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {suggestedCrop && (
            <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-xl mb-3 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-2">
              <span className="text-sm font-medium">{suggestedCrop} കൃഷിയെക്കുരിച്ച് നിങ്ങൾ ചോദിച്ചു. പട്ടികയിൽ ചേർക്കണോ?</span>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => {
                    handleAddCrop(`${suggestedCrop} 🌱`);
                    setSuggestedCrop(null);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  കൃഷി ചേർക്കുക
                </button>
                <button 
                  onClick={() => setSuggestedCrop(null)}
                  className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  വേണ്ട
                </button>
              </div>
            </div>
          )}

          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={chatLoading}
            activeCrop={activeCrop}
            weatherSummary={weather ? `${weather.temperature}°C · ${weather.condition} · ${weather.locationName}` : undefined}
          />
        </main>
      </div>
    </div>
  );
};

export default App;

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import logoImg from './assets/logo.png'; 

// 1. All Icons imported correctly
import {
  FaSearch,
  FaMapMarkerAlt,
  FaTint,
  FaWind,
  FaTrash,
  FaCompressArrowsAlt,
  FaHeart,
  FaRegHeart,
  FaCalendarAlt,
  FaCity,
  FaCloudSun,
} from "react-icons/fa";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("C"); 

  // Backend URL
  const BACKEND_URL = "https://neural-weather-app.onrender.com";

  const defaultCities = ["New York", "London", "Tokyo", "Paris"];

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/favorites`);
      setFavorites(res.data);
    } catch (err) {
      console.error("Error loading favorites");
    }
  };

  const getWeather = async (cityName) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/weather/${cityName}`);
      setWeather(res.data);
      setCity("");
    } catch (err) {
      alert("City not found");
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async () => {
    if (!weather) return;
    if (favorites.some((fav) => fav.name === weather.name)) {
      alert("Already in favorites!");
      return;
    }
    await axios.post(`${BACKEND_URL}/favorites`, { name: weather.name });
    fetchFavorites();
  };

  const removeFavorite = async (id, e) => {
    e.stopPropagation();
    await axios.delete(`${BACKEND_URL}/favorites/${id}`);
    fetchFavorites();
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  // Helper: Convert Temp based on Unit
  const getTemp = (tempInC) => {
    if (unit === "C") return Math.round(tempInC);
    return Math.round((tempInC * 9) / 5 + 32);
  };

  // Helper: Dynamic Weather Image
  const getWeatherIcon = (main, description) => {
    const mainLower = main.toLowerCase();
    const descLower = description.toLowerCase();

    if (mainLower === "thunderstorm")
      return "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Cloud%20with%20Lightning%20and%20Rain.png";
    if (mainLower === "drizzle" || (mainLower === "rain" && descLower.includes("light")))
      return "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Cloud%20with%20Rain.png";
    if (mainLower === "rain")
      return "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Cloud%20with%20Rain.png";
    if (mainLower === "snow")
      return "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Snowflake.png";
    if (mainLower === "clear")
      return "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Sun.png";
    if (mainLower === "clouds") {
      if (descLower.includes("few") || descLower.includes("scattered"))
        return "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Sun%20Behind%20Cloud.png";
      return "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Cloud.png";
    }
    return "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Fog.png";
  };

  const today = format(new Date(), "EEEE, d MMMM Y");
  const isSaved = weather
    ? favorites.some((fav) => fav.name === weather.name)
    : false;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-4 flex flex-col items-center font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-6xl space-y-4 relative z-10">
        
        {/* 1. HEADER BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center py-2 px-6 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-xl">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img 
                src={logoImg} 
                alt="NeuralWeather Logo" 
                className="h-14 w-auto drop-shadow-lg animate-pulse-slow object-contain" 
              />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 tracking-tight filter drop-shadow-lg">
                NeuralWeather
              </h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full border border-white/5 text-sm text-slate-300 backdrop-blur-md">
            <FaCalendarAlt className="text-blue-400" /> {today}
          </div>
          <div className="relative w-full md:w-72 mt-2 md:mt-0">
            <input
              type="text"
              placeholder="Search city..."
              className="w-full h-10 pl-5 pr-12 rounded-2xl bg-black/20 border border-white/10 focus:border-blue-400/50 focus:bg-black/40 transition-all outline-none text-slate-200 placeholder-slate-500 backdrop-blur-sm text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && getWeather(city)}
            />
            <button
              onClick={() => getWeather(city)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-blue-500 text-white rounded-xl transition-all border border-white/5"
            >
              <FaSearch className="text-xs" />
            </button>
          </div>
        </div>

        {/* 2. MAIN CONTENT GRID */}
        {/* 'items-stretch' makes both columns equal height by default */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          
          {/* LEFT COLUMN: Main Card + Default Cities */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* A) COMPACT Main Weather Card */}
            {weather ? (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/10 shadow-2xl relative overflow-hidden flex-1">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                {/* Name & Save */}
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h2 className="text-4xl font-bold text-white flex items-center gap-3 drop-shadow-md">
                      <FaMapMarkerAlt className="text-blue-400" />{" "}
                      {weather.name}
                    </h2>
                    <p className="text-lg text-blue-200/70 font-light capitalize tracking-wide">
                      {weather.weather[0].description}
                    </p>
                  </div>

                  <button
                    onClick={addToFavorites}
                    disabled={isSaved}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-lg border backdrop-blur-md ${
                      isSaved
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 cursor-default"
                        : "bg-white/10 border-white/10 hover:bg-white/20 text-white hover:border-white/30 active:scale-95"
                    }`}
                  >
                    {isSaved ? <FaHeart className="text-emerald-400" /> : <FaRegHeart />}
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </div>

                {/* BIG TEMP & DYNAMIC IMAGE */}
                <div className="flex flex-col md:flex-row items-center justify-center my-4 gap-6 relative z-10">
                  <img
                    src={getWeatherIcon(
                      weather.weather[0].main,
                      weather.weather[0].description
                    )}
                    alt="weather condition"
                    className="w-40 h-40 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-[6rem] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-2xl">
                      {getTemp(weather.main.temp)}°
                    </span>
                    
                    <div className="bg-white/10 p-1 rounded-full flex items-center gap-1 border border-white/10 mt-0">
                        <button 
                            onClick={() => setUnit('C')}
                            className={`px-3 py-0.5 rounded-full text-xs font-bold transition-all ${unit === 'C' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            °C
                        </button>
                        <button 
                            onClick={() => setUnit('F')}
                            className={`px-3 py-0.5 rounded-full text-xs font-bold transition-all ${unit === 'F' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            °F
                        </button>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 relative z-10">
                  <MetricCard
                    icon={<FaTint className="text-blue-300" />}
                    label="Humidity"
                    value={`${weather.main.humidity}%`}
                  />
                  <MetricCard
                    icon={<FaWind className="text-teal-300" />}
                    label="Wind"
                    value={`${weather.wind.speed} m/s`}
                  />
                  <MetricCard
                    icon={<FaCompressArrowsAlt className="text-amber-300" />}
                    label="Pressure"
                    value={`${weather.main.pressure} hPa`}
                  />
                </div>
              </div>
            ) : (
              <div className="h-[400px] bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 flex flex-col items-center justify-center text-slate-400">
                <FaCity className="text-6xl mb-4 opacity-30 animate-pulse" />
                <p className="text-lg font-light">
                  Search a city to analyze weather data
                </p>
              </div>
            )}

            {/* B) Default Locations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {defaultCities.map((city) => (
                <div
                  key={city}
                  onClick={() => getWeather(city)}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-400/30 backdrop-blur-md p-3 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 group h-full"
                >
                  <div className="p-1.5 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                    <FaCloudSun className="text-blue-400 text-lg" />
                  </div>
                  <span className="font-medium text-slate-300 group-hover:text-white text-sm">
                    {city}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Favorites Sidebar */}
          {/* h-full ensures it matches the height of the left column */}
          <div className="lg:col-span-1 h-full flex flex-col">
              <div className="h-full bg-white/5 backdrop-blur-2xl rounded-[2rem] p-5 border border-white/10 flex flex-col shadow-2xl relative overflow-hidden">
                {/* Header (Fixed) */}
                <div className="flex items-center gap-3 mb-4 px-1 relative z-10 flex-shrink-0">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300 border border-blue-500/20">
                    <FaHeart />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    Saved Locations
                  </h3>
                  <span className="ml-auto text-xs font-bold bg-white/10 px-2 py-1 rounded-full text-slate-300 border border-white/5">
                    {favorites.length}
                  </span>
                </div>

                {/* List (Scrollable) */}
                {/* min-h-0 is the magic key here! It allows flex child to scroll properly */}
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2 relative z-10 min-h-0">
                  {favorites.length === 0 ? (
                    <div className="text-center mt-10 p-6 bg-white/5 rounded-2xl border border-dashed border-white/10">
                      <p className="text-xs text-slate-400">
                        Your favorite cities will appear here.
                      </p>
                    </div>
                  ) : (
                    favorites.map((fav) => (
                      <div
                        key={fav._id}
                        onClick={() => getWeather(fav.name)}
                        className="group relative p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between backdrop-blur-sm shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                          <span className="font-semibold text-slate-200 group-hover:text-white transition-colors text-sm">
                            {fav.name}
                          </span>
                        </div>

                        <button
                          onClick={(e) => removeFavorite(fav._id, e)}
                          className="p-1.5 text-slate-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"
                          title="Remove"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors group shadow-inner">
      <div className="text-xl mb-1 group-hover:scale-110 transition-transform drop-shadow-sm">
        {icon}
      </div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5 font-medium">
        {label}
      </div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  );
}

export default App;
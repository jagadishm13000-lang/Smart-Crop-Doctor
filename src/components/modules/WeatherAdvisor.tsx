import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CloudSun, Wind, Droplets, Thermometer, 
  Sun, CloudRain, AlertTriangle, Info,
  Navigation, RefreshCw, X, Zap, Leaf,
  TrendingUp, Calendar, MapPin, Search
} from "lucide-react";

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  uvIndex: number;
  condition: string;
  location: string;
  country: string;
  region: string;
  lastUpdated: string;
  weatherCode: number;
  hourlyTemps: number[];
}

interface CropRecommendation {
  name: string;
  score: number; // 0-100
  reason: string;
  difficulty: "Easy" | "Moderate" | "Advanced";
  water: "Low" | "Medium" | "High";
  compatibility: string;
}

const CROP_METADATA: Record<string, { 
  desc: string, 
  idealTemp: [number, number], 
  idealHumidity: [number, number],
  water: "Low" | "Medium" | "High",
  difficulty: "Easy" | "Moderate" | "Advanced"
}> = {
  "Ragi": {
    desc: "Highly drought-resistant staple crop perfectly adapted to semi-arid regions and moderate rainfall.",
    idealTemp: [20, 32],
    idealHumidity: [40, 70],
    water: "Low",
    difficulty: "Easy"
  },
  "Tomato": {
    desc: "Thrives in mild temperatures with balanced humidity. requires consistent but controlled moisture.",
    idealTemp: [18, 28],
    idealHumidity: [50, 70],
    water: "Medium",
    difficulty: "Moderate"
  },
  "Sugarcane": {
    desc: "Commercial giant requiring warm temperatures and abundant water availability throughout its long growth cycle.",
    idealTemp: [24, 35],
    idealHumidity: [60, 85],
    water: "High",
    difficulty: "Moderate"
  },
  "Paddy": {
    desc: "Water-intensive cereal that performs best in high-moisture environments and tropical warmth.",
    idealTemp: [22, 35],
    idealHumidity: [70, 90],
    water: "High",
    difficulty: "Moderate"
  },
  "Groundnut": {
    desc: "Well-suited for dry conditions and well-drained soils, common in semi-arid plains and drought-prone regions.",
    idealTemp: [22, 32],
    idealHumidity: [40, 60],
    water: "Low",
    difficulty: "Moderate"
  },
  "Banana": {
    desc: "Tropical fruit crop requiring constant warmth, high humidity, and steady moisture for optimal yield.",
    idealTemp: [24, 32],
    idealHumidity: [70, 85],
    water: "High",
    difficulty: "Moderate"
  },
  "Coffee": {
    desc: "Shade-loving plantation crop thriving in the cooler, high-altitude climates and high-precision moisture zones.",
    idealTemp: [15, 25],
    idealHumidity: [60, 80],
    water: "Medium",
    difficulty: "Advanced"
  },
  "Sunflowers": {
    desc: "Fast-growing oilseed that responds well to bright sunlight and moderate rainfall patterns.",
    idealTemp: [20, 30],
    idealHumidity: [40, 70],
    water: "Medium",
    difficulty: "Easy"
  },
  "Coconut": {
    desc: "Perennial giant suitable for coastal and well-irrigated inland regions with consistent warmth.",
    idealTemp: [22, 33],
    idealHumidity: [60, 90],
    water: "High",
    difficulty: "Easy"
  },
  "Beans": {
    desc: "Quick-growing pulse that prefers cooler temperatures and moderate moisture levels.",
    idealTemp: [15, 25],
    idealHumidity: [50, 70],
    water: "Medium",
    difficulty: "Easy"
  },
  "Carrot": {
    desc: "Cool-season root vegetable that thrives in loose, well-drained soils and moderate temperatures.",
    idealTemp: [12, 22],
    idealHumidity: [50, 75],
    water: "Medium",
    difficulty: "Moderate"
  },
  "Rose": {
    desc: "Delicate floriculture crop requiring specific temperature ranges and high-precision irrigation.",
    idealTemp: [15, 28],
    idealHumidity: [60, 75],
    water: "Medium",
    difficulty: "Advanced"
  },
  "Millets": {
    desc: "The ultimate climate-resilient crop for semi-dry terrains with extremely low water requirements.",
    idealTemp: [22, 35],
    idealHumidity: [30, 60],
    water: "Low",
    difficulty: "Easy"
  },
  "Pomegranate": {
    desc: "High-value fruit crop well-adapted to dry, hot climates with controlled irrigation systems.",
    idealTemp: [20, 35],
    idealHumidity: [30, 50],
    water: "Low",
    difficulty: "Moderate"
  },
  "Wheat": {
    desc: "A globally essential cereal that performs best in temperate climates with manageable winters and consistent moderate rainfall.",
    idealTemp: [12, 24],
    idealHumidity: [40, 60],
    water: "Medium",
    difficulty: "Moderate"
  },
  "Barley": {
    desc: "Highly versatile grain often grown in cooler temperate zones; essential for brewing and animal feed.",
    idealTemp: [10, 22],
    idealHumidity: [40, 60],
    water: "Medium",
    difficulty: "Easy"
  },
  "Grapes": {
    desc: "The backbone of viticulture, requiring seasonal cycles and well-drained slopes, famously compatible with European and Mediterranean terroirs.",
    idealTemp: [15, 30],
    idealHumidity: [40, 70],
    water: "Medium",
    difficulty: "Advanced"
  },
  "Apples": {
    desc: "Classic temperate fruit that requires winter chilling periods followed by mild summers to develop optimal sweetness.",
    idealTemp: [10, 25],
    idealHumidity: [50, 75],
    water: "Medium",
    difficulty: "Moderate"
  },
  "Sugar Beet": {
    desc: "Root crop grown widely in temperate zones as a primary sugar source, favoring deep soils and moderate temperate sunshine.",
    idealTemp: [15, 25],
    idealHumidity: [50, 70],
    water: "Medium",
    difficulty: "Moderate"
  },
  "Mango": {
    desc: "The king of tropical fruits, demanding high heat and a distinct dry season for flowering and fruit set.",
    idealTemp: [24, 35],
    idealHumidity: [50, 80],
    water: "Medium",
    difficulty: "Moderate"
  },
  "Coffee (Arabica)": {
    desc: "High-altitude specialty crop requiring cooler tropical temperatures and volcanic or high-precision soils.",
    idealTemp: [15, 24],
    idealHumidity: [60, 85],
    water: "High",
    difficulty: "Advanced"
  },
  "Areca Nut": {
    desc: "Traditional palm crop of humid tropical regions, thriving in heavy rainfall and high-moisture corridors.",
    idealTemp: [22, 33],
    idealHumidity: [70, 95],
    water: "High",
    difficulty: "Moderate"
  },
  "Cotton": {
    desc: "Industrial fiber crop that thrives in warm climates with alternating rain and long dry periods for boll development.",
    idealTemp: [22, 35],
    idealHumidity: [40, 70],
    water: "Medium",
    difficulty: "Advanced"
  },
  "Rice": {
    desc: "Foundation of tropical diets, requiring semi-aquatic fields or consistent high-moisture agricultural zones.",
    idealTemp: [22, 35],
    idealHumidity: [70, 95],
    water: "High",
    difficulty: "Moderate"
  }
};

const CITY_CROP_MAPPING: Record<string, string[]> = {
  "Bangalore": ["Tomato", "Beans", "Carrot", "Rose", "Cabbage"],
  "Bengaluru": ["Tomato", "Beans", "Carrot", "Rose", "Cabbage"],
  "Mysore": ["Sugarcane", "Paddy", "Banana", "Coconut", "Rice"],
  "Mysuru": ["Sugarcane", "Paddy", "Banana", "Coconut", "Rice"],
  "Tumkur": ["Ragi", "Groundnut", "Sunflowers", "Coconut", "Pomegranate", "Millets"],
  "Tumakuru": ["Ragi", "Groundnut", "Sunflowers", "Coconut", "Pomegranate", "Millets"],
  "Mandya": ["Sugarcane", "Rice", "Banana", "Paddy"],
  "Hassan": ["Coffee (Arabica)", "Black Pepper", "Potato", "Ginger"],
  "Mangalore": ["Areca Nut", "Coconut", "Rubber", "Cocoa", "Paddy"],
  "Belgaum": ["Sugarcane", "Tobacco", "Cotton", "Soybean"],
  "Chitradurga": ["Onion", "Pomegranate", "Groundnut", "Ragi"],
  "Kolar": ["Tomato", "Mango", "Mulberry", "Potato"],
  "Paris": ["Wheat", "Sugar Beet", "Grapes", "Apples", "Barley", "Potatoes"],
  "London": ["Barley", "Apples", "Potatoes", "Sugar Beet", "Strawberries"],
  "New York": ["Apples", "Corn", "Potatoes", "Grapes", "Soybeans"],
  "Tokyo": ["Rice", "Soybeans", "Cabbage", "Apples", "Radishes"],
};

const COUNTRY_CROP_MAPPING: Record<string, string[]> = {
  "France": ["Wheat", "Barley", "Grapes", "Sugar Beet", "Apples"],
  "United Kingdom": ["Wheat", "Barley", "Oats", "Potatoes", "Apples"],
  "Germany": ["Wheat", "Barley", "Sugar Beet", "Rye", "Potatoes"],
  "Italy": ["Grapes", "Wheat", "Olives", "Tomatoes", "Corn"],
  "USA": ["Corn", "Soybeans", "Wheat", "Cotton", "Potatoes"],
  "China": ["Rice", "Wheat", "Corn", "Soybeans", "Potatoes"],
  "Japan": ["Rice", "Vegetables", "Apples", "Tea"],
  "Brazil": ["Sugarcane", "Coffee", "Soybeans", "Corn", "Oranges"],
  "India": ["Rice", "Wheat", "Sugarcane", "Cotton", "Groundnut", "Banana"],
};

const CLIMATE_CROP_MAPPING: Record<string, string[]> = {
  "Tropical": ["Rice", "Banana", "Sugarcane", "Coconut", "Mango", "Coffee (Arabica)"],
  "Temperate": ["Wheat", "Barley", "Apples", "Grapes", "Sugar Beet", "Potatoes"],
  "Arid": ["Millets", "Sorghum", "Groundnut", "Pomegranate", "Dates"],
  "Mediterranean": ["Grapes", "Olives", "Wheat", "Citrus", "Figs"],
};

export default function WeatherAdvisor({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"weather" | "crops">("weather");

  useEffect(() => {
    const saved = localStorage.getItem("recent_weather_searches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const saveRecentSearch = (city: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== city.toLowerCase());
      const updated = [city, ...filtered].slice(0, 5);
      localStorage.setItem("recent_weather_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const fetchCityDetails = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const info = await res.json();
      const addr = info.address;
      return {
        city: addr.city || addr.town || addr.village || addr.suburb || "Detected Location",
        country: addr.country || "Unknown",
        region: addr.state || addr.province || addr.region || "Unknown"
      };
    } catch {
      return { city: "Detected Location", country: "Unknown", region: "Unknown" };
    }
  };

  const fetchWeather = async (lat: number, lon: number, cityName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=precipitation_probability_max,uv_index_max&hourly=temperature_2m&timezone=auto`
      );
      const weather = await response.json();
      
      const cityDetails = await fetchCityDetails(lat, lon);
      const realCityName = cityName || cityDetails.city;
      saveRecentSearch(realCityName);
      
      setData({
        temp: weather.current.temperature_2m,
        humidity: weather.current.relative_humidity_2m,
        windSpeed: weather.current.wind_speed_10m,
        rainChance: weather.daily.precipitation_probability_max[0],
        uvIndex: weather.daily.uv_index_max[0],
        weatherCode: weather.current.weather_code,
        hourlyTemps: weather.hourly.temperature_2m.slice(0, 24),
        condition: weather.current.temperature_2m > 25 ? "Sunny" : "Overcast",
        location: realCityName,
        country: cityDetails.country,
        region: cityDetails.region,
        lastUpdated: new Date().toLocaleTimeString()
      });
      setLoading(false);
    } catch (err) {
      setError("Satellite link lost. Could not fetch weather telemetry.");
      setLoading(false);
    }
  };

  const getWeightSuitability = (crop: string, data: WeatherData) => {
    const meta = CROP_METADATA[crop];
    if (!meta) return 70;

    let score = 95; // Base score
    
    // Temperature delta penalty
    if (data.temp < meta.idealTemp[0]) score -= (meta.idealTemp[0] - data.temp) * 3;
    if (data.temp > meta.idealTemp[1]) score -= (data.temp - meta.idealTemp[1]) * 2;
    
    // Humidity delta penalty
    if (data.humidity < meta.idealHumidity[0]) score -= (meta.idealHumidity[0] - data.humidity) * 0.5;
    if (data.humidity > meta.idealHumidity[1]) score -= (data.humidity - meta.idealHumidity[1]) * 0.5;
    
    // Rain chance bonus for moisture lovers
    if (meta.water === "High" && data.rainChance > 50) score += 5;
    if (meta.water === "Low" && data.rainChance > 50) score -= 10;
    
    return Math.min(Math.max(score, 10), 99);
  };

  const getRecommendedCrops = (): CropRecommendation[] => {
    if (!data) return [];
    
    let baseCrops: string[] = [];

    // 1. Check City Mapping
    const matchedCity = Object.keys(CITY_CROP_MAPPING).find(city => 
      data.location.toLowerCase().includes(city.toLowerCase()) || 
      city.toLowerCase().includes(data.location.toLowerCase())
    );
    if (matchedCity) baseCrops = [...CITY_CROP_MAPPING[matchedCity]];

    // 2. Check Country Mapping
    if (baseCrops.length < 3) {
      const matchedCountry = Object.keys(COUNTRY_CROP_MAPPING).find(country => 
        data.country.toLowerCase().includes(country.toLowerCase())
      );
      if (matchedCountry) baseCrops = [...baseCrops, ...COUNTRY_CROP_MAPPING[matchedCountry]];
    }

    // 3. Fallback to Climate Matching
    if (baseCrops.length < 3) {
      let climate = "Temperate";
      if (data.temp > 25 && data.humidity > 60) climate = "Tropical";
      else if (data.temp > 25 && data.humidity < 40) climate = "Arid";
      else if (data.temp > 20 && data.humidity < 50) climate = "Mediterranean";
      
      baseCrops = [...baseCrops, ...CLIMATE_CROP_MAPPING[climate]];
    }
    
    const uniqueCrops = Array.from(new Set(baseCrops));
    
    return uniqueCrops.map(name => {
      const score = getWeightSuitability(name, data);
      const meta = CROP_METADATA[name];
      
      let compatibility = "Excellent";
      if (score < 85) compatibility = "Good";
      if (score < 70) compatibility = "Moderate";
      if (score < 50) compatibility = "Low";

      // Contextual reason generation
      let dynamicReason = meta?.desc || "Locally adapted variety.";
      if (data.country === "France" && name === "Grapes") {
        dynamicReason = "Optimal for French viticulture; thrives in the current seasonal thermal profile.";
      } else if (data.country === "India") {
        if (name === "Ragi") dynamicReason = "Ideal for Indian semi-arid tracts; high drought resistance detected.";
        if (name === "Paddy") dynamicReason = "Traditional monsoon staple; moisture profile supports semi-aquatic growth.";
      } else if (data.temp < 15 && name === "Wheat") {
        dynamicReason = "Temperate winter variety; current cool temperatures support strong vernalization.";
      }

      return { 
        name, 
        score, 
        reason: dynamicReason, 
        difficulty: meta?.difficulty || "Moderate",
        water: meta?.water || "Medium",
        compatibility
      };
    }).sort((a, b) => b.score - a.score).slice(0, 6);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=1&language=en&format=json`);
      const geo = await res.json();
      if (geo.results && geo.results.length > 0) {
        const result = geo.results[0];
        fetchWeather(result.latitude, result.longitude, result.name);
        setShowSearch(false);
      } else {
        setError("Location not found in neural database.");
        setLoading(false);
      }
    } catch {
      setError("Query failed. Check uplink.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(12.9716, 77.5946, "Bangalore") // Default
      );
    } else {
      fetchWeather(12.9716, 77.5946, "Bangalore");
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-auto"
    >
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-4xl glass rounded-[40px] border-white/5 overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.8)]"
      >
        <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <CloudSun size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Climate Intelligence</h2>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={10} className="text-amber-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                    {data?.location || "Scanning..."}
                  </span>
                  <button 
                    onClick={() => setShowSearch(!showSearch)}
                    className="ml-2 text-[9px] font-black text-amber-500/60 uppercase hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <Search size={8} /> Change Location
                  </button>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/5">
            <button 
              onClick={() => setActiveTab("weather")}
              className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === "weather" ? "text-amber-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Meteorological Data
              {activeTab === "weather" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab("crops")}
              className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === "crops" ? "text-amber-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Crop Intelligence
              {activeTab === "crops" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showSearch && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-8 overflow-hidden"
              >
                <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                  <input 
                    type="text" 
                    placeholder="Search Global Database (e.g. Paris, Tokyo, Tumkur)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-700"
                  />
                  <button 
                    type="submit"
                    className="px-8 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-amber-500/10"
                  >
                    Fetch
                  </button>
                </form>
                {recentSearches.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-700 uppercase">Recent:</span>
                    <div className="flex flex-wrap gap-2">
                       {recentSearches.map(city => (
                         <button 
                           key={city}
                           onClick={() => {
                             setSearchQuery(city);
                             handleSearch({ preventDefault: () => {} } as any);
                           }}
                           className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-[9px] font-bold text-slate-400 border border-white/5 transition-all"
                         >
                           {city}
                         </button>
                       ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-6">
              <RefreshCw className="text-amber-400 animate-spin" size={40} />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse text-center">
                Establishing Neural Uplink with GNSS Constellation...<br/>
                <span className="text-[8px] text-slate-700 mt-2 block">Acquiring Local Meteorological Matrix</span>
              </p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <AlertTriangle className="text-rose-500 mx-auto mb-6 shadow-[0_0_30px_rgba(244,63,94,0.2)]" size={40} />
              <p className="text-slate-400 font-bold">{error}</p>
              <button 
                onClick={() => setShowSearch(true)}
                className="mt-6 text-xs font-black text-amber-400 uppercase tracking-widest hover:underline"
              >
                Try Manual Coordinate Input
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "weather" ? (
                <motion.div 
                  key="weather"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12"
                >
                  {/* Left: Weather Metrics */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Weather Metric Cards - Keep same as before but slightly styled better */}
                      <div className="glass p-6 rounded-3xl border-white/5 relative group overflow-hidden">
                        <Sun className="absolute -right-4 -bottom-4 text-white/[0.03] w-24 h-24 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                        <div className="flex items-center gap-3 mb-4 text-rose-400">
                          <Thermometer size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Temp</span>
                        </div>
                        <div className="text-3xl font-black text-white italic font-mono">{data?.temp}°C</div>
                      </div>
                      <div className="glass p-6 rounded-3xl border-white/5 relative group overflow-hidden">
                        <Droplets className="absolute -right-4 -bottom-4 text-white/[0.03] w-24 h-24 group-hover:translate-y-2 transition-transform duration-1000" />
                        <div className="flex items-center gap-3 mb-4 text-cyan-400">
                          <Droplets size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hydration</span>
                        </div>
                        <div className="text-3xl font-black text-white italic font-mono">{data?.humidity}%</div>
                      </div>
                      <div className="glass p-6 rounded-3xl border-white/5 relative group overflow-hidden">
                        <CloudRain className="absolute -right-4 -bottom-4 text-white/[0.03] w-24 h-24 group-hover:-translate-x-2 transition-transform duration-1000" />
                        <div className="flex items-center gap-3 mb-4 text-blue-400">
                          <CloudRain size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Precip Prob</span>
                        </div>
                        <div className="text-3xl font-black text-white italic font-mono">{data?.rainChance}%</div>
                      </div>
                      <div className="glass p-6 rounded-3xl border-white/5 relative group overflow-hidden">
                        <Zap className="absolute -right-4 -bottom-4 text-white/[0.02] w-24 h-24 animate-pulse duration-[3000ms]" />
                        <div className="flex items-center gap-3 mb-4 text-amber-400">
                          <Zap size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">UV Matrix</span>
                        </div>
                        <div className="text-3xl font-black text-white italic font-mono">{data?.uvIndex}</div>
                      </div>
                    </div>
                    <div className="p-6 glass rounded-3xl border-white/5 flex items-center justify-between border-l-4 border-l-slate-800">
                       <div className="flex items-center gap-3">
                          <Wind className="text-slate-400 animate-pulse" size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Atmospheric Flow</span>
                       </div>
                       <div className="text-xl font-black text-white italic font-mono">{data?.windSpeed} km/h</div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-[32px] p-6">
                       <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                             <TrendingUp size={14} className="text-amber-400" />
                             <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">24H Node Temperature Matrix</span>
                          </div>
                          <div className="text-[10px] font-mono text-amber-500/40">Real-time Telemetry</div>
                       </div>
                       
                       <div className="h-24 flex items-end gap-1 px-2 mb-4">
                          {data?.hourlyTemps.map((temp, i) => (
                             <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${(temp / 50) * 100}%` }}
                                transition={{ delay: i * 0.02 }}
                                className="flex-1 bg-gradient-to-t from-amber-500/10 to-amber-500/40 rounded-t-sm"
                                title={`${temp}°C`}
                             />
                          ))}
                       </div>

                       <div className="flex items-center gap-3 py-4 border-t border-white/5">
                          <Calendar size={14} className="text-amber-400" />
                          <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">Sowing Window Analysis</span>
                       </div>
                       <p className="text-xs font-bold text-slate-400 leading-relaxed">
                          {data?.rainChance > 40 
                            ? "Neural analysis indicates high soil moisture saturation. Optimal window for rice and moisture-heavy varieties. Ensure drainage channels are clear." 
                            : "Low precipitation matrix detected. Focus on drought-resistant sowing or verify subsurface irrigation line integrity."}
                       </p>
                    </div>
                  </div>

                  {/* Right: AI Farming Insights */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                      <TrendingUp className="text-amber-400" size={16} /> Regional Climate Summary
                    </h3>
                    
                    <div className="p-10 glass rounded-[40px] border-white/5 flex flex-col items-center text-center">
                       <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-400 mb-6">
                          <CloudSun size={32} />
                       </div>
                       <p className="text-sm font-bold text-slate-300 leading-relaxed italic mb-4">
                          “The detected atmospheric matrix in {data?.location} shows a {data?.temp > 28 ? 'warm' : 'mild'} thermal profile with {data?.humidity > 70 ? 'saturated' : 'balanced'} ionic moisture levels.”
                       </p>
                       <div className="flex gap-4">
                          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20">
                             {data?.condition} Matrix
                          </span>
                       </div>
                    </div>

                    <div className="mt-8 p-6 glass rounded-2xl border-white/5 opacity-50 italic">
                      <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                        Neural Uplink synchronized with {data?.location} weather node. 
                        Smart Crop Doctor recommends switching to the 'Crop Intelligence' tab for varietal suitability mapping.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="crops"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Best Crops for Current Climate</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Detailed Suitability Analysis for {data?.location}</p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                       <span className="text-[9px] font-black text-emerald-400 uppercase">Live Recommendation Engine</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {getRecommendedCrops().map((crop, i) => (
                       <motion.div 
                         key={crop.name}
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ delay: i * 0.1 }}
                         className="p-8 glass rounded-[36px] border-white/5 relative group hover:border-amber-500/20 transition-all overflow-hidden"
                       >
                         {/* Progress Meter Background */}
                         <div 
                           className="absolute top-0 left-0 bottom-0 bg-amber-500/[0.03] transition-all duration-1000"
                           style={{ width: `${crop.score}%` }}
                         />
                         
                         <div className="relative flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-2xl text-amber-400 group-hover:scale-110 transition-transform">
                                  <Leaf size={24} />
                               </div>
                               <div>
                                  <h4 className="text-xl font-black text-white tracking-tight">{crop.name}</h4>
                                  <div className="flex gap-2 mt-1">
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                      crop.difficulty === 'Easy' ? 'text-emerald-400 border-emerald-500/20' : 
                                      crop.difficulty === 'Moderate' ? 'text-amber-400 border-amber-500/20' : 
                                      'text-rose-400 border-rose-500/20'
                                    }`}>
                                      {crop.difficulty}
                                    </span>
                                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-white/10 text-slate-500">
                                      Water: {crop.water}
                                    </span>
                                  </div>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="text-2xl font-black text-amber-400 font-mono">{crop.score}%</div>
                               <div className={`text-[8px] font-black uppercase tracking-widest ${
                                 crop.compatibility === 'Excellent' ? 'text-emerald-400' :
                                 crop.compatibility === 'Good' ? 'text-amber-400' :
                                 'text-slate-500'
                               }`}>{crop.compatibility}</div>
                            </div>
                         </div>

                         <p className="text-sm font-bold text-slate-400 leading-relaxed mb-6 relative">
                            {crop.reason}
                         </p>

                         <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${crop.score}%` }}
                              transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                              className="absolute top-0 left-0 bottom-0 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                            />
                         </div>
                       </motion.div>
                     ))}
                  </div>

                  <div className="bg-slate-900/40 p-8 rounded-[40px] border border-white/5 flex flex-col md:flex-row items-center gap-8">
                     <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-400 border border-amber-500/10 flex-shrink-0">
                        <TrendingUp size={32} />
                     </div>
                     <div className="flex-1 text-center md:text-left">
                        <h5 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">Regional Agronomy Insights</h5>
                        <p className="text-sm font-bold text-slate-400 leading-relaxed max-w-2xl">
                          Suitability scores are calculated by cross-referencing your real-time node data ({data?.temp}°C / {data?.humidity}% RH) with {data?.country} agricultural patterns. 
                          The detected climate in {data?.region} suggests a profile optimized for {getRecommendedCrops()[0]?.name} cultivation.
                        </p>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {!loading && !error && (
             <div className="mt-12 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest border-t border-white/5 pt-8">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                      Satellite Lat: {searchQuery || "Auto"}
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
                      Data Source: Open-Meteo
                   </div>
                </div>
                <div>Sync Protocol v4.2 // {data?.lastUpdated}</div>
             </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

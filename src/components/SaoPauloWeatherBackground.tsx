import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Cloud, CloudRain, CloudLightning, Moon, CloudSun, MapPin, Thermometer, Wind } from 'lucide-react';

export interface WeatherData {
  temp: number;
  isDay: boolean;
  weatherCode: number;
  conditionKey: 'sunny' | 'partly_cloudy' | 'cloudy' | 'drizzle' | 'rain' | 'thunderstorm' | 'clear_night' | 'cold_night' | 'fog';
  label: string;
  description: string;
}

export const SaoPauloWeatherBackground: React.FC<{
  onWeatherDataFetched?: (data: WeatherData) => void;
  children?: React.ReactNode;
}> = ({ onWeatherDataFetched }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSPWeather() {
      try {
        // Open-Meteo API for São Paulo (Lat: -23.5505, Lon: -46.6333)
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m'
        );
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        const current = data.current || {};
        const temp = Math.round(current.temperature_2m ?? 22);
        const isDay = current.is_day !== 0;
        const code = current.weather_code ?? 0;

        let conditionKey: WeatherData['conditionKey'] = 'sunny';
        let label = 'Ensolarado';
        let description = 'Céu aberto na capital paulista';

        if (!isDay) {
          if (temp <= 17) {
            conditionKey = 'cold_night';
            label = 'Noite Fria';
            description = 'Noite fresca na capital paulista';
          } else {
            conditionKey = 'clear_night';
            label = 'Noite Estrelada';
            description = 'Céu limpo e estrelado em São Paulo';
          }
        }

        if (code === 0) {
          if (isDay) {
            conditionKey = 'sunny';
            label = 'Céu Limpo';
            description = 'Dia de sol em São Paulo';
          }
        } else if (code >= 1 && code <= 2) {
          conditionKey = 'partly_cloudy';
          label = isDay ? 'Poucas Nuvens' : 'Noite com Nuvens';
          description = 'Nuvens suaves sobre São Paulo';
        } else if (code === 3) {
          conditionKey = 'cloudy';
          label = 'Tempo Nublado';
          description = 'Céu encoberto na capital';
        } else if (code >= 45 && code <= 48) {
          conditionKey = 'fog';
          label = 'Névoa / Nevoeiro';
          description = 'Névoa matinal em São Paulo';
        } else if (code >= 51 && code <= 57) {
          conditionKey = 'drizzle';
          label = 'Garoa Paulistana';
          description = 'Garoa típica de São Paulo';
        } else if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
          conditionKey = 'rain';
          label = 'Dia Chuvoso';
          description = 'Chuva na cidade de São Paulo';
        } else if (code >= 95) {
          conditionKey = 'thunderstorm';
          label = 'Tempestade';
          description = 'Chuva forte com trovoadas em SP';
        }

        const weatherResult: WeatherData = {
          temp,
          isDay,
          weatherCode: code,
          conditionKey,
          label,
          description,
        };

        if (isMounted) {
          setWeather(weatherResult);
          setLoading(false);
          if (onWeatherDataFetched) onWeatherDataFetched(weatherResult);
        }
      } catch (err) {
        // Fallback based on current local hour in SP
        const currentHour = new Date().getHours();
        const isDaytime = currentHour >= 6 && currentHour < 18;
        const fallback: WeatherData = {
          temp: 22,
          isDay: isDaytime,
          weatherCode: 1,
          conditionKey: isDaytime ? 'sunny' : 'clear_night',
          label: isDaytime ? 'Céu Limpo' : 'Noite Estrelada',
          description: 'Tempo agradável em São Paulo',
        };
        if (isMounted) {
          setWeather(fallback);
          setLoading(false);
          if (onWeatherDataFetched) onWeatherDataFetched(fallback);
        }
      }
    }

    fetchSPWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  // Background styling mapping per weather condition
  const getBackgroundStyle = () => {
    if (!weather) {
      return 'bg-gradient-to-br from-amber-200 via-sky-200 to-indigo-200';
    }

    switch (weather.conditionKey) {
      case 'sunny':
        return 'bg-gradient-to-br from-amber-300 via-sky-300 to-blue-400';
      case 'partly_cloudy':
        return 'bg-gradient-to-br from-sky-300 via-indigo-200 to-amber-200';
      case 'cloudy':
        return 'bg-gradient-to-br from-slate-400 via-blue-300 to-slate-500';
      case 'drizzle':
        return 'bg-gradient-to-br from-teal-500 via-slate-400 to-blue-500';
      case 'rain':
        return 'bg-gradient-to-br from-slate-700 via-blue-600 to-indigo-800';
      case 'thunderstorm':
        return 'bg-gradient-to-br from-purple-900 via-slate-800 to-indigo-950';
      case 'clear_night':
        return 'bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900';
      case 'cold_night':
        return 'bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900';
      case 'fog':
        return 'bg-gradient-to-br from-slate-300 via-gray-400 to-slate-400';
      default:
        return 'bg-gradient-to-br from-amber-200 via-sky-200 to-indigo-200';
    }
  };

  const getWeatherIcon = () => {
    if (!weather) return <Sun className="w-4 h-4 text-amber-500 animate-spin" />;
    switch (weather.conditionKey) {
      case 'sunny':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'partly_cloudy':
        return <CloudSun className="w-4 h-4 text-amber-600" />;
      case 'cloudy':
      case 'fog':
        return <Cloud className="w-4 h-4 text-slate-600" />;
      case 'drizzle':
      case 'rain':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      case 'thunderstorm':
        return <CloudLightning className="w-4 h-4 text-purple-600 animate-bounce" />;
      case 'clear_night':
      case 'cold_night':
        return <Moon className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className={`fixed inset-0 z-0 transition-all duration-1000 ${getBackgroundStyle()} overflow-hidden`}>
      {/* Blurred Illustration Layer representing São Paulo city weather */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-black/10 pointer-events-none" />

      {/* Decorative Weather Canvas Illustration Art (Sao Paulo Skyline & Atmosphere) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sun Glow / Moon Glow */}
        {weather?.isDay ? (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.8, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-amber-300/40 blur-3xl"
          />
        ) : (
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-8 right-12 w-80 h-80 rounded-full bg-indigo-300/30 blur-3xl"
          />
        )}

        {/* Dynamic Weather Illustration Elements */}
        {/* 1. Clouds for cloudy / partly cloudy / rain / drizzle / storm */}
        {['cloudy', 'partly_cloudy', 'rain', 'drizzle', 'thunderstorm', 'fog'].includes(
          weather?.conditionKey || ''
        ) && (
          <>
            <motion.div
              animate={{ x: [-50, 150, -50] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-12 left-10 w-72 h-36 bg-white/30 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ x: [100, -100, 100] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-36 right-16 w-96 h-44 bg-slate-200/25 rounded-full blur-2xl"
            />
          </>
        )}

        {/* 2. Rain drops effect for Rain / Drizzle / Thunderstorm */}
        {['rain', 'drizzle', 'thunderstorm'].includes(weather?.conditionKey || '') && (
          <div className="absolute inset-0 opacity-40">
            {[...Array(18)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: `${(i * 6) % 100}%` }}
                animate={{ y: '100vh' }}
                transition={{
                  duration: weather?.conditionKey === 'drizzle' ? 2.5 : 1.2,
                  repeat: Infinity,
                  delay: (i * 0.2) % 2,
                  ease: 'linear',
                }}
                className="absolute w-0.5 h-12 bg-gradient-to-b from-transparent via-cyan-200 to-blue-400 rounded-full"
              />
            ))}
          </div>
        )}

        {/* 3. Stars for Clear Night */}
        {!weather?.isDay && (
          <div className="absolute inset-0 opacity-60">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
                style={{ top: `${(i * 13) % 70}%`, left: `${(i * 17) % 95}%` }}
                className="absolute w-2 h-2 bg-yellow-100 rounded-full blur-xs"
              />
            ))}
          </div>
        )}

        {/* Stylized São Paulo Skyline Silhouette in the distant blur background */}
        <div className="absolute bottom-0 left-0 right-0 h-44 opacity-20 flex items-end justify-between px-4 pointer-events-none blur-sm">
          <div className="w-12 h-32 bg-slate-900 rounded-t-md" />
          <div className="w-16 h-40 bg-slate-800 rounded-t-md" />
          <div className="w-20 h-28 bg-slate-900 rounded-t-lg" />
          <div className="w-10 h-36 bg-slate-800 rounded-t-md" />
          {/* MASP Landmark Silhouette Curve */}
          <div className="w-32 h-20 border-t-8 border-rose-800 bg-slate-900/60 rounded-t-xs" />
          <div className="w-14 h-44 bg-slate-900 rounded-t-md" />
          <div className="w-16 h-30 bg-slate-800 rounded-t-md" />
          <div className="w-10 h-38 bg-slate-900 rounded-t-md" />
        </div>
      </div>

      {/* Floating São Paulo Weather Status Pill on Splash Header */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-amber-200/80 flex items-center gap-2 text-xs font-bold text-slate-800"
        >
          <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>São Paulo:</span>
          <div className="flex items-center gap-1 text-slate-700">
            {getWeatherIcon()}
            <span>{loading ? 'Carregando tempo...' : `${weather?.label} • ${weather?.temp}°C`}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

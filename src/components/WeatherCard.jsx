// @ts-nocheck


/* eslint-disable react/prop-types */

import { get_weather_url } from "../api";
import { useEffect, useState } from "react";
function toTitleCase(str) {
  return str.split(' ')                // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize the first letter and lowercase the rest
    .join(' ');                // Join the array back into a string
}
export default function WeatherCard({ city, removeCity }) {
  const getBackgroundClass = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return "bg-blue-900/50";
    if (weatherId >= 300 && weatherId < 600) return "bg-gray-500/50";
    if (weatherId >= 600 && weatherId < 700) return "bg-blue-200/50";
    if (weatherId === 800) return "bg-yellow-200/50";
    if (weatherId >= 801) return "bg-gray-300/50";
    return "bg-white/30";
  };
  const [weatherData, setWeatherData] = useState(null);
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(get_weather_url(city.value.latitude, city.value.longitude));
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Got the weather data")
        console.log(result)
        setWeatherData(result);
      } catch (err) {
        console.error(err);
      }
    }

    fetchWeatherData();
  }, [city])
  if (!weatherData)
    return (
      <div className="flex justify-center">
        <svg className="animate-spin">
        </svg>
      </div>
    );
  return (
    <div className={`weathercard relative`}>
      <div className={`${getBackgroundClass(weatherData.weather[0].id)} backdrop-blur-lg rounded-lg p-6 shadow-lg max-w-md  text-center m-5`}>
        <button className="absolute top-0 left-0 mt-2 ml-2 w-3 h-3 bg-red-600 rounded-full hover:bg-red-400" onClick={() => {
          removeCity(city)
        }} ></button>
        {/* <div className="absolute top-0 left-5 mt-2 ml-2 w-3 h-3 bg-yellow-400 rounded-full hover:bg-yellow-600"></div> */}
        <h2 className="text-2xl font-semibold text-gray-900">{city.label}</h2>
        <p className="text-lg text-gray-700">{toTitleCase((weatherData.weather[0].description || "Description"))}</p>
        <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon || "10d"}@2x.png`} alt="Weather Icon" className="mx-auto my-4"></img>
        <p className="text-4xl font-bold text-gray-800">{((weatherData.main.temp || 300) - 273).toFixed(2)} C</p>
      </div>
    </div>
  );
}
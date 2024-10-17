/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import Search from "./components/search/Search";
import SearchBetter from "./components/search/SearchBetter";
import WeatherCard from "./components/WeatherCard";

const FallbackComponent = () => (
  <div className="p-4 text-center">
    <h2>No cities saved. Please search for a city.</h2>
  </div>
);

function App() {
  const storedCities = JSON.parse(localStorage.getItem("cities") || "[]")
  const [cities, setCities] = useState(storedCities); // State to store cities
  const [cookies, setCookie] = useCookies(["cities"]); // Use cookies

  // Function to load cities from cookies
  const loadCitiesFromCookies = () => {
    // Check if cities exist in cookies
    setCities(JSON.parse(localStorage.getItem("cities")))
  };

  // Function to handle adding a city
  const handleAddCity = (city) => {
    localStorage.setItem("cities", JSON.stringify([...cities, city]))
    setCities([...cities, city])

  };
  const removeCity = (target) => {
    console.log(`Going to remove ${target.label}`)
    console.log(cities)
    const newCities = cities.filter((city) => {
      return city.label !== target.label
    })
    setCities(newCities)
    console.log(newCities)
    localStorage.setItem("cities", JSON.stringify(newCities))
  }


  return (
    <CookiesProvider>
      <div className="App">
        <div className="flex flex-col min-h-[90vh]">
          <div className="flex-grow">

            <SearchBetter onSearchChange={handleAddCity} onAdd={handleAddCity} />

            {/* Render fallback or cities list */}
            {cities && cities.length === 0 ? (
              <FallbackComponent />
            ) : (
              <div className="p-4 customcontainer">
                {cities && cities.map((city, index) => (
                  <WeatherCard key={index} city={city} removeCity={removeCity} />
                ))}

              </div>
            )}
          </div>


        </div>


      </div>
      <footer className="flex items-center justify-center p-4 bg-gray-800 text-white">
        <span className="text-lg">
          Made with <span className="text-red-500">❤️</span> by{' '}
          <a
            href="https://github.com/SoutrikDas/weatherapp"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-red-400"
          >
            Soutrik
          </a>
        </span>
      </footer>

    </CookiesProvider>
  );
}

export default App;

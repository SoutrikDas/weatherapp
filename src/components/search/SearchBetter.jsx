/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { GEO_API_URL, geoApiOptions } from "../../api";
import React, { useState, useEffect } from "react";

export default function SearchBetter({ onSearchChange, onAdd }) {
  const [searchTerm, setSearchTerm] = useState("");   // For controlled input
  const [debouncedTerm, setDebouncedTerm] = useState("");  // To handle the debounced search term
  const [results, setResults] = useState([]);  // Store fetched results

  const handleAdd = (city) => {
    // add city to cookies.
    console.log(`Adding ${city.label} to cookies`)
    onAdd(city);
    setSearchTerm("");
    setDebouncedTerm("");
    setResults([])
  }
  // Function to handle change in input (runs after 600ms of inactivity)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);  // Update debounced term after 600ms
    }, 600);

    return () => {
      clearTimeout(handler);  // Clear timeout if user types again before 600ms
    };
  }, [searchTerm]);

  // Function to handle search API call based on debouncedTerm
  useEffect(() => {
    if (debouncedTerm) {
      loadOptions(debouncedTerm);
    }
  }, [debouncedTerm]);

  // Simulating an API call with the debounced term
  const loadOptions = async (value) => {
    try {
      const response = await fetch(`${GEO_API_URL}/cities?minPopulation=100000&namePrefix=${value}`, geoApiOptions);
      const result = await response.json();
      // console.log(result);
      setResults(result.data.map((city) => ({
        value: {
          latitude: city.latitude,
          longitude: city.longitude,
        },
        label: `${city.name}, ${city.countryCode}`
      })));
    } catch (error) {
      console.error(error);
    }
  }



  return (
    <div className="relative w-full max-w-md mx-auto mt-10">
      <input
        type="text"
        placeholder="Search for a City"
        value={searchTerm}  // Controlled input
        onChange={(e) => setSearchTerm(e.target.value)}  // Set search term on change
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
      />

      {/* Display results below search bar */}
      {results.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-300 rounded-lg mt-2 z-10 shadow-lg">
          {results.map((result, index) => (
            <li key={index} className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-100 transition-colors">
              <span>{result.label}</span>
              <button
                onClick={() => handleAdd(result)} // Call your add function here
                className="ml-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                +
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

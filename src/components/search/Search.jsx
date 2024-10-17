/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { geoApiOptions, GEO_API_URL } from "../../api";

export default function Search({ onSearchChange }) {
  const [search, setSearch] = useState(null);
  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  }
  const loadOptions = async (value) => {
    try {
      const response = await fetch(`${GEO_API_URL}/cities?minPopulation=100000&namePrefix=${value}`, geoApiOptions);
      const result = await response.json();
      // console.log(result);
      return {
        options: result.data.map((city) => ({
          value: {
            latitude: city.latitude,
            longitude: city.longitude,
          },
          label: `${city.name}, ${city.countryCode}`
        })),
        hasMore: false,

      };
    } catch (error) {
      console.error(error);
    }
  }

  return (
    // @ts-ignore
    <div>
      <AsyncPaginate placeholder="Search for Cities"
        debounceTimeout={600}
        value={search}
        onChange={handleOnChange}
        loadOptions={loadOptions}
      />
      
    </div>
  );
}

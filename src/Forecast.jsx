import React, { useState, useEffect } from "react";
import { useCity } from "./CityContext";
import { weatherIconChange } from "./weatherIconChange";

export const Forecast = () => {
  const [forecast, setForecast] = useState(null);
  const { city } = useCity();

  const fetchForecast = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=a3a03a15b0bafa2ba0a52f19baf4c6fe&units=metric`
      );
      if (!response.ok) throw new Error("Something went wrong");
      const data = await response.json();

      const filteredData = data.list.filter((item) => {
        const date = new Date(item.dt * 1000);
        return date.getUTCHours() === 12;
      });
      setForecast(filteredData);
    } catch (error) {
      console.error("Error fetching weather:", error.message);
    }
  };

  useEffect(() => {
    if (city) {
      fetchForecast(city);
    }
  }, [city]);

  return (
    <>
      <h3>Forecast</h3>
      {forecast ? (
        forecast.map((item, index) => {
          const rawDate = new Date(item.dt * 1000);
          const formattedDate = rawDate.toLocaleDateString();
          const icon = weatherIconChange(item.weather[0].id);

          return (
            <div key={index} className="container3">
              <div className="forecast">
                <div className="day">{formattedDate}</div>
                <div className="forecast_temp">
                  {Math.floor(Math.round(item.main.temp))} °C
                </div>
                <img src={icon} className="tiny_icon" />
                <div>{item.weather[0].main}</div>
              </div>
            </div>
          );
        })
      ) : (
        <div>Loading Forecast Weather...</div>
      )}
    </>
  );
};

export default Forecast;

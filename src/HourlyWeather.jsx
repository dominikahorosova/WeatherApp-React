import React, { useState, useEffect } from "react";
import { useCity } from "./CityContext";
import { weatherIconChange } from "./weatherIconChange";

const HourlyWeather = () => {
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const { city } = useCity();

  const fetchForecast = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=a3a03a15b0bafa2ba0a52f19baf4c6fe&units=metric`
      );
      if (!response.ok) throw new Error("Something went wrong");
      const data = await response.json();

      const today = new Date();
      const todayDate = today.toISOString().split("T")[0];

      const filteredHourlyData = data.list.filter((dataTime) => {
        const forecastDate = dataTime.dt_txt.split(" ")[0];
        return forecastDate === todayDate;
      });

      setHourlyForecast(filteredHourlyData);
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
      <h3>Hourly</h3>
      <div className="container2">
        {hourlyForecast.length > 0 ? (
          hourlyForecast.map((dataTime, index) => {
            const rawDate = new Date(dataTime.dt * 1000);
            const formattedDate = rawDate.toLocaleTimeString();
            const icon = weatherIconChange(dataTime.weather[0].id);

            return (
              <div className="times">
                <div key={index} className="hour">
                  <div className="hour_time">{formattedDate}</div>
                  <img src={icon} className="small_icon" />
                  <div className="hour_temp">
                    {Math.floor(dataTime.main.temp)} °C
                  </div>
                  <div className="description">{dataTime.weather[0].main}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div>Loading hourly forecast...</div>
        )}
      </div>
    </>
  );
};

export default HourlyWeather;

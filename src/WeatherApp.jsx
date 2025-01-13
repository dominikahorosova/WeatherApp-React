import React, { useState, useEffect } from "react";
import Forecast from "./Forecast";
import HourlyWeather from "./HourlyWeather";
import { useCity } from "./CityContext";
import { weatherIconChange } from "./weatherIconChange";

const WeatherApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weather, setWeather] = useState(null);
  const { city, setCity } = useCity();
  const [ icon, setIcon ] = useState("");

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a3a03a15b0bafa2ba0a52f19baf4c6fe&units=metric`
      );
      if (!response.ok) throw new Error("Something went wrong");
      const data = await response.json();
      setWeather(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching weather:", error.message);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [city]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
      setIsDarkMode(true);
    } else {
      document.body.classList.remove("dark-theme");
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (weather?.weather?.[0]?.id) {
      const iconId = weather.weather[0].id;
      setIcon(weatherIconChange(iconId));
    }
  }, [weather]);

  const handleSearch = async () => {
    if (!city) return;
    fetchWeather(city);
    <Forecast />;
    <HourlyWeather/>;
  };

  const changeTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    }
  };

  const sunsetTime = weather
    ? new Date(weather.sys.sunset * 1000).toLocaleTimeString()
    : null;

  const sunriseTime = weather
    ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString()
    : null;

  return (
    <>
      <nav>
        <div>Weather App</div>
        <div className="search">
          <input
            type="text"
            placeholder="Search city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" onClick={handleSearch}>
            <img src="/weather-app-img/search.png" alt="Search icon" />
          </button>
        </div>
        <button className="toggle-button" onClick={changeTheme}>
          {isDarkMode ? "LightMode" : "DarkMode"}
        </button>
      </nav>
      <div className="container">
        <div className="main title grid"></div>
      </div>
      {weather ? (
        <div className="actual grid">
          <div className="actualImage grid card">
            <img src={icon} className="weatherIcon" />
            <div className="title">{weather.name}</div>
            <div>{weather.weather[0].main}</div>
            <div className="main_temp">
              {Math.floor(Math.round(weather.main.temp))} °C
            </div>
          </div>
          <div className="actual_info grid card">
            <div className="title">Feels Like</div>
            <div id="feels">
              {Math.floor(Math.round(weather.main.feels_like))} °C
            </div>
            <div className="title">Humidity</div>
            <div id="humidity">{weather.main.humidity}%</div>
            <div className="title">Wind Speed</div>
            <div id="wind">{weather.wind.speed} km/h</div>
            <div className="title">Visibility</div>
            <div id="visibility">
              {Math.floor(Math.round(weather.visibility / 1000))} %
            </div>
          </div>
          <div className="grid card sunContainer">
            <img src="weather-app-img/sunrise.png" className="sun" />
            <div>{sunriseTime}</div>
            <img src="weather-app-img/sunset.png" className="sun" />
            <div>{sunsetTime}</div>
          </div>
        </div>
      ) : (
        <div>Loading Actual Weather...</div>
      )}
    </>
  );
};

export default WeatherApp;

import React, { useState, useEffect } from "react";
import Forecast from "./Forecast";
import HourlyWeather from "./HourlyWeather";
import { useCity } from "./CityContext";
import { weatherIconChange } from "./weatherIconChange";

const WeatherApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weather, setWeather] = useState(null);
  const { city, setCity } = useCity();
  const [icon, setIcon] = useState("");

  //API
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

  //DarkMode

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    if (
      savedTheme === "dark" ||
      (savedTheme === null && systemTheme === "dark")
    ) {
      document.body.classList.add("dark-theme");
      setIsDarkMode(true);
    } else {
      document.body.classList.remove("dark-theme");
      setIsDarkMode(false);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaQueryChange = (e) => {
      if (!localStorage.getItem("theme")) {
        const systemTheme = e.matches ? "dark" : "light";
        if (systemTheme === "dark") {
          document.body.classList.add("dark-theme");
          setIsDarkMode(true);
        } else {
          document.body.classList.remove("dark-theme");
          setIsDarkMode(false);
        }
      }
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () =>
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  const changeTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  //ICON
  useEffect(() => {
    if (weather?.weather?.[0]?.id) {
      const iconId = weather.weather[0].id;
      setIcon(weatherIconChange(iconId));
    }
  }, [weather]);

  //SEARCH CITY
  const handleSearch = async () => {
    if (!city) return;
    fetchWeather(city);
    <Forecast />;
    <HourlyWeather />;
  };

  //SUNRISE & SUNSET
  const sunsetTime = weather
    ? new Date(weather.sys.sunset * 1000).toLocaleTimeString()
    : null;

  const sunriseTime = weather
    ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString()
    : null;

  return (
    <>
      {/* NAVBAR */}
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
          Change Mode
        </button>
      </nav>
      {/* ACTUAL WEATHER */}
      {weather ? (
        <div className="actual grid">
          <div className="actualImage grid card">
            <img src={icon} className="weatherIcon" />
            <div className="title">{weather.name}</div>
            <div className="description">{weather.weather[0].main}</div>
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

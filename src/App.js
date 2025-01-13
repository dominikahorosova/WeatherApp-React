import "./App.css";
import { CityProvider } from "./CityContext";
import Forecast from "./Forecast";
import WeatherApp from "./WeatherApp";
import HourlyWeather from "./HourlyWeather";

function App() {
  return (
    <>
      <CityProvider>
        <WeatherApp />
        <HourlyWeather/>
        <Forecast/>
      </CityProvider>
    </>
  );
}

export default App;

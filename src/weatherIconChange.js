export function weatherIconChange(icon) {
  if (icon >= 200 && icon <= 232) {
    return "./weather-app-img/drizzle.png";
  } else if (icon >= 300 && icon <= 321) {
    return "./weather-app-img/drizzle.png";
  } else if (icon >= 500 && icon <= 531) {
    return "./weather-app-img/rain.png";
  } else if (icon >= 600 && icon <= 622) {
    return "./weather-app-img/snow.png";
  } else if (icon >= 623 && icon <= 799) {
    return "./weather-app-img/clouds.png";
  } else if (icon === 800) {
    return "./weather-app-img/clear.png";
  } else if (icon >= 801 && icon <= 804) {
    return "./weather-app-img/clouds.png";
  }
}

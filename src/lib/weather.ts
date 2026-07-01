import type {
  ForecastApiResponse,
  GeocodingApiResponse,
  WeatherData,
  WeatherLocation,
} from "../types/weather";

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast";

export async function getLocationByCity(
  city: string,
  signal?: AbortSignal,
): Promise<WeatherLocation> {
  const url = new URL(GEOCODING_API_URL);
  url.searchParams.set("name", city);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Unable to search for that city.");
  }

  const data = (await response.json()) as GeocodingApiResponse;
  const location = data.results?.[0];

  if (!location) {
    throw new Error("City not found. Try a nearby major city.");
  }

  return location;
}

export async function getForecastByLocation(
  location: WeatherLocation,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const url = new URL(FORECAST_API_URL);
  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code",
      "is_day",
    ].join(","),
  );
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Unable to load weather right now.");
  }

  const data = (await response.json()) as ForecastApiResponse;

  return {
    locationName: location.name,
    country: location.country,
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    time: data.current.time,
  };
}

export async function getWeatherByCity(
  city: string,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const location = await getLocationByCity(city, signal);

  return getForecastByLocation(location, signal);
}
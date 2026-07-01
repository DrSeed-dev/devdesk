export type WeatherLocation = {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    admin1?: string;
};

export type WeatherData = {
    locationName: string;
    country: string;
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    isDay: boolean;
    time: string;
};

export type GeocodingApiResponse = {
    results?: WeatherLocation[];
};

export type ForecastApiResponse = {
    current: {
        time: string;
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        weather_code: number;
        is_day: number;
    };
};
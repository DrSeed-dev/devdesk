import { useEffect, useState, type FormEvent } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getWeatherByCity } from "../../lib/weather";
import type { WeatherData } from "../../types/weather";
import Button from "../ui/Button";

const STORAGE_KEY = "devdesk-weather-city";

function getWeatherDescription(code: number) {
    if (code === 0) return "Clear sky";
    if ([1, 2, 3].includes(code)) return "Partly cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
    if ([71, 73, 75, 77].includes(code)) return "Snow";
    if ([80, 81, 82].includes(code)) return "Rain showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";

    return "Weather update";
}

function WeatherWidget() {
    const [city, setCity] = useLocalStorage(STORAGE_KEY, "Lagos");
    const [cityInput, setCityInput] = useState(city);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadWeather() {
            try {
                setIsLoading(true);
                setErrorMessage("");

                const weatherData = await getWeatherByCity(city, controller.signal);
                setWeather(weatherData);
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }

                setWeather(null);
                setErrorMessage(
                    error instanceof Error ? error.message : "Something went wrong.",
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadWeather();

        return () => {
            controller.abort();
        };
    }, [city]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedCity = cityInput.trim();

        if (!trimmedCity) {
            return;
        }

        setCity(trimmedCity);
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={cityInput}
                    onChange={(event) => setCityInput(event.target.value)}
                    placeholder="City"
                    className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-950"
                />

                <Button type="submit">Search</Button>
            </form>

            <div className="mt-5">
                {isLoading ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading weather...
                    </p>
                ) : null}

                {errorMessage ? (
                    <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                        {errorMessage}
                    </p>
                ) : null}

                {weather && !isLoading ? (
                    <div>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {weather.locationName}, {weather.country}
                                </p>

                                <p className="mt-2 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
                                    {Math.round(weather.temperature)}°C
                                </p>
                            </div>

                            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                {weather.isDay ? "Day" : "Night"}
                            </span>
                        </div>

                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                            {getWeatherDescription(weather.weatherCode)}
                        </p>

                        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-950">
                                <p className="font-semibold text-slate-950 dark:text-white">
                                    {Math.round(weather.apparentTemperature)}°C
                                </p>
                                <p className="text-xs text-slate-500">Feels</p>
                            </div>

                            <div className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-950">
                                <p className="font-semibold text-slate-950 dark:text-white">
                                    {weather.humidity}%
                                </p>
                                <p className="text-xs text-slate-500">Humidity</p>
                            </div>

                            <div className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-950">
                                <p className="font-semibold text-slate-950 dark:text-white">
                                    {Math.round(weather.windSpeed)}
                                </p>
                                <p className="text-xs text-slate-500">km/h</p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default WeatherWidget;
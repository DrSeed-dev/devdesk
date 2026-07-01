import { useEffect, useState } from "react";

function formatTime(date: Date) {
    return new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function ClockWidget() {
    const [currentDate, setCurrentDate] = useState(() => new Date());

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <div>
            <p className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
                {formatTime(currentDate)}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {formatDate(currentDate)}
            </p>
        </div>
    );
}

export default ClockWidget;
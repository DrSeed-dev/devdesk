import { useState } from "react";
import Button from "../ui/Button";

type Quote = {
    text: string;
    author: string;
};

const quotes: Quote[] = [
    {
        text: "Programs must be written for people to read, and only incidentally for machines to execute.",
        author: "Harold Abelson",
    },
    {
        text: "Simplicity is the soul of efficiency.",
        author: "Austin Freeman",
    },
    {
        text: "First, solve the problem. Then, write the code.",
        author: "John Johnson",
    },
    {
        text: "The best error message is the one that never shows up.",
        author: "Thomas Fuchs",
    },
];

function getRandomQuote(currentQuote: Quote) {
    const availableQuotes = quotes.filter(
        (quote) => quote.text !== currentQuote.text,
    );

    const randomIndex = Math.floor(Math.random() * availableQuotes.length);

    return availableQuotes[randomIndex];
}

function QuoteWidget() {
    const [quote, setQuote] = useState(() => quotes[0]);

    function handleNewQuote() {
        setQuote((currentQuote) => getRandomQuote(currentQuote));
    }

    return (
        <div className="flex h-full flex-col justify-between gap-5">
            <blockquote>
                <p className="text-base leading-7 text-slate-700 dark:text-slate-200">
                    “{quote.text}”
                </p>

                <footer className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {quote.author}
                </footer>
            </blockquote>

            <Button type="button" onClick={handleNewQuote} className="self-start">
                New quote
            </Button>
        </div>
    );
}

export default QuoteWidget;
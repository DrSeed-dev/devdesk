export type Quote = {
  text: string;
  author: string;
};

export const QUOTES: Quote[] = [
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

export function getRandomQuote(currentQuote: Quote): Quote {
  const availableQuotes = QUOTES.filter(
    (quote) => quote.text !== currentQuote.text,
  );

  const randomIndex = Math.floor(Math.random() * availableQuotes.length);

  return availableQuotes[randomIndex];
}
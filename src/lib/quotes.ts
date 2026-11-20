export type Quote = {
  text: string;
  author: string;
};

export const QUOTES: Quote[] = [
  // Your own quotes. Edit these, replace them, or add more of your own.
  {
    text: "Ship it small, fix it fast, and let every bug teach you something.",
    author: "DrSeed Dev",
  },
  {
    text: "Every expert developer was once a beginner who refused to quit.",
    author: "DrSeed Dev",
  },
  {
    text: "Clean code is a gift to your future self.",
    author: "DrSeed Dev",
  },
  {
    text: "Don't wait until you feel ready. Open the editor and start.",
    author: "DrSeed Dev",
  },
  {
    text: "A project you finish and deploy teaches more than ten you only plan.",
    author: "DrSeed Dev",
  },

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
  {
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
  },
  {
    text: "Premature optimization is the root of all evil.",
    author: "Donald Knuth",
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
  },
  {
    text: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
  },
  {
    text: "Before software can be reusable it first has to be usable.",
    author: "Ralph Johnson",
  },
  {
    text: "Programming isn't about what you know; it's about what you can figure out.",
    author: "Chris Pine",
  },
  {
    text: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.",
    author: "Antoine de Saint-Exupéry",
  },
];

export function getInitialQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export function getRandomQuote(currentQuote: Quote): Quote {
  const availableQuotes = QUOTES.filter(
    (quote) => quote.text !== currentQuote.text,
  );

  const randomIndex = Math.floor(Math.random() * availableQuotes.length);

  return availableQuotes[randomIndex];
}
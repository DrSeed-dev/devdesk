import { useState } from "react";
import { Quote as QuoteIcon, RefreshCw } from "lucide-react";
import { QUOTES, getRandomQuote } from "../../lib/quotes";

function StatusBar() {
  const [quote, setQuote] = useState(() => QUOTES[0]);

  return (
    <footer className="flex h-9 shrink-0 items-center gap-3 border-t border-slate-200 bg-white/80 px-4 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
      <QuoteIcon size={14} className="shrink-0" aria-hidden="true" />

      <p className="min-w-0 truncate">
        “{quote.text}”{" "}
        <span className="text-slate-400 dark:text-slate-500">
          — {quote.author}
        </span>
      </p>

      <button
        type="button"
        onClick={() => setQuote((current) => getRandomQuote(current))}
        className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <RefreshCw size={13} aria-hidden="true" />
        New quote
      </button>
    </footer>
  );
}

export default StatusBar;
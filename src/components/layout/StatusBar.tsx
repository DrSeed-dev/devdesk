import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Pause, Play, Quote as QuoteIcon, RefreshCw } from "lucide-react";
import { getInitialQuote, getRandomQuote, type Quote } from "../../lib/quotes";

// How often the quote changes on its own.
const ROTATE_EVERY_MS = 15000;
// How fast a long quote scrolls. Lower is slower.
const SCROLL_SPEED_PX_PER_SECOND = 45;
// Empty space between the end of a quote and its repeat while scrolling.
const LOOP_GAP_PX = 48;

type QuoteTickerProps = {
  quote: Quote;
  isPaused: boolean;
};

function QuoteTicker({ quote, isPaused }: QuoteTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) {
      return;
    }

    function measure() {
      setContainerWidth(container!.clientWidth);
      setTextWidth(text!.offsetWidth);
    }

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(text);

    return () => observer.disconnect();
  }, [quote]);

  // Only scroll when the quote really doesn't fit. Short quotes stay still.
  const isOverflowing = containerWidth > 0 && textWidth > containerWidth;
  const duration = (textWidth + LOOP_GAP_PX) / SCROLL_SPEED_PX_PER_SECOND;

  const content: ReactNode = (
    <>
      “{quote.text}”{" "}
      <span className="text-slate-400 dark:text-slate-500">
        — {quote.author}
      </span>
    </>
  );

  return (
    <div
      ref={containerRef}
      title={`“${quote.text}” — ${quote.author}`}
      className={`quote-ticker animate-fade-in min-w-0 flex-1 overflow-hidden ${
        isOverflowing ? "quote-ticker-fade" : ""
      }`}
    >
      <div
        className={`flex w-max ${isOverflowing ? "animate-marquee" : ""} ${
          isPaused ? "marquee-paused" : ""
        }`}
        style={
          isOverflowing
            ? ({ "--marquee-duration": `${duration}s` } as CSSProperties)
            : undefined
        }
      >
        <span
          ref={textRef}
          className="whitespace-nowrap"
          style={isOverflowing ? { marginRight: LOOP_GAP_PX } : undefined}
        >
          {content}
        </span>

        {isOverflowing ? (
          <span
            aria-hidden="true"
            className="marquee-duplicate whitespace-nowrap"
            style={{ marginRight: LOOP_GAP_PX }}
          >
            {content}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function StatusBar() {
  const [quote, setQuote] = useState<Quote>(getInitialQuote);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const isPaused = isUserPaused || isHovering;

  // Change the quote every 15 seconds. Picking a new one (by hand or on a
  // timer) restarts the countdown, and nothing changes while paused.
  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setQuote((current) => getRandomQuote(current));
    }, ROTATE_EVERY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isPaused, quote]);

  const PauseIcon = isUserPaused ? Play : Pause;

  return (
    <footer className="flex h-9 shrink-0 items-center gap-3 border-t border-slate-200 bg-white/80 px-4 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
      <QuoteIcon size={14} className="shrink-0" aria-hidden="true" />

      <div
        className="flex min-w-0 flex-1"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <QuoteTicker key={quote.text} quote={quote} isPaused={isPaused} />
      </div>

      <button
        type="button"
        onClick={() => setIsUserPaused((current) => !current)}
        aria-label={isUserPaused ? "Resume quotes" : "Pause quotes"}
        title={isUserPaused ? "Resume quotes" : "Pause quotes"}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <PauseIcon size={13} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => setQuote((current) => getRandomQuote(current))}
        aria-label="Show a new quote"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <RefreshCw size={13} aria-hidden="true" />
        <span className="hidden sm:inline">New quote</span>
      </button>
    </footer>
  );
}

export default StatusBar;
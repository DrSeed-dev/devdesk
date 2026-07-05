type BackgroundItem = {
  text: string;
  top: string;
  left: string;
  rotate: number;
  size: string;
};

// Pulled from the actual DevDesk stack, mixed with plain code syntax.
//
// Deliberately confined to two thin bands — just above the header
// (0-11%) and just below the last card (89-100%) — because the widget
// grid itself spans edge-to-edge at every breakpoint, from single-column
// mobile up through the 3-column desktop layout. Anywhere in between
// those two bands will always be covered by a card eventually, at some
// screen width, so placing text there is fragile by construction.
// Staying in the margins the grid can never reach is what makes this
// safe across every viewport instead of needing per-breakpoint tuning.
const BACKGROUND_ITEMS: BackgroundItem[] = [
  { text: "React", top: "1%", left: "6%", rotate: -8, size: "text-xl" },
  { text: "{ }", top: "3%", left: "26%", rotate: 6, size: "text-2xl" },
  { text: "TypeScript", top: "0%", left: "46%", rotate: 4, size: "text-lg" },
  { text: "=>", top: "5%", left: "66%", rotate: -10, size: "text-2xl" },
  { text: "Next.js", top: "2%", left: "82%", rotate: -5, size: "text-lg" },
  { text: "01", top: "8%", left: "14%", rotate: 12, size: "text-xl" },
  { text: "//", top: "7%", left: "36%", rotate: -8, size: "text-2xl" },
  { text: "Tailwind CSS", top: "9%", left: "56%", rotate: 3, size: "text-base" },
  { text: "</>", top: "6%", left: "74%", rotate: 9, size: "text-xl" },
  { text: "JavaScript", top: "10%", left: "90%", rotate: -4, size: "text-base" },

  { text: "Git", top: "90%", left: "5%", rotate: 7, size: "text-lg" },
  { text: "( )", top: "93%", left: "22%", rotate: -6, size: "text-2xl" },
  { text: "npm", top: "91%", left: "40%", rotate: -5, size: "text-lg" },
  { text: "HTML5", top: "95%", left: "58%", rotate: 6, size: "text-base" },
  { text: "&&", top: "89%", left: "76%", rotate: -14, size: "text-2xl" },
  { text: "GitHub", top: "97%", left: "12%", rotate: 5, size: "text-base" },
  { text: "[ ]", top: "92%", left: "88%", rotate: 9, size: "text-xl" },
  { text: "Vercel", top: "96%", left: "32%", rotate: -7, size: "text-base" },
  { text: ";", top: "94%", left: "68%", rotate: 4, size: "text-2xl" },
  { text: "React", top: "99%", left: "48%", rotate: -9, size: "text-lg" },
];

function CodeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {BACKGROUND_ITEMS.map((item, index) => (
        <span
          key={index}
          className={`absolute whitespace-nowrap font-mono font-bold text-slate-900/[0.07] dark:text-white/[0.09] ${item.size}`}
          style={{
            top: item.top,
            left: item.left,
            transform: `rotate(${item.rotate}deg)`,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}

export default CodeBackground;

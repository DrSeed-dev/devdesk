type BackgroundItem = {
  text: string;
  top: string;
  left: string;
  rotate: number;
  size: string;
};

// Pulled from the actual DevDesk stack, mixed with plain code syntax.
// The panels above this layer are slightly see-through, so these words
// read as a faint texture across the whole desk instead of only in the gaps.
const BACKGROUND_ITEMS: BackgroundItem[] = [
  { text: "React", top: "5%", left: "8%", rotate: -8, size: "text-3xl" },
  { text: "{ }", top: "4%", left: "40%", rotate: 6, size: "text-5xl" },
  { text: "TypeScript", top: "9%", left: "68%", rotate: 5, size: "text-2xl" },
  { text: "=>", top: "17%", left: "22%", rotate: -12, size: "text-4xl" },
  { text: "Next.js", top: "15%", left: "86%", rotate: -6, size: "text-xl" },
  { text: "</>", top: "26%", left: "5%", rotate: 10, size: "text-4xl" },
  { text: "JavaScript", top: "29%", left: "56%", rotate: -4, size: "text-2xl" },
  { text: "01", top: "34%", left: "34%", rotate: 14, size: "text-3xl" },
  { text: "Tailwind CSS", top: "39%", left: "78%", rotate: 4, size: "text-xl" },
  { text: "//", top: "44%", left: "12%", rotate: -10, size: "text-5xl" },
  { text: "Git", top: "48%", left: "48%", rotate: 8, size: "text-2xl" },
  { text: "( )", top: "52%", left: "24%", rotate: -6, size: "text-4xl" },
  { text: "npm", top: "56%", left: "68%", rotate: -5, size: "text-xl" },
  { text: "HTML5", top: "60%", left: "8%", rotate: 6, size: "text-2xl" },
  { text: "&&", top: "64%", left: "42%", rotate: -14, size: "text-4xl" },
  { text: "GitHub", top: "68%", left: "84%", rotate: 5, size: "text-xl" },
  { text: "[ ]", top: "72%", left: "18%", rotate: 9, size: "text-4xl" },
  { text: "Vercel", top: "76%", left: "56%", rotate: -7, size: "text-xl" },
  { text: ";", top: "80%", left: "30%", rotate: 4, size: "text-5xl" },
  { text: "React", top: "84%", left: "74%", rotate: -9, size: "text-2xl" },
  { text: "01", top: "88%", left: "10%", rotate: 12, size: "text-3xl" },
  { text: "{ }", top: "91%", left: "46%", rotate: -5, size: "text-4xl" },
  { text: "TypeScript", top: "22%", left: "46%", rotate: -3, size: "text-xl" },
  { text: "=>", top: "8%", left: "56%", rotate: 15, size: "text-3xl" },
];

function CodeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {BACKGROUND_ITEMS.map((item, index) => (
        <span
          key={index}
          className={`absolute whitespace-nowrap font-mono font-bold text-slate-900/[0.12] dark:text-white/[0.14] ${item.size}`}
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
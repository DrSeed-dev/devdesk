export type PasswordOptions = {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

const CHARACTER_SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
} as const;

// A fair random whole number from 0 to max - 1 using the browser's secure
// random source. Numbers that would make some results likelier are thrown
// away and redrawn, so every character is equally likely.
function randomInt(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);

  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);

  return buffer[0] % max;
}

function activeSets(options: PasswordOptions): string[] {
  return (Object.keys(CHARACTER_SETS) as (keyof typeof CHARACTER_SETS)[])
    .filter((key) => options[key])
    .map((key) => CHARACTER_SETS[key]);
}

export function poolSize(options: PasswordOptions): number {
  return activeSets(options).join("").length;
}

export function estimateEntropyBits(options: PasswordOptions): number {
  const size = poolSize(options);

  return size === 0 ? 0 : Math.round(options.length * Math.log2(size));
}

export function generatePassword(options: PasswordOptions): string | null {
  const sets = activeSets(options);

  if (sets.length === 0) {
    return null;
  }

  const length = Math.max(options.length, sets.length);
  const pool = sets.join("");

  // One character from every chosen group first, so the result always has
  // at least one lowercase, uppercase, number or symbol when asked for.
  const characters = sets.map((set) => set[randomInt(set.length)]);

  while (characters.length < length) {
    characters.push(pool[randomInt(pool.length)]);
  }

  for (let index = characters.length - 1; index > 0; index--) {
    const swapIndex = randomInt(index + 1);
    [characters[index], characters[swapIndex]] = [
      characters[swapIndex],
      characters[index],
    ];
  }

  return characters.join("");
}

export function generateUuids(count: number): string[] {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

export function strengthLabel(bits: number): string {
  if (bits < 40) return "Weak";
  if (bits < 60) return "Fair";
  if (bits < 80) return "Strong";
  return "Very strong";
}

import { base64Decode } from "./encoding";

export type JwtTime = {
  label: string;
  date: Date;
};

export type JwtDecoded = {
  header: unknown;
  payload: unknown;
  hasSignature: boolean;
  times: JwtTime[];
  expiresAt: Date | null;
};

export type JwtResult =
  | { ok: true; value: JwtDecoded }
  | { ok: false; error: string };

function decodePart(part: string, name: string): unknown {
  try {
    return JSON.parse(base64Decode(part));
  } catch {
    throw new Error(`The ${name} isn't valid. Check you copied the whole token.`);
  }
}

function secondsToDate(value: unknown): Date | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const date = new Date(value * 1000);

  return Number.isNaN(date.getTime()) ? null : date;
}

// Decodes a token so you can read it. It does NOT check the signature, so
// it can't tell you the token is genuine, only what it says.
export function decodeJwt(token: string): JwtResult {
  const cleaned = token.trim().replace(/^Bearer\s+/i, "");
  const parts = cleaned.split(".");

  if (parts.length !== 3) {
    return {
      ok: false,
      error: "A JWT has three parts separated by dots: header.payload.signature.",
    };
  }

  try {
    const header = decodePart(parts[0], "header");
    const payload = decodePart(parts[1], "payload");

    const times: JwtTime[] = [];
    let expiresAt: Date | null = null;

    if (payload !== null && typeof payload === "object") {
      const claims = payload as Record<string, unknown>;

      const issued = secondsToDate(claims.iat);
      const notBefore = secondsToDate(claims.nbf);
      expiresAt = secondsToDate(claims.exp);

      if (issued) times.push({ label: "Issued at", date: issued });
      if (notBefore) times.push({ label: "Not valid before", date: notBefore });
      if (expiresAt) times.push({ label: "Expires at", date: expiresAt });
    }

    return {
      ok: true,
      value: {
        header,
        payload,
        hasSignature: parts[2].length > 0,
        times,
        expiresAt,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Couldn't read that token.",
    };
  }
}

export const JWT_SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRyU2VlZCBEZXYiLCJpYXQiOjE3NjM5MDAwMDAsImV4cCI6MTc2MzkwMzYwMH0.c2lnbmF0dXJlLW5vdC12ZXJpZmllZA";

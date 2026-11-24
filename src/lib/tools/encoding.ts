function bytesToBinaryString(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return binary;
}

// Works for any text, including emoji and non-English letters, because the
// text is turned into UTF-8 bytes first.
export function base64Encode(text: string, urlSafe: boolean): string {
  const encoded = btoa(bytesToBinaryString(new TextEncoder().encode(text)));

  return urlSafe
    ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    : encoded;
}

// Accepts normal and URL-safe Base64, with or without the "=" padding.
// Throws if the text isn't valid Base64 or doesn't decode to valid text.
export function base64Decode(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
    throw new Error("That isn't valid Base64.");
  }

  const padded = cleaned + "=".repeat((4 - (cleaned.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error("That decodes to data that isn't plain text.");
  }
}

export function urlEncode(text: string): string {
  return encodeURIComponent(text);
}

export function urlDecode(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    throw new Error("That isn't valid URL-encoded text.");
  }
}

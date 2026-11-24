export type LinkedinResult =
  | { ok: true; url: string; handle: string }
  | { ok: false; error: string };

const ALLOWED_KINDS = ["in", "company", "school", "pub"];

// LinkedIn has no public API for looking up other people, so DevDesk works
// with the link itself: it checks the link really points at LinkedIn, cleans
// off tracking junk, and pulls out a short handle like "in/ada-obi".
export function parseLinkedinUrl(input: string): LinkedinResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { ok: true, url: "", handle: "" };
  }

  // Allow the short form people often paste, like "in/ada-obi".
  const shortForm = /^(in|company|school)\/[^/\s?#]+\/?$/i.test(trimmed);

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : shortForm
      ? `https://www.linkedin.com/${trimmed}`
      : `https://${trimmed.replace(/^\/+/, "")}`;

  let parsed: URL;

  try {
    parsed = new URL(withProtocol);
  } catch {
    return { ok: false, error: "That doesn't look like a link." };
  }

  const host = parsed.hostname.toLowerCase();

  if (host !== "linkedin.com" && !host.endsWith(".linkedin.com")) {
    return { ok: false, error: "Use a linkedin.com profile link." };
  }

  const [kind, slug] = parsed.pathname.split("/").filter(Boolean);

  if (!kind || !slug || !ALLOWED_KINDS.includes(kind.toLowerCase())) {
    return {
      ok: false,
      error: "Use a profile link like linkedin.com/in/your-name.",
    };
  }

  const handle = `${kind.toLowerCase()}/${slug}`;

  return { ok: true, url: `https://www.linkedin.com/${handle}`, handle };
}

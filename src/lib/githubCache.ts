import type { GithubUser } from "../types/github";

const CACHE_KEY = "devdesk-github-cache";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

type CacheEntry = {
  user: GithubUser;
  fetchedAt: number;
};

type Cache = Record<string, CacheEntry>;

function readCache(): Cache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Cache) : {};
  } catch {
    return {};
  }
}

function writeCache(cache: Cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full or unavailable — caching is a nice-to-have, not
    // worth failing the whole lookup over.
  }
}

// Not run through useLocalStorage on purpose: this cache doesn't need
// live cross-component syncing, it's a one-way "last known good result"
// lookup local to this one widget.
export function getCachedGithubUser(
  username: string,
): { user: GithubUser; isFresh: boolean } | null {
  const entry = readCache()[username.toLowerCase()];

  if (!entry) {
    return null;
  }

  return {
    user: entry.user,
    isFresh: Date.now() - entry.fetchedAt < CACHE_TTL_MS,
  };
}

export function setCachedGithubUser(username: string, user: GithubUser) {
  const cache = readCache();
  cache[username.toLowerCase()] = { user, fetchedAt: Date.now() };
  writeCache(cache);
}

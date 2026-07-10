import type { GithubUser } from "../types/github";

const RATE_LIMIT_MESSAGE =
  "GitHub's API rate limit was reached (60 requests/hour without sign-in).";

export async function getGithubUser(
  username: string,
  signal?: AbortSignal,
): Promise<GithubUser> {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}`,
    {
      signal,
      headers: {
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (response.status === 404) {
    throw new Error("GitHub user not found.");
  }

  if (response.status === 403 || response.status === 429) {
    throw new Error(RATE_LIMIT_MESSAGE);
  }

  if (!response.ok) {
    throw new Error("Unable to load GitHub profile.");
  }

  return (await response.json()) as GithubUser;
}

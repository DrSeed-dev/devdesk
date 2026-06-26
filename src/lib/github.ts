import type { GithubUser } from "../types/github";

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

  if (!response.ok) {
    throw new Error("Unable to load GitHub profile.");
  }

  return (await response.json()) as GithubUser;
}
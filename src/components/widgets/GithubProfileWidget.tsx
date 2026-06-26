import { useEffect, useState, type FormEvent } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getGithubUser } from "../../lib/github";
import type { GithubUser } from "../../types/github";

const STORAGE_KEY = "devdesk-github-username";

function GithubProfileWidget() {
  const [username, setUsername] = useLocalStorage(STORAGE_KEY, "octocat");
  const [usernameInput, setUsernameInput] = useState(username);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadGithubUser() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const githubUser = await getGithubUser(username, controller.signal);
        setUser(githubUser);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setUser(null);
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadGithubUser();

    return () => {
      controller.abort();
    };
  }, [username]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUsername = usernameInput.trim();

    if (!trimmedUsername) {
      return;
    }

    setUsername(trimmedUsername);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={usernameInput}
          onChange={(event) => setUsernameInput(event.target.value)}
          placeholder="GitHub username"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-950"
        />

        <button
          type="submit"
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Search
        </button>
      </form>

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading profile...
          </p>
        ) : null}

        {errorMessage ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {errorMessage}
          </p>
        ) : null}

        {user && !isLoading ? (
          <div>
            <div className="flex items-center gap-4">
              <img
                src={user.avatar_url}
                alt={`${user.login} avatar`}
                className="h-16 w-16 rounded-2xl"
              />

              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-950 dark:text-white">
                  {user.name ?? user.login}
                </h3>

                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400"
                >
                  @{user.login}
                </a>
              </div>
            </div>

            {user.bio ? (
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {user.bio}
              </p>
            ) : null}

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-950">
                <p className="font-semibold text-slate-950 dark:text-white">
                  {user.public_repos}
                </p>
                <p className="text-xs text-slate-500">Repos</p>
              </div>

              <div className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-950">
                <p className="font-semibold text-slate-950 dark:text-white">
                  {user.followers}
                </p>
                <p className="text-xs text-slate-500">Followers</p>
              </div>

              <div className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-950">
                <p className="font-semibold text-slate-950 dark:text-white">
                  {user.following}
                </p>
                <p className="text-xs text-slate-500">Following</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default GithubProfileWidget;
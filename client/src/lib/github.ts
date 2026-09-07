/* Camel Editorial Atelier: live GitHub activity stays quiet and factual, using the public API with a soft fallback instead of pretending static activity is current. */

const GITHUB_API = "https://api.github.com";
const GITHUB_LOGIN = "rebeccacamissa";

export type GitHubStatus = "loading" | "ready" | "error";

type GitHubActivitySnapshot = { profile: GitHubProfile; activity: GitHubActivity[]; fetchedAt: number };
const CACHE_KEY = "rebecca-github-activity-v2";
const CACHE_TTL_MS = 10 * 60 * 1000;

export type GitHubProfile = {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
};

export type GitHubActivity = {
  id: string;
  repo: string;
  repoUrl: string;
  message: string;
  sha: string;
  commitUrl: string;
  date: string;
  author: string;
};

type GitHubRepository = {
  full_name: string;
  html_url: string;
  name: string;
  description: string | null;
  pushed_at: string | null;
  default_branch: string;
};

type GitHubCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string | null; date: string | null } | null;
  };
};

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
  });
  if (!response.ok) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = response.headers.get("x-ratelimit-reset");
    const detail = remaining === "0" ? `GitHub rate limit exhausted until ${reset ?? "the next reset"}` : `GitHub returned ${response.status}`;
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

function readCachedSnapshot(allowStale = false): GitHubActivitySnapshot | null {
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const snapshot = JSON.parse(raw) as GitHubActivitySnapshot;
    if (snapshot.profile?.login !== GITHUB_LOGIN || !snapshot.activity?.length) return null;
    return allowStale || Date.now() - snapshot.fetchedAt < CACHE_TTL_MS ? snapshot : null;
  } catch {
    return null;
  }
}

function writeCachedSnapshot(snapshot: GitHubActivitySnapshot) {
  try { window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(snapshot)); } catch { /* Storage may be disabled. */ }
}

export async function fetchGitHubActivity(signal?: AbortSignal) {
  const cached = readCachedSnapshot();
  if (cached) return { profile: cached.profile, activity: cached.activity };

  const requestController = new AbortController();
  const forwardAbort = () => requestController.abort();
  if (signal) {
    if (signal.aborted) requestController.abort();
    else signal.addEventListener("abort", forwardAbort, { once: true });
  }
  const timeout = window.setTimeout(() => requestController.abort(), 9000);
  try {
    const [profile, repositories] = await Promise.all([
      fetchJson<GitHubProfile>(`${GITHUB_API}/users/${GITHUB_LOGIN}`, requestController.signal),
      fetchJson<GitHubRepository[]>(`${GITHUB_API}/users/${GITHUB_LOGIN}/repos?sort=pushed&direction=desc&per_page=10`, requestController.signal),
    ]);

    const activeRepositories = repositories.filter((repository) => repository.pushed_at).slice(0, 6);
    const results = await Promise.allSettled(
      activeRepositories.map(async (repository) => {
        const commits = await fetchJson<GitHubCommit[]>(`${GITHUB_API}/repos/${repository.full_name}/commits?per_page=2`, requestController.signal);
        return commits.map((commit) => ({
          id: `${repository.full_name}-${commit.sha}`,
          repo: repository.name,
          repoUrl: repository.html_url,
          message: commit.commit.message.split("\n")[0].trim(),
          sha: commit.sha.slice(0, 7),
          commitUrl: commit.html_url,
          date: commit.commit.author?.date ?? repository.pushed_at ?? new Date().toISOString(),
          author: commit.commit.author?.name ?? profile.name ?? profile.login,
        } satisfies GitHubActivity));
      }),
    );

    const activity = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
    activity.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
    const snapshot = { profile, activity: activity.slice(0, 10), fetchedAt: Date.now() } satisfies GitHubActivitySnapshot;
    writeCachedSnapshot(snapshot);
    return { profile: snapshot.profile, activity: snapshot.activity };
  } catch (error) {
    const stale = readCachedSnapshot(true);
    if (stale) return { profile: stale.profile, activity: stale.activity };
    throw error;
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener("abort", forwardAbort);
  }
}

export function formatRelativeDate(date: string) {
  const elapsed = Math.max(0, Date.now() - new Date(date).getTime());
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

export { GITHUB_LOGIN };

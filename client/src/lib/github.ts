/* Camel Editorial Atelier: live GitHub activity stays quiet and factual, using the public API with a soft fallback instead of pretending static activity is current. */

const GITHUB_API = "https://api.github.com";
const GITHUB_LOGIN = "rebeccacamissa";

export type GitHubStatus = "loading" | "ready" | "error";

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
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  return response.json() as Promise<T>;
}

export async function fetchGitHubActivity(signal?: AbortSignal) {
  const [profile, repositories] = await Promise.all([
    fetchJson<GitHubProfile>(`${GITHUB_API}/users/${GITHUB_LOGIN}`, signal),
    fetchJson<GitHubRepository[]>(`${GITHUB_API}/users/${GITHUB_LOGIN}/repos?sort=pushed&direction=desc&per_page=10`, signal),
  ]);

  const activeRepositories = repositories.filter((repository) => repository.pushed_at).slice(0, 8);
  const results = await Promise.allSettled(
    activeRepositories.map(async (repository) => {
      const commits = await fetchJson<GitHubCommit[]>(`${GITHUB_API}/repos/${repository.full_name}/commits?per_page=2`, signal);
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

  return { profile, activity: activity.slice(0, 10) };
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

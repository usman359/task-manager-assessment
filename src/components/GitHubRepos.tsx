"use client";

import { useEffect, useState } from "react";

type Repo = {
  id: number;
  name: string;
  url: string;
  description: string | null;
  stars: number;
  language: string | null;
  updatedAt: string;
};

export default function GitHubRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        const res = await fetch("/api/github/repos");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load GitHub repos");
        }
        const data: Repo[] = await res.json();
        if (!cancelled) setRepos(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pb-14">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
        <p className="mb-1 text-sm font-medium tracking-wide text-[var(--accent)]">
          Public API: GitHub
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
          Recent Vercel repositories
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Fetched server-side from the GitHub REST API (
          <code className="text-[var(--foreground)]">/users/vercel/repos</code>
          ), then exposed via{" "}
          <code className="text-[var(--foreground)]">/api/github/repos</code>.
        </p>

        {loading ? (
          <p className="mt-5 text-sm text-[var(--muted)]">Loading repos…</p>
        ) : error ? (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {repos.map((repo) => (
              <li
                key={repo.id}
                className="rounded-xl border border-[var(--border)] px-4 py-3 transition hover:border-[var(--accent-soft)]"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    {repo.name}
                  </a>
                  <span className="text-sm text-[var(--muted)]">
                    ★ {repo.stars}
                    {repo.language ? ` · ${repo.language}` : ""}
                  </span>
                </div>
                {repo.description ? (
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {repo.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

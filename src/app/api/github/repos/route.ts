import { NextResponse } from "next/server";

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
};

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/users/vercel/repos?per_page=5&sort=updated",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "task-manager-assessment",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 300 },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API error (${res.status})` },
        { status: 502 },
      );
    }

    const repos: GitHubRepo[] = await res.json();

    return NextResponse.json(
      repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
        updatedAt: repo.updated_at,
      })),
    );
  } catch (error) {
    console.error("GET /api/github/repos", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub repos" },
      { status: 500 },
    );
  }
}

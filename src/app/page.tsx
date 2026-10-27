import GitHubRepos from "@/components/GitHubRepos";
import TaskApp from "@/components/TaskApp";

export default function Home() {
  return (
    <main className="flex-1">
      <TaskApp />
      <GitHubRepos />
    </main>
  );
}

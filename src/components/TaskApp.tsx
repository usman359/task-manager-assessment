"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { Task } from "@/types/task";

type FormState = {
  title: string;
  description: string;
};

const emptyForm: FormState = { title: "", description: "" };

export default function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to load tasks");
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  function startEdit(task: Task) {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || saving) return;

    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        const res = await fetch(`/api/tasks/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim(),
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to update task");
        }
        const updated: Task = await res.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === updated.id ? updated : task)),
        );
        cancelEdit();
      } else {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim(),
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to create task");
        }
        const created: Task = await res.json();
        setTasks((prev) => [created, ...prev]);
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function toggleCompleted(task: Task) {
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated: Task = await res.json();
      setTasks((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function deleteTask(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((task) => task.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const openCount = tasks.filter((task) => !task.completed).length;
  const doneCount = tasks.length - openCount;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium tracking-wide text-[var(--accent)]">
          Task Manager
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Stay on top of your work
        </h1>
        <p className="mt-2 max-w-lg text-[var(--muted)]">
          Add, edit, complete, and delete tasks. Data is stored in MongoDB Atlas
          via REST APIs.
        </p>
        <div className="mt-4 flex gap-4 text-sm text-[var(--muted)]">
          <span>
            <strong className="text-[var(--foreground)]">{openCount}</strong> open
          </span>
          <span>
            <strong className="text-[var(--foreground)]">{doneCount}</strong> done
          </span>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5"
      >
        <div>
          <label htmlFor="title" className="sr-only">
            Task title
          </label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="What needs doing?"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="sr-only">
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Optional notes"
            rows={2}
            className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving || !form.title.trim()}
            className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving…"
              : editingId
                ? "Save changes"
                : "Add task"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)]"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {error ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="text-center text-[var(--muted)]">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center text-[var(--muted)]">
          No tasks yet. Add your first one above.
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="group flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent-soft)]"
            >
              <button
                type="button"
                onClick={() => void toggleCompleted(task)}
                aria-label={
                  task.completed ? "Mark as incomplete" : "Mark as completed"
                }
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                  task.completed
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border)] hover:border-[var(--accent)]"
                }`}
              >
                {task.completed ? (
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                  </svg>
                ) : null}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={`font-medium leading-snug ${
                    task.completed
                      ? "text-[var(--muted)] line-through"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  {task.title}
                </p>
                {task.description ? (
                  <p
                    className={`mt-1 text-sm ${
                      task.completed
                        ? "text-[var(--muted)] line-through"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {task.description}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <button
                  type="button"
                  onClick={() => startEdit(task)}
                  className="rounded-lg px-2.5 py-1.5 text-sm text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void deleteTask(task.id)}
                  className="rounded-lg px-2.5 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

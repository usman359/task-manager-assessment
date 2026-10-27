import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { serializeTask, Task, type TaskDocument } from "@/models/Task";

export async function GET() {
  try {
    await connectDB();
    const tasks = (await Task.find()
      .sort({ createdAt: -1 })
      .lean()) as TaskDocument[];
    return NextResponse.json(tasks.map(serializeTask));
  } catch (error) {
    console.error("GET /api/tasks", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 },
      );
    }

    const description =
      typeof body.description === "string" ? body.description.trim() : "";

    const task = await Task.create({
      title,
      description,
      completed: Boolean(body.completed),
    });

    return NextResponse.json(
      serializeTask(task.toObject() as TaskDocument),
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/tasks", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}

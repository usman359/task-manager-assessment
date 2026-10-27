import mongoose, { Schema, models, model } from "mongoose";

export type TaskDocument = {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const TaskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Task = models.Task || model("Task", TaskSchema);

export function serializeTask(task: TaskDocument) {
  return {
    id: String(task._id),
    title: task.title,
    description: task.description,
    completed: task.completed,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

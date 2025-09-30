import type { DayOfWeek } from "./common";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  assignedToUserId: number | null;
  dueDay: DayOfWeek;
  priority: "low" | "medium" | "high";
  status: "todo" | "doing" | "done";
}

export type UpdateTaskInput = Partial<{
  title: string;
  description: string | null | undefined;
  dueDay: DayOfWeek;
  priority: "low" | "medium" | "high";
  status: Task["status"];
  assignedToUserId: number | null;
}>;

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  dueDay: DayOfWeek;
  priority: "low" | "medium" | "high";
  status?: "todo" | "doing" | "done";
  assignedToUserId?: number | null;
};

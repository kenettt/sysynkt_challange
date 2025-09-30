import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  BootstrapResponse,
} from "@/types";
import { http } from "./http";

export async function loadBootstrap(): Promise<BootstrapResponse> {
  const data = await http<BootstrapResponse>(`/bootstrap`);

  return {
    users: data.users,
    tasks: data.tasks,
  };
}

export async function getTasks(): Promise<Task[]> {
  const list = await http<Task[]>("/tasks?include=assignedTo");
  return list;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const created = await http<{ data: Task }>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return created.data;
}

export async function updateTask(
  id: number,
  patch: Partial<UpdateTaskInput>
): Promise<Task> {
  const saved = await http<{ data: Task }>(`/tasks/${Number(id)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
  return saved.data;
}

export async function deleteTask(id: number): Promise<void> {
  await http<void>(`/tasks/${Number(id)}`, { method: "DELETE" });
}

export async function setTaskStatus(
  id: string,
  status: "todo" | "doing" | "done"
): Promise<Task> {
  const saved = await http<Task>(`/tasks/${Number(id)}/status`, {
    method: "POST",
    body: JSON.stringify({ status }),
  });
  return saved;
}

export async function claimTask(
  id: string,
  userId: number | null
): Promise<Task> {
  const saved = await http<Task>(`/tasks/${Number(id)}/claim`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  });
  return saved;
}

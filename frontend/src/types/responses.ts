import type { Task, User } from "./index";

export type BootstrapResponse = {
  users: User[];
  tasks: Task[];
};

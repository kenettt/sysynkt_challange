import type { Role } from "./common";

export interface User {
  id: number;
  name: string;
  role: Role;
}

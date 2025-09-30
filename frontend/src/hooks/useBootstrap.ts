import { useEffect, useState } from "react";
import type { Role, Task, User } from "../types/domain";
import { fetchBootstrap } from "../api/api";

export function useBootstrap(role: Role) {
  const [currentUser, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBootstrap(role)
      .then((data) => {
        if (cancelled) return;
        setUser(data.currentUser);
        setTasks(data.tasks);
        setErr(null);
      })
      .catch((e) => !cancelled && setErr(e.message || "Load error"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [role]);

  return { currentUser, tasks, loading, error };
}

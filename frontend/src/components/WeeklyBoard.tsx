import {
  type Task,
  type User,
  type DayOfWeek,
  DAYS_OF_WEEK,
  DAY_LABELS,
} from "@/types";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyBoardProps {
  tasks: Task[];
  users: User[];
  user: User;
  statusLoading: Record<number, boolean>;
  claimLoading: Record<number, boolean>;
  onStatusChange: (taskId: number, status: Task["status"]) => void;
  onClaimTask: (taskId: number, user: User) => void;
  onAddTask: (day: DayOfWeek) => void;
  onUpdateTask: (task: Task) => void;
}

export function WeeklyBoard({
  tasks,
  users,
  user,
  claimLoading,
  statusLoading,
  onUpdateTask,
  onStatusChange,
  onClaimTask,
  onAddTask,
}: WeeklyBoardProps) {
  const getTasksForDay = (day: DayOfWeek): Task[] =>
    tasks.filter((task) => task.dueDay === day);

  const getCompletionStats = (dayTasks: Task[]) => {
    const total = dayTasks.length;
    const completed = dayTasks.filter((t) => t.status === "done").length;
    return {
      total,
      completed,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  };

  const isToday = (day: DayOfWeek) => {
    const today = new Date().getDay(); // 0..6 (Sun..Sat)
    const dayIndex = DAYS_OF_WEEK.indexOf(day); // 0..6 (Mon..Sun)
    const adjustedToday = today === 0 ? 6 : today - 1; // Sun -> 6
    return dayIndex === adjustedToday;
  };

  return (
    <div className="w-full">
      {/* Week header */}
      <div className="mb-6 text-center animate-[fade-in_.25s_ease-out]">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">
          This Week&apos;s Family Tasks
        </h2>
        <p className="text-slate-600">
          Stay organized together • Claim open tasks • Celebrate progress
        </p>
      </div>

      {/* Weekly grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        {DAYS_OF_WEEK.map((day) => {
          const dayTasks = getTasksForDay(day);
          const stats = getCompletionStats(dayTasks);
          const today = isToday(day);

          return (
            <div key={day} className="min-h-[400px]">
              {/* Day header */}
              <Card
                className={cn(
                  "mb-4 p-4 transition-all duration-300 animate-[fade-in_.25s_ease-out]",
                  today
                    ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg ring-1 ring-white/20"
                    : "bg-white text-slate-900 border-slate-200 shadow-sm"
                )}
              >
                <div className="text-center">
                  <h3
                    className={cn(
                      "mb-1 text-lg font-semibold",
                      today ? "text-white" : "text-slate-900"
                    )}
                  >
                    {DAY_LABELS[day]}
                  </h3>

                  <div
                    className={cn(
                      "text-sm",
                      today ? "text-white/80" : "text-slate-600"
                    )}
                  >
                    {stats.total > 0 ? (
                      <span>
                        {stats.completed}/{stats.total} tasks
                        {stats.percentage === 100 && " ✨"}
                      </span>
                    ) : (
                      <span>No tasks</span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {stats.total > 0 && (
                    <div
                      className={cn(
                        "mt-2 h-2 w-full rounded-full",
                        today ? "bg-white/25" : "bg-slate-200"
                      )}
                    >
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          today ? "bg-white" : "bg-blue-500"
                        )}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              </Card>

              {/* Tasks column */}
              <div className="space-y-3">
                {dayTasks.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    claimLoading={!!claimLoading[task.id]}
                    statusLoading={!!statusLoading[task.id]}
                    users={users}
                    onUpdateTask={onUpdateTask}
                    onStatusChange={onStatusChange}
                    onClaimTask={onClaimTask}
                    user={user}
                    className={cn(
                      "transition-transform duration-200 hover:scale-[1.02]",
                      "animate-[rise-in_.25s_ease-out_both]",
                      `[animation-delay:${Math.min(i * 60, 300)}ms]`
                    )}
                  />
                ))}

                {/* Add task button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddTask(day)}
                  className="h-12 w-full border-2 border-dashed border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

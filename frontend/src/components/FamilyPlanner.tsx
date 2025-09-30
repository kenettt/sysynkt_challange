import { useState, useEffect } from "react";
import type {
  Task,
  DayOfWeek,
  User,
  TaskFilter,
  UpdateTaskInput,
} from "@/types";
import { WeeklyBoard } from "./WeeklyBoard";
import { TaskFilters } from "./TaskFilters";
import { AddTaskDialog } from "./AddTaskDialog";
import { UpdateTaskDialog } from "./UpdateTaskDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Home, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { loadBootstrap, createTask, updateTask } from "@/api/api";

type FamilyPlannerProps = {
  user: User;
};

export function FamilyPlanner({ user }: FamilyPlannerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({ type: "all" });
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [updateTaskOpen, setUpdateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("monday");
  const [statusLoading, setStatusLoading] = useState<Record<number, boolean>>(
    {}
  );
  const [claimLoading, setClaimLoading] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { tasks, users } = await loadBootstrap();
        setTasks(tasks);
        setUsers(users);
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filteredTasks = tasks.filter((task) => {
    switch (filter.type) {
      case "mine":
        return task.assignedToUserId === user.id;
      case "open":
        return !task.assignedToUserId;
      default:
        return true;
    }
  });

  const handleStatusChange = async (taskId: number, status: Task["status"]) => {
    setStatusLoading((m) => ({ ...m, [taskId]: true }));
    try {
      const updated = await updateTask(taskId, { status });

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updated : task))
      );

      if (status === "done") {
        toast({
          title: "Task completed! 🎉",
          description: "Great job! One less thing to worry about.",
        });
      }
    } catch (e: any) {
      toast({
        title: "Update failed",
        description: e.message ?? "Could not update task status",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(({ [taskId]: _, ...rest }) => rest);
    }
  };

  const handleClaimTask = async (taskId: number, user: User) => {
    setClaimLoading((m) => ({ ...m, [taskId]: true }));
    try {
      const updated = await updateTask(taskId, { assignedToUserId: user.id });

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updated : task))
      );

      toast({
        title: "Task claimed! 💪",
        description: "Thanks for stepping up! The family appreciates it.",
      });
    } catch (e: any) {
      toast({
        title: "Update failed",
        description: e.message ?? "Could not update claim task",
        variant: "destructive",
      });
    } finally {
      setClaimLoading(({ [taskId]: _, ...rest }) => rest);
    }
  };

  const handleAddTask = async (newTask: Omit<Task, "id">) => {
    const created = await createTask(newTask);
    setTasks((prev) => [...prev, created]);
    toast({
      title: "Task added! ✨",
      description: `Added "${created.title}" to ${created.dueDay}`,
    });
  };

  const handleAddTaskForDay = (day: DayOfWeek) => {
    setSelectedDay(day);
    setAddTaskOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setUpdateTaskOpen(true);
  };

  const handleUpdateTask = async (
    taskId: number,
    editedTask: UpdateTaskInput
  ) => {
    const updated = await updateTask(taskId, editedTask);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    toast({
      title: "Task updated! ✨",
      description: `Updated "${updated.title}"`,
    });
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const getWeekProgress = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "done").length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-linear-to-r from-cyan-500 to-blue-500 p-6 shadow-md text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap space-y-2 space-x-2 sm:space-y-0">
            <div className="flex items-center gap-3 ">
              <div className="p-2 bg-white/20 rounded-lg">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Family Planner</h1>
                <p className="text-white">
                  Organize together • Share the load • Celebrate progress
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 ">
              {/* Week progress */}
              <Card className="p-3 bg-white/10 border-white/20">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    {getWeekProgress()}% complete
                  </span>
                </div>
              </Card>

              {/* Quick add button */}
              <Button
                onClick={() => setAddTaskOpen(true)}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Plus className="h-4 w-4 mr-2 text-white" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading tasks…</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <TaskFilters
          tasks={tasks}
          users={users}
          filter={filter}
          onFilterChange={setFilter}
          user={user}
        />

        {/* Weekly board */}
        <WeeklyBoard
          users={users}
          user={user}
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onClaimTask={handleClaimTask}
          onAddTask={handleAddTaskForDay}
          onUpdateTask={handleEditClick}
          statusLoading={statusLoading}
          claimLoading={claimLoading}
        />

        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <Card className="p-8 text-center mt-6">
            <div className="max-w-md mx-auto">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {filter.type === "mine"
                  ? "You don't have any tasks assigned yet. Check out open tasks or add a new one!"
                  : filter.type === "open"
                  ? "All tasks are assigned! Great teamwork everyone."
                  : "No tasks for this week yet. Add some to get started!"}
              </p>
              <Button onClick={() => setAddTaskOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Task
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Add task dialog */}
      <AddTaskDialog
        open={addTaskOpen}
        users={users}
        onOpenChange={setAddTaskOpen}
        onAddTask={handleAddTask}
        defaultDay={selectedDay}
      />

      {editingTask && (
        <UpdateTaskDialog
          open={updateTaskOpen}
          users={users}
          task={editingTask}
          onDeleted={handleDeleteTask}
          onOpenChange={setUpdateTaskOpen}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
}

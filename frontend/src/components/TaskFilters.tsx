import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task, User, TaskFilter } from "@/types";
import { Filter, User as UserIcon, Users, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFiltersProps {
  user: User;
  users: User[];
  tasks: Task[];
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export function TaskFilters({
  tasks,
  filter,
  onFilterChange,
  user,
  users,
}: TaskFiltersProps) {
  const getTaskCounts = () => {
    const all = tasks.length;
    const mine = tasks.filter(
      (task) => task.assignedToUserId === user.id
    ).length;
    const open = tasks.filter((task) => !task.assignedToUserId).length;
    const completed = tasks.filter((task) => task.status === "done").length;

    return { all, mine, open, completed };
  };

  const counts = getTaskCounts();
  const currentMember = users.find((m) => m.id === user.id);

  const filterButtons = [
    {
      type: "all" as const,
      label: "All Tasks",
      icon: Users,
      count: counts.all,
      description: "View all family tasks",
    },
    {
      type: "mine" as const,
      label: `My Tasks`,
      icon: UserIcon,
      count: counts.mine,
      description: `Tasks assigned to ${currentMember?.name || "you"}`,
    },
    {
      type: "open" as const,
      label: "Open Tasks",
      icon: Filter,
      count: counts.open,
      description: "Tasks anyone can claim",
    },
  ];

  return (
    <Card className="p-4 mb-6 bg-gradient-warm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filter Tasks</h3>
        </div>

        {/* Completion badge */}
        <Badge
          variant="secondary"
          className="bg-success/20 text-success-foreground"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          {counts.completed} completed
        </Badge>
      </div>

      {/* Filter buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {filterButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = filter.type === btn.type;

          return (
            <Button
              key={btn.type}
              variant={isActive ? "default" : "outline"}
              onClick={() => onFilterChange({ type: btn.type })}
              className={cn(
                "h-auto p-4 flex flex-col items-start gap-2 text-left transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "hover:bg-primary/5 hover:border-primary/20"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{btn.label}</span>
                </div>
                <Badge
                  variant={isActive ? "secondary" : "outline"}
                  className={cn(
                    "text-xs",
                    isActive &&
                      "bg-white/20 text-primary-foreground border-white/20"
                  )}
                >
                  {btn.count}
                </Badge>
              </div>
              <p
                className={cn(
                  "text-xs text-left",
                  isActive
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {btn.description}
              </p>
            </Button>
          );
        })}
      </div>

      {/* Active filter indicator */}
      {filter.type !== "all" && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary font-medium">
              Showing {filter.type === "mine" ? "your tasks" : "open tasks"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange({ type: "all" })}
              className="h-auto py-1 px-2 text-xs text-primary hover:bg-primary/10"
            >
              Clear filter
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

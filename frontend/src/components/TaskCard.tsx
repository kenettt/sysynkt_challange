import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User, Task } from "@/types";
import { AVATAR_BY_ROLE } from "@/common";
import {
  CheckCircle,
  Clock,
  Circle,
  User as UserIcon,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  users: User[];
  user: User;
  statusLoading?: boolean;
  claimLoading?: boolean;
  onStatusChange: (taskId: number, status: Task["status"]) => void;
  onClaimTask: (taskId: number, user: User) => void;
  onUpdateTask: (task: Task) => void;
  className?: string;
}

export function TaskCard({
  task,
  users,
  user,
  claimLoading,
  statusLoading,
  onUpdateTask,
  onStatusChange,
  onClaimTask,
  className,
}: TaskCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const assignedMember = users.find((m) => m.id === task.assignedToUserId);
  const isOpen = !task.assignedToUserId;
  const canClaim = isOpen && user?.id;
  const isMine = task.assignedToUserId === user.id;

  const handleStatusChange = (newStatus: Task["status"]) => {
    if (newStatus === "done") {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    onStatusChange(task.id, newStatus);
  };

  const handleClaim = () => {
    if (canClaim) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
      onClaimTask(task.id, user);
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case "todo":
        return <Circle className="h-4 w-4 text-slate-400" />;
      case "doing":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "done":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    }
  };

  const getStatusBg = () => {
    switch (task.status) {
      case "todo":
        return "bg-white";
      case "doing":
        return "bg-blue-50";
      case "done":
        return "bg-emerald-50";
    }
  };

  const getPriorityBorder = () => {
    switch (task.priority) {
      case "high":
        return "border-l-4 border-l-red-400";
      case "medium":
        return "border-l-4 border-l-amber-400";
      case "low":
        return "border-l-4 border-l-slate-300";
    }
  };

  return (
    <Card
      className={cn(
        "p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200",
        getPriorityBorder(),
        getStatusBg(),
        isAnimating &&
          (task.status === "done"
            ? "animate-task-complete"
            : "animate-task-claim"),
        task.status === "done" && "opacity-90",
        className
      )}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          {assignedMember ? (
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-xs">
                {AVATAR_BY_ROLE[assignedMember.role]}
              </div>
              <span className="text-xs text-slate-500">
                {assignedMember.name}
              </span>
            </div>
          ) : (
            <Badge className="flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs text-sky-800">
              <UserIcon className="h-3 w-3" />
              Open
            </Badge>
          )}
          {user.id && ["dad", "mom"].includes(user.role) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateTask(task)}
            >
              <Pencil />
            </Button>
          )}
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <h3
              className={cn(
                "text-sm font-medium text-slate-900",
                task.status === "done" && "line-through text-slate-500"
              )}
            >
              {task.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p
            className={cn(
              "text-xs leading-relaxed text-slate-600",
              task.status === "done" && "line-through"
            )}
          >
            {task.description}
          </p>
        )}

        {/* Priority badge + Actions */}
        <div className="flex items-center justify-between space-x-1 flex-col space-y-3">
          <Badge
            className={cn(
              "text-xs capitalize rounded-md px-2 py-0.5",
              task.priority === "high" &&
                "bg-red-50 text-red-700 border border-red-200",
              task.priority === "medium" &&
                "bg-amber-50 text-amber-700 border border-amber-200",
              task.priority === "low" &&
                "bg-slate-100 text-slate-700 border border-slate-300"
            )}
          >
            {task.priority}
          </Badge>

          {
            <div className="flex gap-2">
              {canClaim && (
                <Button
                  size="sm"
                  onClick={handleClaim}
                  disabled={claimLoading}
                  className="h-7 px-3 text-xs font-medium rounded-md
                           bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                >
                  {claimLoading ? "Claiming..." : "Take this"}
                </Button>
              )}
              {!isOpen && isMine && task.status !== "done" && (
                <div className="flex justify-center gap-2">
                  {task.status === "todo" && (
                    <Button
                      size="sm"
                      disabled={statusLoading}
                      className="h-7 px-3 text-xs font-medium rounded-md
                           bg-green-500 text-white hover:bg-green-600 transition-colors"
                      onClick={() => handleStatusChange("doing")}
                    >
                      {statusLoading ? "Starting..." : "Start"}
                    </Button>
                  )}
                  {task.status === "doing" && (
                    <Button
                      size="sm"
                      disabled={statusLoading}
                      className="h-7 px-3 text-xs font-medium rounded-md
                           bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      onClick={() => handleStatusChange("done")}
                    >
                      {statusLoading ? "Finishing..." : "Done"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          }
        </div>
      </div>
    </Card>
  );
}

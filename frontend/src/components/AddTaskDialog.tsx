import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  type Task,
  type DayOfWeek,
  type User,
  DAYS_OF_WEEK,
  DAY_LABELS,
} from "@/types";
import { AVATAR_BY_ROLE } from "@/common";
import { Plus, User as UserIcon, Loader2 } from "lucide-react";

interface AddTaskDialogProps {
  open: boolean;
  users: User[];
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, "id">) => Promise<void>;
  defaultDay?: DayOfWeek;
  children?: React.ReactNode;
}

interface FormData {
  title: string;
  description: string;
  dueDay: DayOfWeek;
  priority: Task["priority"];
  assignedToUserId: number | null;
}

export function AddTaskDialog({
  open,
  users,
  onOpenChange,
  onAddTask,
  defaultDay = "monday",
  children,
}: AddTaskDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    dueDay: defaultDay,
    priority: "medium" as Task["priority"],
    assignedToUserId: null,
  });

  useEffect(() => {
    if (open) {
      setFormData((prev) => ({
        ...prev,
        dueDay: defaultDay,
      }));
    } else {
      setFormData({
        title: "",
        description: "",
        dueDay: defaultDay,
        priority: "medium",
        assignedToUserId: null,
      });
    }
  }, [defaultDay, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload: Omit<Task, "id"> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDay: formData.dueDay,
      priority: formData.priority,
      status: "todo",
      assignedToUserId: formData.assignedToUserId ?? null,
    };

    try {
      setSubmitting(true);
      await onAddTask(payload);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Add New Task
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill the form to create a task. Title is required; everything else
            is optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add any details or notes..."
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              className="w-full h-20 resize-none"
            />
          </div>

          {/* Due Day */}
          <div className="space-y-2">
            <Label htmlFor="dueDay">Due Day</Label>
            <Select
              value={formData.dueDay}
              onValueChange={(value) => updateFormData("dueDay", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day} value={day}>
                    {DAY_LABELS[day]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => updateFormData("priority", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    Low Priority
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Medium Priority
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    High Priority
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignment */}
          <div className="space-y-2">
            <Label htmlFor="assignedToUserId">Assign To</Label>
            <Select
              value={
                formData.assignedToUserId === null
                  ? "null"
                  : String(formData.assignedToUserId)
              }
              onValueChange={(value) =>
                updateFormData(
                  "assignedToUserId",
                  value === "null" ? null : Number(value)
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Leave open or assign to someone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">
                  <span className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    Leave Open (anyone can claim)
                  </span>
                </SelectItem>
                {users.map((member) => (
                  <SelectItem key={member.id} value={String(member.id)}>
                    <span className="flex items-center gap-2">
                      <span className="text-base">
                        {AVATAR_BY_ROLE[member.role]}
                      </span>
                      {member.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {submitting ? "Adding…" : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

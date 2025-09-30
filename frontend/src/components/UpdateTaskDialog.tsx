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
  type UpdateTaskInput,
  DAYS_OF_WEEK,
  DAY_LABELS,
  type Role,
} from "@/types";
import { useToast } from "@/hooks/use-toast";
import { deleteTask } from "@/api/api"; // vms tee
import { Plus, Trash2, User as UserIcon, Loader2 } from "lucide-react";

interface UpdateTaskDialogProps {
  open: boolean;
  users: User[];
  task: Task;
  onDeleted: (taskId: number) => void;
  onOpenChange: (open: boolean) => void;
  onUpdateTask: (taskId: number, task: UpdateTaskInput) => Promise<void>;
  children?: React.ReactNode;
}

interface FormData {
  title: string;
  description: string;
  status: Task["status"];
  dueDay: DayOfWeek;
  priority: Task["priority"];
  assignedToUserId: number | null;
}

const AVATAR_BY_ROLE: Record<Role, string> = {
  mom: "👩‍🦰",
  dad: "👨",
  child_male: "🧒",
  child_female: "👧",
};

export function UpdateTaskDialog({
  open,
  users,
  task,
  onOpenChange,
  onDeleted,
  onUpdateTask,
  children,
}: UpdateTaskDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: task.title,
    description: task.description ?? "",
    dueDay: task.dueDay,
    status: task.status,
    priority: task.priority,
    assignedToUserId: task.assignedToUserId ?? null,
  });

  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    setFormData({
      title: task.title,
      description: task.description ?? "",
      dueDay: task.dueDay,
      status: task.status,
      priority: task.priority,
      assignedToUserId: task.assignedToUserId ?? null,
    });
  }, [task.id, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const patch: UpdateTaskInput = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDay: formData.dueDay,
      status: formData.status,
      priority: formData.priority,
      assignedToUserId: formData.assignedToUserId ?? null,
    };

    try {
      setSaving(true);
      await onUpdateTask(task.id, patch);
      onOpenChange(false);
    } catch (e: any) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task? This action cannot be undone.")) return;
    try {
      setDeleting(true);
      await deleteTask(task.id);
      onDeleted(task.id);
      toast({ title: "Task deleted 🗑️" });
      onOpenChange(false); // sulge modal
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: e.message ?? "Could not delete task",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Update Task
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill the form to update a task.
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

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v) =>
                updateFormData("status", v as Task["status"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To do</SelectItem>
                <SelectItem value="doing">Doing</SelectItem>
                <SelectItem value="done">Done</SelectItem>
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
            <div className="flex gap-2">
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
                disabled={saving}
                className="flex-1 inline-flex items-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving..." : "Update Task"}
              </Button>
            </div>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="w-full inline-flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Deleting..." : "Delete Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Calendar,
  CheckCircle2,
  Circle,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Input } from "./ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";

const TaskCard = ({ task, index, handleTaskChanged }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(task.title || "");

  // Hàm update title
  const updateTaskTitle = async () => {
    try {
      setIsEditing(false);
      await api.put(`tasks/${task._id}`, { title: updateTitle });
      toast.success(`Nhiệm vụ đã đổi thành ${updateTitle}.`);
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi update Task", error);
      toast.error("Lỗi xảy ra khi update Task");
    }
  };
  // Hàm xóa task
  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Nhiệm vụ đã xóa.");
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi xóa tasks:", error);
      toast.error("Lỗi xảy ra khi xóa tasks");
    }
  };

  // Hàm xử lý sự kiện ấn -> bắt sự kiến: "Ấn Enter để gọi hàm updateTaskTitle"
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      updateTaskTitle();
    }
  };

  // Hàm xử lý nút đánh dấu active / complete
  const toggleTaskButton = async () => {
    try {
      if (task.status === "active") {
        await api.put(`/tasks/${task._id}`, {
          status: "complete",
          completedAt: new Date().toISOString(),
        });
        toast.success(`${task.title} đã hoàn thành`);
      } else {
        await api.put(`/tasks/${task._id}`, {
          status: "active",
          completedAt: null,
        });
        toast.success(`${task.title} đã đổi sang chưa hoàn thành`);
      }
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi điểm danh", error);
      toast.error("Lỗi xảy ra khi điểm danh");
    }
  };

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg trasition-all duration-200 animate-fade-in group",
        task.status === "complete" && "opticity-75",
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Nút tròn */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "shrink-0 size-8 rounded-full transitional-all duration-200",
            task.status === "complete"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-primary",
          )}
          onClick={toggleTaskButton}
        >
          {task.status === "complete" ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        {/* Hiện thị hoặc chỉnh sửa title của task */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              placeholder="Cần phải làm gì?"
              className=" flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
              type="text"
              value={updateTitle}
              onChange={(event) => setUpdateTitle(event.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                setIsEditing(false);
                setUpdateTitle(task.title || "");
              }}
            />
          ) : (
            <p
              className={cn(
                "text-base trasitional-all duration-200",
                task.status === "complete"
                  ? "line-through text-muted-foreground"
                  : "text-muted-foreground",
              )}
            >
              {task.title}
            </p>
          )}

          {/* Ngày tạo & Ngày oàn thành */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString()}
            </span>

            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground " />
                <span className="text-xs **:text-muted-foreground">
                  {new Date(task.completedAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Nút chỉnh và xóa */}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          {/* Nút edit */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-colorc size-8 text-muted-foreground hover:text-info"
            onClick={() => {
              setIsEditing(true);
              setUpdateTitle(task.title || "");
            }}
          >
            <SquarePen className="size-4" />
          </Button>

          {/* Nút xóa */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-colorc size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;

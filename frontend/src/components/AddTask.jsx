import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

const AddTask = ({ handleNewTaskAdded }) => {
  const [newTaskTitle, setTaskTitle] = useState("");

  // Hàm thêm task mới
  const addTask = async () => {
    if (newTaskTitle.trim()) {
      try {
        await api.post("/tasks", {
          title: newTaskTitle,
        });
        toast.success(`Nhiệm vụ ${newTaskTitle} đã được thêm.`);
        handleNewTaskAdded();
      } catch (error) {
        console.error("Lỗi xảy ra khi thêm task.", error);
        toast.error("Lỗi xảy ra khi thêm task mới");
      }

      //Đặt lại input thành ""
      setTaskTitle("");
    } else {
      toast.warning("Bạn cần nhập nội dung của nhiệm vụ!");
    }
  };

  // Hàm xử lý sự kiện ấn -> bắt sự kiến: "Ấn Enter để gọi hàm addTask"
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Cần phải làm gì?"
          className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          value={newTaskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          onKeyPress={handleKeyPress}
        />

        <Button
          variant="gradient"
          size="xl"
          className="px-6"
          onClick={addTask}
          disabled={!newTaskTitle.trim()} // nếu ô input không có giá trị (không tính khoảng trắng) thì không thể ấn nút
        >
          <Plus className="size-5" />
          Thêm
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;

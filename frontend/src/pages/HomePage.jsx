import AddTask from "@/components/AddTask";
import DataTimeFilter from "@/components/DataTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPaginition from "@/components/TaskListPaginition";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/tasks");
        setTaskBuffer(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Lỗi xảy ra khi truy vấn tasks:", error);
        toast.error("Lỗi xảy ra khi truy vấn tasks");
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Dual Gradient Overlay Swapped Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
        radial-gradient(circle 500px at 20% 20%, rgba(139,92,246,0.3), transparent),
        radial-gradient(circle 500px at 80% 80%, rgba(59,130,246,0.3), transparent)
      `,
          backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
        }}
      />
      {/* Your Content/Components */}
      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* Phần đầu trang */}
          <Header />
          {/* Tạo nhiệm vụ*/}
          <AddTask />
          {/* Thống kê và bộ lọc */}
          <StatsAndFilters />
          {/* Danh sách nhiệm vụ */}
          <TaskList filtedTasks={taskBuffer} />
          {/* Phân trang và bộ lọc theo Date */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPaginition />
            <DataTimeFilter />
          </div>
          {/* Chân trang */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

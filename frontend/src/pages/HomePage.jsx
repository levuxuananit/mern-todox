import AddTask from "@/components/AddTask";
import DataTimeFilter from "@/components/DataTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPaginition from "@/components/TaskListPaginition";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";
const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);

  // Gọi API getALLTasks để lấy ra danh sách task
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
    } catch (error) {
      console.error("Lỗi xảy ra khi truy vấn tasks:", error);
      toast.error("Lỗi xảy ra khi truy vấn tasks");
    }
  };

  // useEffect Gọi API getALLTasks, lần đầu sau khi mount và sau khi dateQuery thay đổi (đây là filter theo ngày)
  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  // useEffect Gọi API getALLTasks sau khi filter
  useEffect(() => {
    fetchTasks();
  }, [filter, dateQuery]);

  // Biến lọc dữ liệu theo status, không dùng state vì muốn mỗi lần component re-reder thì filter data mới luôn
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
    }
  });

  // Hàm xử lý cập nhật lại giao diện khi có thay đổi
  const handleTaskChanged = () => {
    fetchTasks();
  };

  // Hàm đi tới trang kế tiếp
  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => {
        return prev + 1;
      });
    }
  };
  // Hàm lùi về trang trước
  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => {
        return prev - 1;
      });
    }
  };

  // Hàm tới trang bất kỳ
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Logic lấy những task hiện thị trên trang hiện tại
  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit,
  );

  if (visibleTasks.length === 0) {
    handlePrev();
  }

  // Logic tính xem có tổng bao nhiêu trang
  // ceil() Hàm làm tròn lên
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

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
          <AddTask handleNewTaskAdded={handleTaskChanged} />
          {/* Thống kê và bộ lọc */}
          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTaskCount={activeTaskCount}
            completedTaskCount={completeTaskCount}
          />
          {/* Danh sách nhiệm vụ */}
          <TaskList
            filtedTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />
          {/* Phân trang và bộ lọc theo Date */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPaginition
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DataTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>
          {/* Chân trang */}
          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  //=============== LOGIC FILTER THEO NGÀY, THÁNG, NĂM ===============
  // 1. Khai báo biến để filter trong querry & now và startDate để tính thời gian
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;
  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "week": {
      // Công thức tính ngày của thứ 2 từ ngày hiện tại.
      // Lịch trong JS, Sun: 0, Mon: 1, Tue: 2,.., Sat: 6
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null;
    }
  }
  // 2. Truy vấn đến DB dựa theo startDate
  const query = startDate ? { createdAt: { $gte: startDate } } : {};
  //===================================================================

  //================= LOGIC TRUY VẤN DỮ LIỆU TRONG DB =================
  // aggregate: là phương thức "băng truyền tổng hợp, kết quả cái trước và input cái sau
  try {
    const [result] = await Task.aggregate([
      // 1. Pippine 1: Lọc theo startDate
      { $match: query },

      // 2. Pippine 2: Lấy danh sách stasks theo status & đếm count
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    // 3. Từ mảng result trích mảng tasks, activeCount, completeCount
    const tasks = result.tasks;
    const activeCount = result.activeCount[0]?.count || 0;
    const completeCount = result.completeCount[0]?.count || 0;
    res.status(200).json({ tasks, activeCount, completeCount });
  } catch (error) {
    console.error("Lỗi khi gọi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
  //===================================================================
};

export const createTasks = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, completedAt } = req.body;

    const updateTask = await Task.findByIdAndUpdate(
      id,
      { title, status, completedAt },
      { new: true, runValidators: true },
    );

    if (!updateTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }
    res.status(200).json(updateTask);
  } catch (error) {
    console.error("Lỗi khi gọi updateTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTask = await Task.findByIdAndDelete(id);

    if (!deleteTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }
    res.status(200).json(deleteTask);
  } catch (error) {
    console.error("Lỗi khi gọi deleteTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

import TaskCard from "./TaskCard";
import TaskEmptyState from "./TaskEmptyState";

const TaskList = ({ filtedTasks, filter, handleTaskChanged }) => {
  if (!filtedTasks || filtedTasks.length === 0) {
    return <TaskEmptyState filter={filter} />;
  }
  return (
    <div className="space-y-3">
      {filtedTasks.map((task, index) => (
        <TaskCard
          key={task._id ?? index}
          task={task}
          index={index}
          handleTaskChanged={handleTaskChanged}
        />
      ))}
    </div>
  );
};

export default TaskList;

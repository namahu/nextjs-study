import { getTasks } from "@/data/tasks";
import { TaskItem } from "./task-item";

export async function TaskList() {
  const tasks = await getTasks();

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

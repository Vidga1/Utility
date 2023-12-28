// Task.ts
export interface Task {
  id: string;
  text: string;
  dueDate: Date;
  status: "new" | "in_progress" | "completed";
  tags: string[];
}

// TaskCalendarAPI.ts
export interface TaskCalendarAPI {
  createTask(task: Task): Promise<void>;
  readTask(id: string): Promise<Task | undefined>;
  updateTask(task: Task): Promise<void>;
  deleteTask(id: string): Promise<void>;
  filterTasks(filter: Partial<Task>): Promise<Task[]>;
}

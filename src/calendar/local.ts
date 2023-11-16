import { Task, TaskCalendarAPI } from "./TaskCalendarAPI";

export class LocalTaskCalendarAPI implements TaskCalendarAPI {
  private storageKey: string;

  constructor(namespace: string) {
    this.storageKey = `tasks_${namespace}`;
  }

  async createTask(task: Task): Promise<void> {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  async readTask(id: string): Promise<Task | undefined> {
    const tasks = this.getTasks();
    return tasks.find((task) => task.id === id);
  }

  async updateTask(updatedTask: Task): Promise<void> {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex((task) => task.id === updatedTask.id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = updatedTask;
      this.saveTasks(tasks);
    }
  }

  async deleteTask(id: string): Promise<void> {
    let tasks = this.getTasks();
    tasks = tasks.filter((task) => task.id !== id);
    this.saveTasks(tasks);
  }

  async filterTasks(filter: Partial<Task>): Promise<Task[]> {
    const tasks = this.getTasks();
    return tasks.filter((task) =>
      Object.entries(filter).every(([key, value]) => {
        const taskKey = key as keyof Task;
        return task[taskKey] === value;
      }),
    );
  }

  private getTasks(): Task[] {
    const tasksJson = localStorage.getItem(this.storageKey);
    return tasksJson ? (JSON.parse(tasksJson) as Task[]) : [];
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }
}

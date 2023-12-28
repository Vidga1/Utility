import { getDatabase, ref, set, child, get, remove } from "firebase/database";
import { Task, TaskCalendarAPI } from "./TaskCalendarAPI";
import { app } from "./firebaseConfig";

export class FirebaseTaskCalendarAPI implements TaskCalendarAPI {
  private dbRef;

  constructor(namespace: string) {
    const database = getDatabase(app);
    this.dbRef = ref(database, `tasks/${namespace}`);
  }

  async createTask(task: Task): Promise<void> {
    await set(child(this.dbRef, task.id), task);
  }

  async readTask(id: string): Promise<Task | undefined> {
    const snapshot = await get(child(this.dbRef, id));
    if (snapshot.exists()) {
      return snapshot.val() as Task;
    }
    return undefined;
  }

  async updateTask(updatedTask: Task): Promise<void> {
    await set(child(this.dbRef, updatedTask.id), updatedTask);
  }

  async deleteTask(id: string): Promise<void> {
    await remove(child(this.dbRef, id));
  }

  async filterTasks(filter: Partial<Task>): Promise<Task[]> {
    const snapshot = await get(this.dbRef);
    const tasks: Task[] = [];

    snapshot.forEach((childSnapshot) => {
      const task = childSnapshot.val() as Task;
      const matchesFilter = Object.entries(filter).every(
        ([key, value]) => task[key as keyof Task] === value,
      );

      if (matchesFilter) {
        tasks.push(task);
      }
    });

    return tasks;
  }
}

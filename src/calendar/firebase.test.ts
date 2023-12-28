import { set, remove, get } from "firebase/database";
import { FirebaseTaskCalendarAPI } from "./firebase";
import { Task } from "./TaskCalendarAPI";

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn().mockReturnValue({}),
  set: jest.fn(),
  remove: jest.fn(),
  child: jest.fn((ref, id) => ({ ref, id })),
  get: jest.fn(),
}));

describe("FirebaseTaskCalendarAPI", () => {
  const namespace = "test";
  const api = new FirebaseTaskCalendarAPI(namespace);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new task", async () => {
    const task: Task = {
      id: "1",
      text: "Test Task",
      dueDate: new Date(),
      status: "new",
      tags: [],
    };

    await api.createTask(task);

    expect(set).toHaveBeenCalledWith(expect.anything(), task);
  });

  it("should read a task by id", async () => {
    const task: Task = {
      id: "1",
      text: "Test Task",
      dueDate: new Date(),
      status: "new",
      tags: [],
    };

    // Mock the Firebase get function
    (get as jest.Mock).mockResolvedValue({
      exists: () => true,
      val: () => task,
    });

    const result = await api.readTask("1");

    expect(result).toEqual(task);
  });

  it("should update a task", async () => {
    const updatedTask: Task = {
      id: "1",
      text: "Updated Task",
      dueDate: new Date(),
      status: "in_progress",
      tags: [],
    };

    await api.updateTask(updatedTask);

    expect(set).toHaveBeenCalledWith(expect.anything(), updatedTask);
  });

  it("should delete a task by id", async () => {
    await api.deleteTask("1");

    expect(remove).toHaveBeenCalledWith(expect.anything());
  });

  it("should filter tasks by a given criteria", async () => {
    const tasks: Task[] = [
      {
        id: "1",
        text: "Task 1",
        dueDate: new Date(),
        status: "new",
        tags: ["home"],
      },
      {
        id: "2",
        text: "Task 2",
        dueDate: new Date(),
        status: "in_progress",
        tags: ["work"],
      },
    ];

    // Mock the Firebase get function
    (get as jest.Mock).mockResolvedValue({
      forEach: (callback: (snapshot: { val: () => Task }) => void) => {
        tasks.forEach((task) =>
          callback({
            val: () => task,
          }),
        );
      },
    });

    const filteredTasks = await api.filterTasks({ status: "new" });

    expect(filteredTasks).toEqual([tasks[0]]);
  });
  it("should handle the case when a task does not exist for reading", async () => {
    // Мокирование Firebase get функции для имитации отсутствия задачи
    (get as jest.Mock).mockResolvedValue({
      exists: () => false,
      val: () => null,
    });

    const result = await api.readTask("non_existing_id");

    expect(result).toBeUndefined();
  });

  it("should handle errors when reading a task", async () => {
    // Мокирование Firebase get функции для имитации ошибки
    (get as jest.Mock).mockRejectedValue(new Error("Error fetching task"));

    await expect(api.readTask("1")).rejects.toThrow("Error fetching task");
  });

  it("should handle errors when creating a task", async () => {
    const task: Task = {
      id: "1",
      text: "Test Task",
      dueDate: new Date(),
      status: "new",
      tags: [],
    };
    // Мокирование Firebase set функции для имитации ошибки
    (set as jest.Mock).mockRejectedValue(new Error("Error creating task"));

    await expect(api.createTask(task)).rejects.toThrow("Error creating task");
  });

  it("should handle errors when deleting a task", async () => {
    // Мокирование Firebase remove функции для имитации ошибки
    (remove as jest.Mock).mockRejectedValue(new Error("Error deleting task"));

    await expect(api.deleteTask("1")).rejects.toThrow("Error deleting task");
  });
});

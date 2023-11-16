import { LocalTaskCalendarAPI } from "./local";
import { Task } from "./TaskCalendarAPI";

describe("LocalTaskCalendarAPI", () => {
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    key: jest.fn(),
    length: 0,
  } as unknown as Storage;

  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new task", async () => {
    const api = new LocalTaskCalendarAPI("test");
    const task: Task = {
      id: "1",
      text: "Test Task",
      dueDate: new Date(),
      status: "new",
      tags: [],
    };
    await api.createTask(task);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "tasks_test",
      JSON.stringify([task]),
    );
  });

  it("should read a task by id", async () => {
    const api = new LocalTaskCalendarAPI("test");
    const task: Task = {
      id: "1",
      text: "Test Task",
      dueDate: new Date(),
      status: "new",
      tags: [],
    };
    const taskWithDateString = { ...task, dueDate: task.dueDate.toISOString() }; // Преобразование даты в строку
    (mockLocalStorage.getItem as jest.Mock).mockReturnValueOnce(
      JSON.stringify([taskWithDateString]),
    );

    const result = await api.readTask("1");

    expect(result).toEqual(taskWithDateString);
  });

  it("should update a task", async () => {
    const api = new LocalTaskCalendarAPI("test");
    const originalTask: Task = {
      id: "1",
      text: "Original Task",
      dueDate: new Date(),
      status: "new",
      tags: [],
    };
    const updatedTask: Task = { ...originalTask, text: "Updated Task" };

    // Подготовка начального состояния
    (mockLocalStorage.getItem as jest.Mock).mockReturnValueOnce(
      JSON.stringify([originalTask]),
    );

    await api.updateTask(updatedTask);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "tasks_test",
      JSON.stringify([updatedTask]),
    );
  });

  it("should delete a task by id", async () => {
    const api = new LocalTaskCalendarAPI("test");
    const task: Task = {
      id: "1",
      text: "Test Task",
      dueDate: new Date(),
      status: "new",
      tags: [],
    };

    // Подготовка начального состояния
    (mockLocalStorage.getItem as jest.Mock).mockReturnValueOnce(
      JSON.stringify([task]),
    );

    await api.deleteTask("1");

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "tasks_test",
      JSON.stringify([]),
    );
  });

  it("should filter tasks by a given criteria", async () => {
    const api = new LocalTaskCalendarAPI("test");
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
      {
        id: "3",
        text: "Task 3",
        dueDate: new Date(),
        status: "completed",
        tags: ["home"],
      },
    ];

    // Преобразование даты в строку для каждой задачи
    const tasksWithDateString = tasks.map((task) => ({
      ...task,
      dueDate: task.dueDate.toISOString(),
    }));

    // Подготовка начального состояния
    (mockLocalStorage.getItem as jest.Mock).mockReturnValueOnce(
      JSON.stringify(tasksWithDateString),
    );

    const filteredTasks = await api.filterTasks({ status: "new" });

    expect(filteredTasks).toEqual([tasksWithDateString[0]]);
  });
  it("should return undefined if task is not found", async () => {
    const api = new LocalTaskCalendarAPI("test");
    (mockLocalStorage.getItem as jest.Mock).mockReturnValueOnce(null);

    const result = await api.readTask("unknown_id");

    expect(result).toBeUndefined();
  });

  it("should not update a non-existing task", async () => {
    const api = new LocalTaskCalendarAPI("test");
    const nonExistingTask: Task = {
      id: "non_existing",
      text: "Non-existing Task",
      dueDate: new Date(),
      status: "new",
      tags: [],
    };

    // Подготовка начального состояния
    (mockLocalStorage.getItem as jest.Mock).mockReturnValueOnce(
      JSON.stringify([]),
    );

    await api.updateTask(nonExistingTask);

    expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(
      "tasks_test",
      JSON.stringify([nonExistingTask]),
    );
  });

  it("should handle empty filter criteria", async () => {
    const api = new LocalTaskCalendarAPI("test");
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

    // Преобразование даты в строку для каждой задачи
    const tasksWithDateString = tasks.map((task) => ({
      ...task,
      dueDate: task.dueDate.toISOString(),
    }));

    // Подготовка начального состояния
    (mockLocalStorage.getItem as jest.Mock).mockReturnValueOnce(
      JSON.stringify(tasksWithDateString),
    );

    const filteredTasks = await api.filterTasks({});

    expect(filteredTasks).toEqual(tasksWithDateString);
  });
});

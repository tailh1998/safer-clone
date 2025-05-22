import type { Task } from "./types"

const STORAGE_KEY = "ai-task-manager-tasks"

const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, 500))

export async function getTasks(): Promise<Task[]> {
  await simulateApiDelay()

  try {
    const tasksJson = localStorage.getItem(STORAGE_KEY)
    return tasksJson ? JSON.parse(tasksJson) : []
  } catch (error) {
    console.error("Error retrieving tasks:", error)
    return []
  }
}

export async function saveTask(task: Task): Promise<Task> {
  await simulateApiDelay()

  try {
    const tasks = await getTasks()
    const updatedTasks = [task, ...tasks]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
    return task
  } catch (error) {
    console.error("Error saving task:", error)
    throw new Error("Failed to save task")
  }
}

export async function deleteTask(id: string): Promise<void> {
  await simulateApiDelay()

  try {
    const tasks = await getTasks()
    const updatedTasks = tasks.filter((task) => task.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks))
  } catch (error) {
    console.error("Error deleting task:", error)
    throw new Error("Failed to delete task")
  }
}

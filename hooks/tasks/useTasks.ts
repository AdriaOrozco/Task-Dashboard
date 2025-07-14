import { useState, useMemo } from "react";
import { OnSubmitTask, Task, TaskPayload } from "@/types/components";
import { toast } from "sonner";

export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  //  Group by StatusId
  const tasksByStatus = useMemo(() => {
    return tasks.reduce<Record<string, Task[]>>((acc, task) => {
      if (!acc[task.statusId]) {
        acc[task.statusId] = [];
      }
      acc[task.statusId].push(task);
      return acc;
    }, {});
  }, [tasks]);

  //If the app becomes bigger consider using Context API, Redux, zustand...
  const createTask: OnSubmitTask = async (
    data,
    mode,
    statusId,
    order,
    comments,
    onOpenChange,
    setError,
    setLoading
  ) => {
    try {
      const payload: TaskPayload = {
        ...data,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null, //Using Timestamp
        comments: comments,
        statusId: statusId,
        order: order,
      };
      const response = await fetch("/api/tasks", {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido");
      }
      const newTask: {
        message: string;
        task: Task;
      } = await response.json();

      setTasks((prev) => [...prev, newTask.task]);

      toast.success("Task created");

      onOpenChange(false);
    } catch (err) {
      toast.error("Error creating task");
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    tasksByStatus,
    setTasks,
    createTask,
  };
}

import { useState, useMemo } from "react";
import { OnSubmitTask, Task, TaskPayload } from "@/types/components";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { can } from "@/lib/utils";
import { useTasksFilters } from "./useTaskFilters";

export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { data: session } = useSession();

  const {
    filteredTasks,
    filters,
    onChangeFilter,
    orderBy,
    setOrderBy,
    creators,
    resetFilters,
  } = useTasksFilters({ tasks });

  //  Group by StatusId
  const tasksByStatus = useMemo(() => {
    return filteredTasks.reduce<Record<string, Task[]>>((acc, task) => {
      if (!acc[task.statusId]) {
        acc[task.statusId] = [];
      }
      acc[task.statusId].push(task);
      return acc;
    }, {});
  }, [filteredTasks]);

  //If the app becomes bigger consider using Context API, Redux, zustand...
  const createTask: OnSubmitTask = async (
    data,
    mode,
    statusId,
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
      };
      if (can(session?.user.role ?? "Worker", "create_task")) {
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
      }
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
    filters,
    onChangeFilter,
    orderBy,
    setOrderBy,
    creators,
    resetFilters,
  };
}

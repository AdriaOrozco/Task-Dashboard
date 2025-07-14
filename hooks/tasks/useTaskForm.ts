import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Comment, TaskHookProps, TaskPayload } from "@/types/components";
import { taskFormSchema, TaskFormValues } from "@/schemas/taskSchema";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useTaskForm({
  mode,
  onOpenChange,
  statusId,
  order,
  task,
  createTask,
}: TaskHookProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email || "Unknown";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: mode === "edit" && task ? task.name : "",
      description: mode === "edit" && task ? task.description ?? "" : "",
      dueDate:
        mode === "edit" && task && task.dueDate
          ? new Date(task.dueDate)
          : undefined,
    },
  });
  const dueDate = watch("dueDate");

  const getTaskComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/comments/${task?.id}`);
      if (!res.ok) {
        throw new Error("Error fetching comments");
      }
      const data: Comment[] = await res.json();
      console.log(comments);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
    setLoadingComments(false);
  };

  useEffect(() => {
    if (mode === "edit" && task) {
      reset({
        name: task ? task.name : "",
        description: mode === "edit" && task ? task.description ?? "" : "",
        dueDate:
          mode === "edit" && task && task.dueDate
            ? new Date(task.dueDate)
            : undefined,
      });
      getTaskComments();
    }

    return () => {
      //reset form
      reset({
        name: "",
        description: "",
        dueDate: undefined,
      });
      setComments([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, task, reset]);

  const onSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    setLoading(true);
    setError(null);
    if (mode == "create" && createTask) {
      await createTask(
        data,
        mode,
        statusId,
        order,
        comments,
        onOpenChange,
        setError,
        setLoading
      );
    }
    if (mode == "edit") {
      updateTask(data);
    }
  };

  const router = useRouter();

  const updateTask = async (data: TaskFormValues) => {
    try {
      const payload: TaskPayload = {
        ...data,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
        comments,
        statusId,
        order,
      };

      const response = await fetch(`/api/tasks/${task?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }

      toast.success("Task updated");
      router.push("/");
    } catch (err) {
      toast.error("Error updating task");
      setError(
        err instanceof Error
          ? err.message
          : "There was an error. Please, try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const addComment = () => {
    const trimmedComment = newComment.trim();
    if (trimmedComment.length === 0) return;

    const newCommentObj: Comment = {
      id: crypto.randomUUID(),
      authorEmail: currentUserEmail,
      text: trimmedComment,
      createdAt: new Date(),
    };
    //TODO implement roles
    setComments((prev) => [...prev, newCommentObj]);
    setNewComment("");
  };

  return {
    register,
    handleSubmit,
    setValue,
    errors,
    isSubmitting,
    newComment,
    setNewComment,
    comments,
    addComment,
    onSubmit,
    dueDate,
    loading,
    error,
    loadingComments,
  };
}

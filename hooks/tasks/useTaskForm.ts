import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Comment, TaskHookProps, TaskPayload } from "@/types/components";
import { taskFormSchema, TaskFormValues } from "@/schemas/taskSchema";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function useTaskForm({
  mode,
  initialData,
  onOpenChange,
  statusName,
  order,
}: TaskHookProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email || "Unknown";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      name: "",
      description: "",
      dueDate: undefined,
    },
  });
  const dueDate = watch("dueDate");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate)
          : undefined,
      });
      //TODO -> Fetch comments
    }
  }, [mode, initialData, reset]);

  const onSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    //TODO -> Edit
    setLoading(true);
    setError(null);
    try {
      const payload: TaskPayload = {
        ...data,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null, //Using Timestamp
        comments: comments,
        statusId: statusName,
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
      toast.success("Task created");
      onOpenChange(false);
    } catch (err) {
      toast.error("Error creating task");
      setError(err instanceof Error ? err.message : "Error inesperado");
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

    //TODO: Edit -> create comment on API
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
  };
}

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Comment, TaskHookProps } from "@/types/components";
import { taskFormSchema, TaskFormValues } from "@/schemas/taskSchema";
import { useSession } from "next-auth/react";

export function useTaskForm({
  mode,
  initialData,
  onOpenChange,
  statusId,
  order,
  createTask,
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

    return () => {
      //reset form
      reset({
        name: "",
        description: "",
        dueDate: undefined,
      });
      setComments([]);
    };
  }, [mode, initialData, reset]);

  const onSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    //TODO -> Edit
    setLoading(true);
    setError(null);
    if (createTask) {
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
  };
}

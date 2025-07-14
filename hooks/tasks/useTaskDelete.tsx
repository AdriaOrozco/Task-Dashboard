import { useState } from "react";
import { toast } from "sonner";

export function useTaskDelete({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const { error } = await res.json();
        console.log("Error deleting task:", error, res.json());
        toast.error("Error deleting task");
        throw new Error(error || "Error deleting task");
      }
      toast.success("Status deleted successfully");
      window.location.reload();

      setLoading(false);
    } catch (error) {
      toast.error("Error deleting task");
      setLoading(false);
      console.error("Error deleting task: ", error);
    }
  };
  return {
    loading,
    handleDelete,
  };
}

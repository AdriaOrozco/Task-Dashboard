import { Operations } from "@/types/components";
import { useState } from "react";
import { toast } from "sonner";

export function useStatusDelete({
  id,
  updateListOperation,
}: {
  id: string;
  updateListOperation: (
    operation: Operations,
    id: string,
    name?: string
  ) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/statuses/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const { error } = await res.json();
        console.log("Error deleting status:", error, res.json());
        toast.error("Error deleting status");
        throw new Error(error || "Error deleting status");
      }
      updateListOperation("DELETE", id);
      toast.success("Status deleted successfully");
      setLoading(false);
      return true;
    } catch (error) {
      toast.error("Error deleting status");
      console.error("Error deleting status: ", error);
      setLoading(false);
      return false;
    }
  };
  return {
    handleDelete,
    loading,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
  };
}

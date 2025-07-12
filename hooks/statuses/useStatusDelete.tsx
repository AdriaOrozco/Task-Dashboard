import { Operations } from "@/types/components";
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
  const handleDelete = async () => {
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
      return true;
    } catch (error) {
      toast.error("Error deleting status");
      console.error("Error deleting status: ", error);
      return false;
    }
  };
  return {
    handleDelete,
  };
}

import { StatusCardType } from "@/types/components";
import { useState } from "react";
import { toast } from "sonner";

export function useStatusName({
  name,
  id,
  updateListOperation,
}: StatusCardType) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      setNewName(name);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (newName.trim() && newName !== name) {
        await handleChangeName();
      }
    }
  };

  const handleChangeName = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await updateStatusName(id, newName);
      updateListOperation("UPDATE_NAME", id, newName);
      setIsEditing(false);
    } catch (err) {
      setError("Error updating status name: " + (err as Error).message);
      toast.error("Error updating status name");
    } finally {
      toast.success("Status name updated successfully");
      setIsSaving(false);
    }
  };
  async function updateStatusName(id: string, name: string) {
    const res = await fetch(`/api/statuses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error("Error updating status name");
    return res.json();
  }

  return {
    isEditing,
    handleChangeName,
    setNewName,
    newName,
    setIsEditing,
    isSaving,
    handleKeyDown,
    error,
  };
}

import { useState } from "react";

export function useStatusName({ name, id }: { name: string; id: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleChangeName = async () => {
    try {
      await updateStatusName(id, newName);
      setIsEditing(false);
      //TODO: Add loading state
    } catch (error) {
      //TODO: handle error
      console.error(error);
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
  };
}

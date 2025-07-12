import { Status } from "@/types/components";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function useStatusCreate({
  statusesState,
  setStatusesState,
}: {
  statusesState: Status[];
  setStatusesState: Dispatch<SetStateAction<Status[]>>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");

  const handleCreateNewStatus = () => {
    if (value.trim()) {
      handleCreate(value.trim());
    }
    setValue("");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreateNewStatus();
    if (e.key === "Escape") {
      setValue("");
      setIsEditing(false);
    }
  };
  const handleCreate = async (name: string) => {
    const res = await fetch("/api/statuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        order: statusesState.length,
      }),
    });

    const newStatus: {
      message: string;
      status: Status;
    } = await res.json();
    if (!res.ok || !newStatus.status) {
      toast.error(newStatus.message || "Error creating status");
      return;
    } else {
      setStatusesState((prev) => [...prev, newStatus.status]);
      toast.success("Status created successfully");
    }
  };

  return {
    createOperations: {
      isEditing,
      setIsEditing,
      value,
      setValue,
      handleCreateNewStatus,
      handleKeyDown,
    },
  };
}

"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStatusName } from "@/hooks/statuses/useStatusName";
import { useStatusDelete } from "@/hooks/statuses/useStatusDelete";
import { StatusCardType } from "@/types/components";
import { cn, getDragStyle } from "@/lib/utils";
import { memo } from "react";
import CardHeader from "./CardHeader";
import CardHeaderEditor from "./CardHeaderEditor";

function StatusCard({
  id,
  name,
  isDragging,
  updateListOperation,
}: StatusCardType) {
  const {
    isEditing,
    newName,
    setIsEditing,
    handleChangeName,
    setNewName,
    isSaving,
    error,
    handleKeyDown,
  } = useStatusName({ name, id, updateListOperation });
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled: isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };
  const { handleDelete } = useStatusDelete({
    id,
    updateListOperation,
  });

  return (
    <section
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex flex-col bg-gray-700 rounded-xl shadow-sm min-h-[340px] min-w-[320px] p-5 border border-gray-700 hover:border-violet-600 transition relative",
        getDragStyle(isDragging ?? false)
      )}
    >
      {!isEditing ? (
        <CardHeader
          newName={newName}
          setIsEditing={setIsEditing}
          handleDelete={handleDelete}
        />
      ) : (
        <CardHeaderEditor
          newName={newName}
          setNewName={setNewName}
          handleKeyDown={handleKeyDown}
          isSaving={isSaving}
          handleChangeName={handleChangeName}
          error={error}
        />
      )}
      <div className="flex-1 border border-dashed border-gray-400 rounded-md bg-gray-800 flex items-center justify-center text-gray-400 select-none">
        <p className="italic pointer-events-none">No tasks yet</p>
      </div>
    </section>
  );
}

export const StatusCardMemo = memo(StatusCard);

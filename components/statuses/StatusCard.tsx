"use client";

import { Pencil, Trash } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStatusName } from "@/hooks/useStatusName";
import { useStatusDelete } from "@/hooks/useStatusDelete";
import { StatusCardType } from "@/types/components";
import { Spinner } from "../ui/spinner";
import { cn, getDragStyle } from "@/lib/utils";
import { memo } from "react";

function StatusCard({ id, name, isDragging }: StatusCardType) {
  const {
    isEditing,
    newName,
    setIsEditing,
    handleChangeName,
    setNewName,
    isSaving,
    error,
    handleKeyDown,
  } = useStatusName({ name, id });
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled: isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };
  const { handleDelete } = useStatusDelete();

  return (
    <section
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex flex-col bg-gray-700 rounded-xl shadow-sm min-h-[320px] p-5 border border-gray-700 hover:border-violet-600 transition relative",
        getDragStyle(isDragging ?? false)
      )}
    >
      {!isEditing ? (
        <div className="flex justify-between items-center mb-4 z-10 relative cursor-grab">
          <h2 className="text-lg font-semibold text-gray-200 select-none">
            {newName}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-white-400 hover:text-gray-900 transition cursor-pointer"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleDelete}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-white-400 hover:text-gray-900 transition cursor-pointer"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex flex-col gap-1 z-10 relative cursor-default">
          <div className="flex items-center gap-2">
            <input
              className="bg-gray-600 text-gray-100 px-2 py-1 rounded outline-none focus:ring ring-violet-500 w-full"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              disabled={isSaving}
            />
            {isSaving ? (
              <div className="flex justify-center py-1 min-w-[55px]">
                <Spinner width={22} height={22} />
              </div>
            ) : (
              <button
                onClick={handleChangeName}
                disabled={isSaving || newName.trim() === ""}
                className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-3 py-1 rounded transition h-8 disabled:opacity-50 cursor-pointer"
              >
                Save
              </button>
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
      <div className="flex-1 border border-dashed border-gray-400 rounded-md bg-gray-800 flex items-center justify-center text-gray-400 select-none">
        <p className="italic pointer-events-none">No tasks yet</p>
      </div>
    </section>
  );
}

export const StatusCardMemo = memo(StatusCard);

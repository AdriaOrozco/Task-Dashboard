import { Pencil, Trash } from "lucide-react";
import ConfirmModal from "../common/ConfirmModal";

export default function CardHeader({
  newName,
  setIsEditing,
  handleDelete,
  loading,
  confirmDeleteOpen,
  setConfirmDeleteOpen,
}: {
  newName: string;
  setIsEditing: (isEditing: boolean) => void;
  handleDelete: () => void;
  loading: boolean;
  confirmDeleteOpen: boolean;
  setConfirmDeleteOpen: (confirmDeleteOpen: boolean) => void;
}) {
  return (
    <>
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
            onClick={() => {
              setConfirmDeleteOpen(true);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-white-400 hover:text-gray-900 transition cursor-pointer"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
      {confirmDeleteOpen && (
        <ConfirmModal
          open={confirmDeleteOpen}
          onOpenChange={setConfirmDeleteOpen}
          title="Delete status"
          description="Are you sure you want to delete this status? The tasks inside will be affected."
          onConfirm={() => {
            handleDelete();
          }}
          loading={loading}
        />
      )}
    </>
  );
}

import { can, timestampToDate } from "@/lib/utils";
import { Task } from "@/types/components";
import { MoreVertical } from "lucide-react";
import { createPortal } from "react-dom";
import { useTaskItem } from "@/hooks/tasks/useTaskItem";
import ConfirmModal from "../common/ConfirmModal";
import { useTaskDelete } from "@/hooks/tasks/useTaskDelete";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function TaskItem({
  task,
  onEdit,
}: {
  task: Task;
  onEdit: (task: Task) => void;
}) {
  const {
    toggleMenu,
    menuPosition,
    buttonRef,
    openMenu,
    menuRef,
    setOpenMenu,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    openDeleteConfirmation,
  } = useTaskItem();

  const { handleDelete, loading } = useTaskDelete({ id: task.id });
  const { data: session } = useSession();

  return (
    <>
      <li className="relative w-full bg-gray-700 max-w-[260px] rounded-lg px-3 py-2 shadow-md hover:bg-gray-600 transition cursor-pointer flex flex-col">
        <div className="flex justify-between items-start">
          <div className="text-sm font-medium text-white truncate max-w-[200px]">
            {task.name}
          </div>

          <div>
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Open task options"
            >
              <MoreVertical color="white" className="h-5 w-5" />
            </button>

            {openMenu &&
              createPortal(
                <div
                  ref={menuRef}
                  className="fixed w-28 bg-gray-800 border border-gray-600 rounded shadow-lg z-[9999]"
                  style={{
                    top: menuPosition.top,
                    left: menuPosition.left,
                  }}
                >
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                      setOpenMenu(false);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    Edit
                  </button>
                  {session?.user.role &&
                  session.user.email &&
                  can(session.user.role, "delete_self", {
                    userId: session.user.email,
                    resourceOwnerId: task.createdBy,
                  }) ? (
                    <button
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-700 hover:text-white cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteConfirmation();
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>,
                document.body
              )}
          </div>
        </div>

        <div className="text-xs text-gray-300">
          {timestampToDate(task.createdAt)}
        </div>
        <div className="text-sm text-gray-300 overflow-hidden whitespace-nowrap text-ellipsis">
          {task.description || ""}
        </div>
      </li>
      {confirmDeleteOpen && (
        <ConfirmModal
          open={confirmDeleteOpen}
          onOpenChange={setConfirmDeleteOpen}
          title="Delete task"
          description="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={() => {
            if (session?.user.role && session.user.email)
              if (
                can(session.user.role, "delete_self", {
                  userId: session.user.email,
                  resourceOwnerId: task.createdBy,
                })
              ) {
                handleDelete();
              } else {
                toast.error(
                  "You don't have permissions to perform this action"
                );
              }
          }}
          loading={loading}
        />
      )}
    </>
  );
}

"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStatusName } from "@/hooks/statuses/useStatusName";
import { useStatusDelete } from "@/hooks/statuses/useStatusDelete";
import { OnSubmitTask, StatusCardType, Task } from "@/types/components";
import { can, cn, getDragStyle } from "@/lib/utils";
import { memo, useState } from "react";
import CardHeader from "./CardHeader";
import CardHeaderEditor from "./CardHeaderEditor";
import { TaskModal } from "../tasks/TaskModal";
import TaskItem from "../tasks/TaskItem";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function StatusCard({
  id,
  name,
  isDragging,
  updateListOperation,
  tasks,
  createTask,
  canDrag,
}: StatusCardType & {
  tasks: Task[];
  createTask: OnSubmitTask;
  canDrag: boolean;
}) {
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
    cursor: canDrag ? "grab" : "default",
  };
  const { handleDelete, loading, confirmDeleteOpen, setConfirmDeleteOpen } =
    useStatusDelete({
      id,
      updateListOperation,
    });

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  return (
    <>
      <section
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "flex flex-col bg-gray-700 rounded-xl shadow-sm min-w-[320px] max-h-[calc(100vh-100px)] p-5 border border-gray-700 hover:border-violet-600 transition relative",
          getDragStyle(isDragging ?? false)
        )}
      >
        {!isEditing ? (
          <CardHeader
            confirmDeleteOpen={confirmDeleteOpen}
            setConfirmDeleteOpen={setConfirmDeleteOpen}
            newName={newName}
            setIsEditing={setIsEditing}
            handleDelete={handleDelete}
            loading={loading}
            canDrag={canDrag}
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
        <div className="flex-1 overflow-y-auto my-2 min-h-[200px]">
          <ul
            className={cn(
              "w-full min-h-[200px] border border-dashed border-gray-400 rounded-md bg-gray-800 text-gray-400 select-none px-2 py-2",
              tasks.length === 0
                ? "flex items-center justify-center min-h-[100px]"
                : "flex flex-col gap-3"
            )}
          >
            {tasks.length === 0 ? (
              <p className="italic text-gray-400 w-full text-center">
                No tasks yet
              </p>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={() => {
                    router.push(`/task/${task.id}`);
                  }}
                />
              ))
            )}
          </ul>
        </div>
        {session?.user?.role && can(session.user.role, "create_task") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full mt-2 p-2 text-sm text-white text-left hover:bg-gray-600 rounded cursor-pointer"
          >
            + Add task
          </button>
        )}
      </section>
      {open && (
        <TaskModal
          mode="create"
          statusName={newName}
          statusId={id}
          open={open}
          onOpenChange={setOpen}
          title="Create new task"
          order={tasks.length}
          createTask={createTask}
        ></TaskModal>
      )}
    </>
  );
}

export const StatusCardMemo = memo(StatusCard);

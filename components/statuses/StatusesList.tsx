"use client";
import { Status, Task } from "@/types/components";
import { StatusCardMemo as StatusCard } from "./StatusCard";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useStatus } from "@/hooks/statuses/useStatus";
import AddStatusCard from "./AddStatusCard";
import { useTasks } from "@/hooks/tasks/useTasks";
import { useSession } from "next-auth/react";
import { can } from "@/lib/utils";
import { FiltersPanel } from "../filters/FiltersPanel";

export function StatusesList({
  statuses,
  tasks,
}: {
  statuses: Status[];
  tasks: Task[];
}) {
  const {
    statusesState,
    sensors,
    handleDragEnd,
    activeStatus,
    handleDragStart,
    createOperations,
    updateListOperation,
    canDrag,
  } = useStatus({
    statuses,
  });

  const { data: session } = useSession();

  const {
    tasksByStatus,
    createTask,
    filters,
    onChangeFilter,
    orderBy,
    setOrderBy,
    creators,
    resetFilters,
  } = useTasks(tasks);

  return (
    <>
      <FiltersPanel
        filters={filters}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        statuses={statuses}
        creators={creators}
        onChangeFilter={onChangeFilter}
        resetFilters={resetFilters}
      />

      <main className="flex gap-4 px-4 py-2 overflow-x-auto h-calc-header">
        {canDrag ? (
          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragEnd={canDrag ? handleDragEnd : undefined}
            onDragStart={canDrag ? handleDragStart : undefined}
          >
            <SortableContext
              items={statusesState}
              strategy={horizontalListSortingStrategy}
            >
              {statusesState.map((status) => {
                if (filters.statusId && filters.statusId !== status.id) {
                  return null;
                }
                return (
                  <div key={status.id} className="max-h-full">
                    <StatusCard
                      updateListOperation={updateListOperation}
                      id={status.id}
                      name={status.name}
                      tasks={tasksByStatus[status.id] ?? []}
                      canDrag={canDrag}
                      createTask={createTask}
                    />
                  </div>
                );
              })}
              {session?.user?.role &&
                can(session.user.role, "create_status") && (
                  <AddStatusCard createOperations={createOperations} />
                )}
            </SortableContext>
            {canDrag ? (
              <DragOverlay>
                {activeStatus ? (
                  <StatusCard
                    tasks={tasksByStatus[activeStatus.id] ?? []}
                    updateListOperation={updateListOperation}
                    id={activeStatus.id}
                    name={activeStatus.name}
                    createTask={createTask}
                    canDrag={canDrag}
                    isDragging
                  />
                ) : null}
              </DragOverlay>
            ) : null}
          </DndContext>
        ) : (
          <>
            {" "}
            {statusesState.map((status) => {
              if (filters.statusId && filters.statusId !== status.id) {
                return null;
              }
              return (
                <div key={status.id} className="max-h-full">
                  <StatusCard
                    updateListOperation={updateListOperation}
                    key={status.id}
                    id={status.id}
                    name={status.name}
                    tasks={tasksByStatus[status.id] ?? []}
                    createTask={createTask}
                    canDrag={canDrag}
                  />
                </div>
              );
            })}
            {session?.user?.role && can(session.user.role, "create_status") && (
              <AddStatusCard createOperations={createOperations} />
            )}
          </>
        )}
      </main>
    </>
  );
}

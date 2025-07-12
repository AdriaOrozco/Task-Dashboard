"use client";
import { Status } from "@/types/components";
import { StatusCardMemo as StatusCard } from "./StatusCard";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useStatus } from "@/hooks/statuses/useStatus";
import AddStatusCard from "./AddStatusCard";

export function StatusesList({ statuses }: { statuses: Status[] }) {
  const {
    statusesState,
    sensors,
    handleDragEnd,
    activeStatus,
    handleDragStart,
    createOperations,
    updateListOperation,
  } = useStatus({
    statuses,
  });

  return (
    <main className="flex gap-4 px-4 py-2 overflow-x-auto h-calc-header">
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext
          items={statusesState}
          strategy={horizontalListSortingStrategy}
        >
          {statusesState.map((status: Status) => (
            <div key={status.id} className="max-h-full">
              <StatusCard
                updateListOperation={updateListOperation}
                key={status.id}
                id={status.id}
                name={status.name}
              />
            </div>
          ))}
          <AddStatusCard createOperations={createOperations} />
        </SortableContext>
        <DragOverlay>
          {activeStatus ? (
            <StatusCard
              updateListOperation={updateListOperation}
              id={activeStatus.id}
              name={activeStatus.name}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}

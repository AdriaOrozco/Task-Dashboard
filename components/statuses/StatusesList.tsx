"use client";
import { Status } from "@/types/components";
import { StatusCardMemo as StatusCard } from "./StatusCard";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useStatusOrder } from "@/hooks/useStatusOrder";

export function StatusesList({ statuses }: { statuses: Status[] }) {
  const {
    statusesState,
    sensors,
    handleDragEnd,
    activeStatus,
    handleDragStart,
  } = useStatusOrder({
    statuses,
  });

  return (
    <main className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-6 p-4 min-h-[300px]">
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
            <StatusCard key={status.id} id={status.id} name={status.name} />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeStatus ? (
            <StatusCard
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

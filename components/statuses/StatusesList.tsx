"use client";

import { Status } from "@/types/components";
import { StatusCard } from "./StatusCard";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useStatusOrder } from "@/hooks/useStatusOrder";

export function StatusesList({ statuses }: { statuses: Status[] }) {
  const { statusesState, sensors, handleDragEnd } = useStatusOrder({
    statuses,
  });

  return (
    <main className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-6 p-4 min-h-[300px]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={statuses}
          strategy={verticalListSortingStrategy}
        >
          {statusesState.map((status: Status) => (
            <StatusCard key={status.id} id={status.id} name={status.name} />
          ))}
        </SortableContext>
      </DndContext>
    </main>
  );
}

import { Status } from "@/types/components";
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";

const NOT_FOUND = -1;

export function useStatusOrder({ statuses }: { statuses: Status[] }) {
  const [statusesState, setStatuseState] = useState(statuses);
  const sensors = useSensors(useSensor(PointerSensor));

  async function updateStatusOrder(orderedIds: string[]) {
    const res = await fetch(`/api/statuses/order`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });

    if (!res.ok) throw new Error("Error updating status order");
    return res.json();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = statusesState.findIndex((i) => i.id === active.id);
      const newIndex = statusesState.findIndex((i) => i.id === over.id);

      if (oldIndex !== NOT_FOUND && newIndex !== NOT_FOUND) {
        const newOrder = arrayMove(statusesState, oldIndex, newIndex);
        const orderedIds = newOrder.map((s) => s.id);
        updateStatusOrder(orderedIds).catch(console.error);
        setStatuseState(newOrder);
      }
    }
  }
  return {
    statusesState,
    sensors,
    handleDragEnd,
  };
}

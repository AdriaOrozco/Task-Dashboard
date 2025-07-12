import { Status } from "@/types/components";
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useState } from "react";

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

  const [activeStatus, setActiveStatus] = useState<Status | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id;
    const dragged = statuses.find((s) => s.id === id);
    if (dragged) {
      setActiveStatus(dragged);
    }
  };

  //Avoid unnecessary re-renders and API calls by using useCallback
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
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
      setActiveStatus(null);
    },
    [statusesState]
  );
  return {
    statusesState,
    sensors,
    handleDragEnd,
    activeStatus,
    handleDragStart,
  };
}

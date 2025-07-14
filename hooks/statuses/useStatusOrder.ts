import { can } from "@/lib/utils";
import { Status } from "@/types/components";
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { toast } from "sonner";

const NOT_FOUND = -1;

export function useStatusOrder({
  statusesState,
  setStatusesState,
}: {
  statusesState: Status[];
  setStatusesState: Dispatch<SetStateAction<Status[]>>;
}) {
  const sensors = useSensors(useSensor(PointerSensor));
  const { data: session } = useSession();
  const canDrag = can(session?.user?.role ?? "Worker", "drag_and_drop");

  async function updateStatusOrder(orderedIds: string[]) {
    if (canDrag) {
      const res = await fetch(`/api/statuses/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });

      if (!res.ok) throw new Error("Error updating status order");
      toast.success("Reordered successfully");
      return res.json();
    }
  }

  const [activeStatus, setActiveStatus] = useState<Status | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    if (canDrag) {
      const id = event.active.id;
      const dragged = statusesState.find((s) => s.id === id);
      if (dragged) {
        setActiveStatus(dragged);
      }
    }
  };

  //Avoid unnecessary re-renders and API calls by using useCallback
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (canDrag) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
          const oldIndex = statusesState.findIndex((i) => i.id === active.id);
          const newIndex = statusesState.findIndex((i) => i.id === over.id);

          if (oldIndex !== NOT_FOUND && newIndex !== NOT_FOUND) {
            const newOrder = arrayMove(statusesState, oldIndex, newIndex);
            const orderedIds = newOrder.map((s) => s.id);
            updateStatusOrder(orderedIds).catch(console.error);
            setStatusesState(newOrder);
          }
        }
        setActiveStatus(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setStatusesState, statusesState, canDrag]
  );

  return {
    sensors,
    handleDragEnd,
    activeStatus,
    handleDragStart,
    canDrag,
  };
}

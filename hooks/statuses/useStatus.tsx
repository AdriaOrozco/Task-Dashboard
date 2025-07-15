import { Operations, Status } from "@/types/components";
import { useState } from "react";
import { useStatusOrder } from "./useStatusOrder";
import { useStatusCreate } from "./useStatusCreate";
import { toast } from "sonner";

export function useStatus({ statuses }: { statuses: Status[] }) {
  const [statusesState, setStatuseState] = useState(statuses);

  //ORDER STATUSES
  const { sensors, handleDragEnd, activeStatus, handleDragStart, canDrag } =
    useStatusOrder({
      statusesState,
      setStatusesState: setStatuseState,
    });

  //CREATE STATUSES
  const { createOperations } = useStatusCreate({
    statusesState: statusesState,
    setStatusesState: setStatuseState,
  });

  function updateListOperation(
    operation: Operations,
    id: string,
    name?: string
  ) {
    switch (operation) {
      case "UPDATE_NAME":
        //Find the status in the list and update its name
        //This is only for the UI, backend update is handled in useStatusName
        if (name) {
          setStatuseState((prevStatuses) =>
            prevStatuses.map((status) =>
              status.id === id ? { ...status, name } : status
            )
          );
        }
        break;
      case "DELETE":
        //This is only for the UI, backend delete is handled in useStatusDelete
        setStatuseState((prevStatuses) => {
          //Delete the status with the given id
          const updated = prevStatuses.filter((status) => status.id !== id);
          // Update the order of the remaining statuses
          return updated.map((status, index) => ({
            ...status,
            order: index,
          }));
        });
        break;
      default:
        toast.error("Invalid operation");
        break;
    }
  }

  return {
    statusesState,
    sensors,
    handleDragEnd,
    activeStatus,
    handleDragStart,
    createOperations,
    updateListOperation,
    canDrag,
  };
}

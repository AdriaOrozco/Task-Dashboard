import { Status } from "@/types/components";
import { useState } from "react";
import { useStatusOrder } from "./useStatusOrder";
import { useStatusCreate } from "./useStatusCreate";

export function useStatus({ statuses }: { statuses: Status[] }) {
  const [statusesState, setStatuseState] = useState(statuses);

  const { sensors, handleDragEnd, activeStatus, handleDragStart } =
    useStatusOrder({
      statusesState,
      setStatusesState: setStatuseState,
    });

  const { createOperations } = useStatusCreate({
    statusesState: statusesState,
    setStatusesState: setStatuseState,
  });

  return {
    statusesState,
    sensors,
    handleDragEnd,
    activeStatus,
    handleDragStart,
    createOperations,
  };
}

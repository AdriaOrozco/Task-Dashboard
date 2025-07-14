import { Status, Task } from "@/types/components";
import { ErrorMessage } from "../common/ErrorMessage";
import { StatusesList } from "./StatusesList";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function Board() {
  const boardData: {
    statuses: Status[];
    tasks: Task[];
  } = await fetchWithAuth("api/statuses");

  if (!boardData) {
    return (
      <div className="h-calc-header flex items-center justify-center">
        <ErrorMessage message="Statuses can not be loaded" />
      </div>
    );
  }

  return <StatusesList statuses={boardData.statuses} tasks={boardData.tasks} />;
}

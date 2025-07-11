import { ErrorMessage } from "../common/ErrorMessage";
import { StatusesList } from "./StatusesList";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function Board() {
  const statuses = await fetchWithAuth("api/statuses");

  if (!statuses) {
    return (
      <div className="h-calc-header flex items-center justify-center">
        <ErrorMessage message="Statuses can not be loaded" />
      </div>
    );
  }

  return <StatusesList statuses={statuses} />;
}

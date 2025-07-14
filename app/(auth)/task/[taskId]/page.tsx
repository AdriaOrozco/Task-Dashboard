import TaskModalClient from "@/components/tasks/TaskModalClient";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Task } from "@/types/components";
import { redirect } from "next/navigation";

export default async function TaskModalPage({
  params,
}: {
  params: { taskId: string };
}) {
  const { taskId } = await params;

  if (!taskId) {
    redirect("/");
  }

  const taskAndStatus: {
    status: {
      statusName: string;
      statusId: string;
    };
    task: Task;
  } = await fetchWithAuth(`api/tasks/${taskId}`);

  if (!taskAndStatus) redirect("/");

  return <TaskModalClient taskAndStatus={taskAndStatus} />;
}

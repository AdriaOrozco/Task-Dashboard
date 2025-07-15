"use client";
import { TaskModal } from "./TaskModal";
import { Task } from "@/types/components";
import { redirect } from "next/navigation";

interface TaskAndStatus {
  task: Task;
  status: {
    statusName: string;
    statusId: string;
  };
}

interface Props {
  taskAndStatus: TaskAndStatus;
}

export default function TaskModalClient({ taskAndStatus }: Props) {
  return (
    <TaskModal
      mode="edit"
      statusName={taskAndStatus.status.statusName}
      statusId={taskAndStatus.status.statusId}
      open={true}
      title="Edit task"
      task={taskAndStatus.task}
      onOpenChange={() => {
        redirect("/");
      }}
    />
  );
}

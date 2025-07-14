import { Dispatch, SetStateAction } from "react";

export type SpinnerProps = {
  width?: number | string;
  height?: number | string;
};

export type Status = {
  id: string;
  name: string;
  order: number;
};

export type StatusCardType = {
  id: string;
  name: string;
  isDragging?: boolean;
  updateListOperation: (
    operation: Operations,
    id: string,
    name?: string
  ) => void;
};

export type CreateOperationsType = {
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  handleCreateNewStatus: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export type Operations = "UPDATE_NAME" | "DELETE";

export type Task = {
  id: string;
  name: string;
  description?: string;
  statusId: string;
  dueDate?: string | null;
  order: number;
  createdAt: CustomTimeStamp;
  updatedAt: CustomTimeStamp;
};

export interface TaskPayload {
  comments: Comment[];
  name: string;
  description?: string;
  statusId: string;
  dueDate?: string | null;
  order: number;
}

export type TaskHookProps = {
  mode: "create" | "edit";
  statusId: string;
  order: number;
  createTask?: OnSubmitTask;
  task?: Task;
  onOpenChange: (open: boolean) => void;
};

export interface TaskModalProps extends TaskHookProps {
  open: boolean;
  title: string;
  statusName: string;
}

export interface Comment {
  id: string;
  authorEmail: string;
  text: string;
  createdAt: Date;
}

export type CustomTimeStamp = {
  _seconds: number;
  _nanoseconds: number;
};

export type TaskFormValues = {
  name: string;
  description?: string;
  dueDate?: Date | null;
};

export type OnSubmitTask = (
  data: TaskFormValues,
  mode: "edit" | "create",
  statusId: string,
  order: number,
  comments: Comment[],
  onOpenChange: (open: boolean) => void,
  setError: (error: string) => void,
  setLoading: (loading: boolean) => void
) => Promise<void>;

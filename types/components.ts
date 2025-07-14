import { Dispatch, SetStateAction } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

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

export interface Task {
  id: string;
  name: string;
  description?: string;
  statusId: string;
  dueDate?: string | null;
  order: number;
  createdBy: string;
  createdAt: CustomTimeStamp;
  updatedAt: CustomTimeStamp;
}

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

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  loading: boolean;
}

export type TaskModalHeaderProps = {
  title: string;
  mode: "edit" | "create";
  activeStatus: string;
  setActiveStatus: (statusId: string) => void;
  statuses: Status[];
  statusName: string;
};

export type TaskFormData = {
  name: string;
  description?: string;
  dueDate?: Date | undefined;
};

export type TaskModalInfoProps = {
  register: UseFormRegister<TaskFormData>;
  errors: Partial<FieldErrors<TaskFormData>>;
  dueDate?: Date | null | undefined;
  setValue: UseFormSetValue<TaskFormData>;
  task?: Task;
  mode: "create" | "edit";
};

export type TaskModalCommentFormProps = {
  newComment: string;
  setNewComment: (value: string) => void;
  addComment: () => void;
  loadingComments: boolean;
  comments: Comment[];
};

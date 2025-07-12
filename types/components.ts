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

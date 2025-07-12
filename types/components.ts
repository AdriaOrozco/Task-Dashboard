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
};

export type CreateOperationsType = {
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  handleCreateNewStatus: () => void;
};

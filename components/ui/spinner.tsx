import { SpinnerProps } from "@/types/components";

export function Spinner({ width = 32, height = 32 }: SpinnerProps) {
  return (
    <div
      aria-label="Loading"
      role="status"
      className="border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"
      style={{ width, height }}
    />
  );
}

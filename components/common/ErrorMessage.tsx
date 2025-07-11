import React from "react";

interface ErrorMessageProps {
  message?: string;
}

export function ErrorMessage({
  message = "An error occurred. Please try again later.",
}: ErrorMessageProps) {
  return (
    <div className="p-6 py-8 w-[300] bg-red-50 border border-red-700 text-red-700 rounded-md text-center flex flex-col items-center justify-evenly gap-2">
      <p className="text-lg font-semibold">Error</p>
      <p>{message}</p>
    </div>
  );
}

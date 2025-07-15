"use client";
import { Skeleton } from "../ui/skeleton";

export function StatusesSkeleton() {
  return (
    <div className="flex gap-4 px-4 py-2 overflow-x-auto h-calc-heade">
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          className="flex flex-col bg-gray-700 rounded-xl 
                     min-w-[320px] min-h-[340px] p-5 "
        >
          <Skeleton className="h-8 w-32 mb-4 rounded bg-gray-600" />
          <Skeleton className="flex-1 rounded-md bg-gray-800" />
        </Skeleton>
      ))}
    </div>
  );
}

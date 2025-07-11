"use client";

import { Skeleton } from "../ui/skeleton";

export function StatusesSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 p-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          className="flex flex-col bg-gray-100 rounded-xl 
                     min-w-[280px] min-h-[320px] p-5 "
        >
          <Skeleton className="h-8 w-32 mb-4 rounded bg-gray-300" />
          <Skeleton className="flex-1 rounded-md bg-gray-300" />
        </Skeleton>
      ))}
    </div>
  );
}

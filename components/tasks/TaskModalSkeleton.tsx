import { Skeleton } from "../ui/skeleton";

export default function TaskModalSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-5xl max-h-screen h-[80vh] flex flex-col md:flex-row overflow-hidden animate-pulse">
        <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-auto">
          <div className="h-8 bg-gray-600 rounded w-2/3" />

          <div className="space-y-4 mt-6">
            <Skeleton className="h-4 bg-gray-500 rounded w-1/4 mb-2" />
            <Skeleton className="h-10 bg-gray-600 rounded w-full" />

            <Skeleton className="h-4 bg-gray-500 rounded w-1/4 mb-2" />
            <Skeleton className="h-28 bg-gray-600 rounded w-full" />

            <Skeleton className="h-4 bg-gray-500 rounded w-1/4 mb-2" />
            <Skeleton className="h-10 bg-gray-600 rounded w-full" />
          </div>
        </div>

        <div className="w-full md:w-[340px] border-t md:border-t-0 md:border-l border-gray-700 p-4 md:p-6 flex flex-col gap-4">
          <Skeleton className="h-10 bg-gray-600 rounded w-full" />

          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 bg-gray-700 rounded w-3/4" />
                <Skeleton className="h-4 bg-gray-700 rounded w-full" />
                <Skeleton className="h-4 bg-gray-700 rounded w-5/6" />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-auto">
            <Skeleton className="h-10 w-28 bg-gray-600 rounded" />
            <Skeleton className="h-10 w-28 bg-gray-600 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

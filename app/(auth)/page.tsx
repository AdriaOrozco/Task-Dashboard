import { Suspense } from "react";
import { StatusesSkeleton } from "@/components/statuses/StatusesSkeleton";
import { Board } from "@/components/statuses/Board";

export default function BoardPage() {
  return (
    <Suspense fallback={<StatusesSkeleton />}>
      <Board />
    </Suspense>
  );
}

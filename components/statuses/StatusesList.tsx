"use client";

import { Status } from "@/types/components";

export function StatusesList({ statuses }: { statuses: Status[] }) {
  return (
    <main className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-6 p-4 min-h-[300px]">
      {statuses.map(({ id, name }) => (
        <section
          key={id}
          className="flex flex-col bg-gray-700 rounded-xl shadow-sm
                     min-h-[320px] p-5
                     border border-gray-700 hover:border-violet-600 transition cursor-pointer"
        >
          <h2 className="text-lg font-semibold text-gray-200 mb-4">{name}</h2>
          <div
            className="flex-1 border border-dashed border-gray-400 rounded-md
                       bg-gray-800
                       flex items-center justify-center
                       text-gray-400
                      "
          >
            <p className="italic">No tasks yet</p>
          </div>
        </section>
      ))}
    </main>
  );
}

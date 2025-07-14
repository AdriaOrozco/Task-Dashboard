import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
import { Status, TaskModalHeaderProps } from "@/types/components";

export default function TaskModalHeader({
  title,
  mode,
  activeStatus,
  setActiveStatus,
  statuses,
  statusName,
}: TaskModalHeaderProps) {
  return (
    <div className="flex gap-5 items-center mb-2 px-6 py-1 flex-shrink-0">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {mode === "edit" ? (
        <div className="relative">
          <select
            className="bg-gray-600 text-gray-300 px-4 py-2 pr-10 rounded-full cursor-pointer appearance-none focus:outline-none"
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value)}
          >
            {statuses.map((status: Status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-300 font-medium bg-gray-600 px-3 py-1 rounded-full self-center">
          Status: {statusName}
        </div>
      )}
    </div>
  );
}

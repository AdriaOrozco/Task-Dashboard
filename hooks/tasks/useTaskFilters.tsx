import { useState, useMemo } from "react";
import { FilterEvent, Filters, Task } from "@/types/components";
import { firebaseTimestampToLocalDateString } from "@/lib/utils";
import { toast } from "sonner";

export function useTasksFilters({ tasks }: { tasks: Task[] }) {
  const [filters, setFilters] = useState<Filters>({
    searchText: "",
    dueDate: "",
    statusId: "",
    createdBy: "",
    createdAt: "",
  });

  const [orderBy, setOrderBy] = useState<"order" | "createdBy" | "name">(
    "order"
  );
  const creators = Array.from(
    new Set(tasks.map((task) => task.createdBy))
  ).filter(Boolean);

  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter((task: Task) => {
      if (
        filters.searchText &&
        !(
          task.name.toLowerCase().includes(filters.searchText.toLowerCase()) ||
          (task.description &&
            task.description
              .toLowerCase()
              .includes(filters.searchText.toLowerCase()))
        )
      )
        return false;
      if (filters.dueDate) {
        if (!task.dueDate) return false;
        if (typeof task.dueDate == "string") {
          if (task.dueDate.slice(0, 10) !== filters.dueDate) return false;
        } else if (
          firebaseTimestampToLocalDateString(task.dueDate) !== filters.dueDate
        )
          return false;
      }

      if (filters.statusId && task.statusId !== filters.statusId) return false;

      if (filters.createdBy && task.createdBy !== filters.createdBy)
        return false;

      if (
        filters.createdAt &&
        task.createdAt &&
        new Date(task.createdAt._seconds * 1000).toISOString().slice(0, 10) !==
          filters.createdAt
      )
        return false;

      return true;
    });
    if (orderBy === "order") {
      return filtered.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    if (orderBy === "name") {
      return filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
    }
    if (orderBy === "createdBy") {
      return filtered
        .slice()
        .sort((a, b) => a.createdBy.localeCompare(b.createdBy));
    }

    return filtered;
  }, [tasks, filters, orderBy]);

  const onChangeFilter = (e: FilterEvent) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchText: "",
      dueDate: "",
      statusId: "",
      createdBy: "",
      createdAt: "",
    });
    setOrderBy("order");
    toast.success("Filters have been reset");
  };

  return {
    filteredTasks,
    onChangeFilter,
    creators,
    orderBy,
    setOrderBy,
    filters,
    resetFilters,
  };
}

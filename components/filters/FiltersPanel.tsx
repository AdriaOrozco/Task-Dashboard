"use client";
import React, { useState } from "react";
import { FiltersModal } from "./FiltersModal";
import { FiltersButtonModalProps } from "@/types/components";

export function FiltersPanel({
  statuses,
  creators,
  filters,
  resetFilters,
  orderBy,
  setOrderBy,
  onChangeFilter,
}: FiltersButtonModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end gap-3 px-4 pt-2">
        <button
          onClick={() => setOpen(true)}
          className="px-3 rounded bg-indigo-600 text-white hover:bg-indigo-700 w-45 h-10 cursor-pointer"
        >
          Filters
        </button>
        <button
          onClick={resetFilters}
          className="h-10 px-3 rounded border border-gray-400 text-gray-300 hover:bg-gray-300 hover:text-gray-900 font-medium w-45 transition cursor-pointer"
        >
          Reset filters
        </button>
      </div>

      {open && (
        <FiltersModal
          open={open}
          setOpen={setOpen}
          filters={filters}
          onChangeFilter={onChangeFilter}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          statuses={statuses}
          creators={creators}
        />
      )}
    </>
  );
}

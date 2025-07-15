"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { cn, toLocalDateString } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { FiltersDialogProps, OrderBy } from "@/types/components";
import { toast } from "sonner";

export function FiltersModal({
  open,
  setOpen,
  filters,
  onChangeFilter,
  orderBy,
  setOrderBy,
  statuses,
  creators,
}: FiltersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gray-700 text-gray-100 rounded-lg max-w-md w-full p-6 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Filters applied successfully");
            setOpen(false);
          }}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Apply filters to search tasks</DialogDescription>
          </DialogHeader>

          <div>
            <Label className="mb-2 block" htmlFor="searchText">
              Search by name or description
            </Label>
            <Input
              className="bg-gray-800 border-gray-600 text-white"
              id="searchText"
              name="searchText"
              type="text"
              value={filters.searchText}
              onChange={onChangeFilter}
              placeholder="Texto..."
            />
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-white mb-2">
              Due date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border border-gray-600 text-white",
                    {
                      "text-gray-400": !filters.dueDate,
                    }
                  )}
                >
                  {filters.dueDate
                    ? format(new Date(filters.dueDate), "PPP")
                    : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white text-black"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={
                    filters.dueDate ? new Date(filters.dueDate) : undefined
                  }
                  onSelect={(date) => {
                    if (!date) return;
                    onChangeFilter({
                      target: {
                        name: "dueDate",
                        value: toLocalDateString(date),
                      },
                    });
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="mb-2 block" htmlFor="statusId">
              Estatus
            </Label>
            <Select
              value={filters.statusId || "all"}
              onValueChange={(value) =>
                onChangeFilter({
                  target: {
                    name: "statusId",
                    value: value === "all" ? "" : value,
                  },
                })
              }
            >
              <SelectTrigger
                id="statusId"
                className="w-full bg-gray-800 border-gray-600 text-white"
              >
                <SelectValue placeholder="-- All --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-- All --</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block" htmlFor="createdBy">
              Created By
            </Label>
            <Select
              value={filters.createdBy || "all"}
              onValueChange={(value) =>
                onChangeFilter({
                  target: {
                    name: "createdBy",
                    value: value === "all" ? "" : value,
                  },
                })
              }
            >
              <SelectTrigger
                id="createdBy"
                className="w-full bg-gray-800 border-gray-600 text-white"
              >
                <SelectValue placeholder="-- All --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-- All --</SelectItem>
                {creators.map((creator) => (
                  <SelectItem key={creator} value={creator}>
                    {creator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-white">Creation date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white cursor-pointer",
                    {
                      "text-gray-400": !filters.createdAt,
                    }
                  )}
                >
                  {filters.createdAt
                    ? format(new Date(filters.createdAt), "PPP")
                    : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white text-black"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={
                    filters.createdAt ? new Date(filters.createdAt) : undefined
                  }
                  onSelect={(date) => {
                    if (!date) return;
                    onChangeFilter({
                      target: {
                        name: "createdAt",
                        value: toLocalDateString(date),
                      },
                    });
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="mb-2 block" htmlFor="orderBy">
              Ordenar by
            </Label>
            <Select
              value={orderBy}
              onValueChange={(value) => setOrderBy(value as OrderBy)}
            >
              <SelectTrigger
                id="orderBy"
                className="w-full bg-gray-800 border-gray-600 text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order">Orden</SelectItem>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="createdBy">Creado por</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Apply
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

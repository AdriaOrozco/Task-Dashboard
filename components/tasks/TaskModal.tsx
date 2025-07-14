"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTaskForm } from "@/hooks/tasks/useTaskForm";
import { TaskModalProps } from "@/types/components";
import { Spinner } from "../ui/spinner";
import { Skeleton } from "../ui/skeleton";

export function TaskModal({
  open,
  onOpenChange,
  title,
  statusName,
  mode,
  order,
  statusId,
  createTask,
  task,
}: TaskModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    newComment,
    setNewComment,
    onSubmit,
    addComment,
    comments,
    dueDate,
    loading,
    error,
    loadingComments,
  } = useTaskForm({
    mode,
    onOpenChange,
    statusId,
    order,
    createTask,
    task,
  });

  //TODO -> Refactor to separate components

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-w-full max-h-[90vh] bg-gray-700 text-white flex flex-col rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex gap-5 items-center mb-2 px-6 py-1 flex-shrink-0">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-300 font-medium bg-gray-600 px-3 py-1 rounded-full self-center">
            Status: {statusName}
          </div>
        </div>

        <form
          id="task-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-6 px-6 flex-grow overflow-auto min-h-0"
        >
          {/* Left: nombre, descripción, fechas, asignación */}
          <div className="flex-1 space-y-4 min-w-0">
            <div>
              <Label className="text-white mb-2">Task name</Label>
              <Input
                className="bg-gray-800 border-gray-600 text-white"
                {...register("name", { required: "Task name is required" })}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-white mb-2">Description</Label>
              <Textarea
                className="bg-gray-800 border-gray-600 text-white h-[125px] resize-none"
                {...register("description")}
                placeholder="Describe the task..."
                rows={4}
              />
            </div>

            <div>
              <Label className="text-white mb-2">Due date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white cursor-pointer",
                      {
                        "text-gray-400": !dueDate,
                      }
                    )}
                  >
                    {dueDate ? format(dueDate, "PPP") : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white text-black"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => setValue("dueDate", date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-gray-600 mx-4" />

          {/* Comments */}
          <div className="flex-1 space-y-2 min-w-0">
            <Label className="text-white">Comments</Label>

            {/* Input de nuevo comentario */}
            <div className="flex gap-2 items-center">
              <Input
                className="bg-gray-800 border-gray-600 text-white"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addComment();
                  }
                }}
              />
              <Button
                variant="secondary"
                className="h-8"
                onClick={(e) => {
                  e.preventDefault();
                  addComment();
                }}
              >
                Post
              </Button>
            </div>

            {/* Comments list */}
            <div className="max-h-57 overflow-auto pr-2 space-y-3">
              {loadingComments ? (
                <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 bg-gray-700 rounded w-3/4" />
                      <Skeleton className="h-4 bg-gray-700 rounded w-full" />
                      <Skeleton className="h-4 bg-gray-700 rounded w-5/6" />
                    </div>
                  ))}
                </div>
              ) : null}
              {comments?.length
                ? comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">
                          {comment.authorEmail}
                        </span>
                        <span>
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-100">{comment.text}</p>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-700 rounded-b-lg flex justify-end gap-4 px-6 flex-shrink-0 items-center">
          {loading ? (
            <Spinner width={20} height={20} />
          ) : (
            <>
              {" "}
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-10 px-4 text-black hover:bg-gray-300 cursor-pointer flex items-center justify-center"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="task-form"
                className="h-11 px-4 w-20 cursor-pointer flex items-center justify-center"
              >
                Save
              </Button>
            </>
          )}
        </div>
        {error && (
          <div className=" flex justify-end">
            <p className="text-red-500 text-sm text-right">{error}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

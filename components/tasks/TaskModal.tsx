"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useTaskForm } from "@/hooks/tasks/useTaskForm";
import { TaskModalProps } from "@/types/components";
import { Spinner } from "../ui/spinner";
import TaskModalHeader from "./TaskModalHeader";
import TaskModalInfoForm from "./TaskModalInfoForm";
import TaskModalCommentsForm from "./TaskModalCommentsForm";

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
    statuses,
    activeStatus,
    setActiveStatus,
  } = useTaskForm({
    mode,
    onOpenChange,
    statusId,
    order,
    createTask,
    task,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-w-full max-h-[90vh] bg-gray-700 text-white flex flex-col rounded-lg overflow-hidden">
        <TaskModalHeader
          title={title}
          mode={mode}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          statuses={statuses}
          statusName={statusName}
        ></TaskModalHeader>

        <form
          id="task-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-6 px-6 flex-grow overflow-auto min-h-0"
        >
          <TaskModalInfoForm
            register={register}
            errors={errors}
            dueDate={dueDate}
            setValue={setValue}
          />

          <div className="w-px bg-gray-600 mx-4" />

          {/* Comments */}
          <TaskModalCommentsForm
            newComment={newComment}
            setNewComment={setNewComment}
            addComment={addComment}
            loadingComments={loadingComments}
            comments={comments}
          />
        </form>

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

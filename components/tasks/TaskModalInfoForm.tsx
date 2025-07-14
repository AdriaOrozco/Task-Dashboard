import * as React from "react";
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
import { can, cn } from "@/lib/utils";

import { TaskModalInfoProps } from "@/types/components";
import { useSession } from "next-auth/react";

export default function TaskModalInfoForm({
  register,
  errors,
  dueDate,
  setValue,
  task,
  mode,
}: TaskModalInfoProps) {
  const { data: session } = useSession();

  const getDisableRule = () => {
    if (mode !== "edit") return false;
    if (!session?.user?.role || !session.user.email) return true;
    return !can(session.user.role, "update_self", {
      userId: session.user.email,
      resourceOwnerId: task?.createdBy ?? "",
    });
  };
  return (
    <div className="flex-1 space-y-4 min-w-0">
      <div>
        <Label className="text-white mb-2">Task name</Label>
        <Input
          disabled={getDisableRule()}
          className="bg-gray-800 border-gray-600 text-white"
          {...register("name", { required: "Task name is required" })}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label className="text-white mb-2">Description</Label>
        <Textarea
          disabled={getDisableRule()}
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
              disabled={getDisableRule()}
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
              selected={dueDate ?? undefined}
              onSelect={(date) => setValue("dueDate", date)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

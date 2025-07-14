import { z } from "zod";

export const taskFormSchema = z.object({
  name: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  dueDate: z.date().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

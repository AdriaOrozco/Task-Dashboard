import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["Admin", "Worker"], "Selecciona un rol válido"),
});

export type RegisterValues = z.infer<typeof registerSchema>;

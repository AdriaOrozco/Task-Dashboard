"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleSelector } from "./RoleSelector";
import { z } from "zod";
import { registerSchema } from "@/schemas/registerSchema";

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { role: "Worker" },
  });

  const onSubmit = (data: RegisterValues) => {
    console.log("Register", data);
  };

  // Sync RoleSelector status with react-hook-form
  const role = watch("role");
  useEffect(() => {
    register("role");
  }, [register]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg space-y-2 p-6 rounded-2xl bg-zinc-800"
    >
      <h2 className="text-2xl font-bold mb-4 tracking-tight text-white">
        Register
      </h2>

      <div className="space-y-2">
        <Label htmlFor="register-email" className="text-base font-medium">
          Email
        </Label>
        <Input
          id="register-email"
          type="email"
          placeholder="correo@ejemplo.com"
          {...register("email")}
          aria-invalid={!!errors.email && isSubmitted}
          className="shadow-inner bg-zinc-700 border border-zinc-600 focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p className="text-red-500 text-sm min-h-1">
          {errors.email && isSubmitted ? errors.email.message : "\u00A0"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password" className="text-base font-medium">
          Password
        </Label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          aria-invalid={!!errors.password && isSubmitted}
          className="shadow-inner bg-zinc-700 border border-zinc-600 focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p className="text-red-500 text-sm min-h-1">
          {errors.password && isSubmitted ? errors.password.message : "\u00A0"}
        </p>
      </div>

      <RoleSelector value={role} onChange={(r) => setValue("role", r)} />
      <p className="text-red-500 text-sm min-h-1">
        {errors.email && isSubmitted ? errors.email.message : "\u00A0"}
      </p>

      <Button
        type="submit"
        className="w-full h-14 text-lg font-semibold hover:bg-indigo-600 transition cursor-pointer"
      >
        Sign up
      </Button>
    </form>
  );
}

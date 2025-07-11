"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleSelector } from "./RoleSelector";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { Spinner } from "../ui/spinner";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    isSubmitted,
    onSubmit,
    role,
    loading,
    errorMessage,
  } = useRegisterForm();

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
      {loading ? (
        <div className="flex justify-center py-3">
          <Spinner />
        </div>
      ) : (
        <Button
          type="submit"
          className="w-full h-14 text-lg font-semibold hover:bg-indigo-600 transition cursor-pointer"
        >
          Sign up
        </Button>
      )}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
}

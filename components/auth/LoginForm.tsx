"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginValues } from "@/schemas/loginSchema";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: LoginValues) => {
    console.log("Login", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg space-y-2 p-6 rounded-2xl bg-zinc-800"
    >
      <h2 className="text-2xl font-bold mb-4 tracking-tight text-white">
        Login
      </h2>

      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-base font-medium">
          Email
        </Label>
        <Input
          id="login-email"
          type="email"
          placeholder="email@example.com"
          {...register("email")}
          aria-invalid={!!errors.email}
          required
          className="shadow-inner bg-zinc-700 border border-zinc-600 focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p className="text-red-500 text-sm min-h-1">
          {errors.email && isSubmitted ? errors.email.message : "\u00A0"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-base font-medium">
          Password
        </Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          aria-invalid={!!errors.password}
          required
          className="shadow-inner bg-zinc-700 border border-zinc-600 focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p className="text-red-500 text-sm min-h-1">
          {errors.password && isSubmitted ? errors.password.message : "\u00A0"}
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-14 text-lg font-semibold hover:bg-indigo-600 transition cursor-pointer"
      >
        Sign in
      </Button>
    </form>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { registerSchema, RegisterValues } from "@/schemas/registerSchema";
import { loginUser } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function useRegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { role: "Worker" },
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: RegisterValues) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error ||
            "Something went wrong while registering your account. Please try again."
        );
      }
      await loginUser(
        data.email,
        data.password,
        setErrorMessage,
        setLoading,
        router
      );
      //Reset form values
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Something went wrong while registering your account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Sync RoleSelector status with react-hook-form
  const role = watch("role");
  useEffect(() => {
    register("role");
  }, [register]);

  return {
    register,
    handleSubmit,
    setValue,
    errors,
    isSubmitted,
    onSubmit,
    role,
    loading,
    errorMessage,
  };
}

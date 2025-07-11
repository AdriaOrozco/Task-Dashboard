import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginValues } from "@/schemas/loginSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/utils";

export function useLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (data: LoginValues) => {
    await loginUser(
      data.email,
      data.password,
      setErrorMessage,
      setLoading,
      router
    );
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitted,
    onSubmit,
    loading,
    errorMessage,
  };
}

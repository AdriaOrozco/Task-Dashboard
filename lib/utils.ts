import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { signIn } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function loginUser(
  email: string,
  password: string,
  setErrorMessage: (msg: string | null) => void,
  setLoading: (loading: boolean) => void,
  router: AppRouterInstance
) {
  setLoading(true);
  setErrorMessage(null);
  try {
    const res = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (res?.error) {
      setErrorMessage("Invalid email or password");
    } else {
      router.push("/");
    }
  } catch (error) {
    if (error instanceof Error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage(
        "Unexpected error occurred during login. Please try again."
      );
    }
  } finally {
    setLoading(false);
  }
}

export function getDragStyle(isDragging: boolean): string {
  return isDragging
    ? "opacity-90 shadow-2xl scale-[1.03] z-50 ring-4 ring-violet-500"
    : "";
}

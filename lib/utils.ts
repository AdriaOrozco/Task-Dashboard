import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { signIn } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { CustomTimeStamp } from "@/types/components";
import { Permission, Role, rolePermissions } from "@/types/permissions";

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
export function timestampToDate(timestamp: CustomTimeStamp): string {
  const milliseconds =
    timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1e6);
  return new Date(milliseconds).toDateString();
}
export function can(
  role: Role,
  action: Permission,
  options?: { userId?: string; resourceOwnerId?: string }
): boolean {
  const permissions = rolePermissions[role] ?? [];

  if (permissions.includes("*")) {
    return true;
  }

  const selfActions: Permission[] = ["update_self", "delete_self"];
  if (selfActions.includes(action)) {
    if (
      permissions.includes(action) &&
      options?.userId &&
      options?.resourceOwnerId &&
      options.userId === options.resourceOwnerId
    ) {
      return true;
    } else {
      return false;
    }
  }

  return permissions.includes(action);
}

export const toLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function firebaseTimestampToLocalDateString(timestamp: {
  _seconds: number;
  _nanoseconds: number;
}): string {
  const date = new Date(timestamp._seconds * 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

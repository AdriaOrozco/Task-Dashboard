import { NextResponse } from "next/server";
import { can } from "./utils";
import { Permission, Role } from "@/types/permissions";

export function requirePermission(
  role: Role,
  permission: Permission
): NextResponse | null {
  if (!can(role, permission)) {
    return NextResponse.json(
      { error: "You do not have permission to perform this action" },
      { status: 403 }
    );
  }

  return null;
}

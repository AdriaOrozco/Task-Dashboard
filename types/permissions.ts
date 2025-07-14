export type Role = "Admin" | "Worker";

export type Permission =
  | "create_task"
  | "delete_self"
  | "create_comment"
  | "read"
  | "update_self"
  | "create_status"
  | "update_status"
  | "delete_status"
  | "drag_and_drop"
  | "*";

export const rolePermissions: Record<Role, Permission[]> = {
  Admin: ["*"],
  Worker: [
    "create_task",
    "create_comment",
    "read",
    "update_self",
    "delete_self",
  ],
};

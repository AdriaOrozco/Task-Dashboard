"use client";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const roles = ["Admin", "Worker"] as const;
type Role = "Admin" | "Worker";

export function RoleSelector({
  value,
  onChange,
}: {
  value: Role;
  onChange: (role: Role) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">Role</Label>
      <div className="flex gap-4">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            aria-pressed={value === role}
            onClick={() => onChange(role)}
            className={cn(
              "w-32 px-4 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer",
              value === role
                ? "bg-blue-600 border-blue-400 text-white shadow-md"
                : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            )}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}

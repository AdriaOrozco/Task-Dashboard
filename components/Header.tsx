"use client";
import { signOut, useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full min-h-[73px] border-b border-zinc-700 p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">My Dashboard</h1>
      {session && (
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition cursor-pointer"
        >
          Logout
        </button>
      )}
    </header>
  );
}

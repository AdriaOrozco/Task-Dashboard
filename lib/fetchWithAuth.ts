import { cookies } from "next/headers";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("next-auth.session-token");

  const headers = new Headers(options.headers);
  if (cookie) {
    headers.set("Cookie", `next-auth.session-token=${cookie.value}`);
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/${url}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  return res.json();
}

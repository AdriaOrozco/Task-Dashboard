import { cookies } from "next/headers";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("next-auth.session-token") ??
    cookieStore.get("__Secure-next-auth.session-token");

  if (!token) {
    throw new Error("No session token found");
  }

  const headers = new Headers(options.headers);
  headers.set("Cookie", `${token.name}=${token.value}`);
  console.log(`${process.env.NEXT_PUBLIC_APP_URL}/${url}`);

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/${url}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  return res.json();
}

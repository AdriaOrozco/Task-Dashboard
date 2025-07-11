import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Task Dashboard",
  description: "A dashboard for managing tasks efficiently",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-white antialiased">{children}</body>
    </html>
  );
}

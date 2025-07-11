import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - My Task Dashboard",
  description: "Login to access your task dashboard",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

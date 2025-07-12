import { Header } from "@/components/Header";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProviderWrapper>
      <Header />
      {children}
      <Toaster position="top-center" richColors />
    </SessionProviderWrapper>
  );
}

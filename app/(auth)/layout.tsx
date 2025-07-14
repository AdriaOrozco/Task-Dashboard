import { Header } from "@/components/Header";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <SessionProviderWrapper>
      <Header />
      {children}
      {modal}
      <Toaster position="top-center" richColors />
    </SessionProviderWrapper>
  );
}

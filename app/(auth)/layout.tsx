import { Header } from "@/components/Header";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProviderWrapper>
      <Header />
      {children}
    </SessionProviderWrapper>
  );
}

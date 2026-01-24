import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import { AppLayout } from "@/components/app-layout";
import { Toaster } from "@/components/ui/sonner";

const interSans = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "Production-grade inventory control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ fontFamily: interSans }}>
        <Providers>
          <AppLayout>{children}</AppLayout>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}

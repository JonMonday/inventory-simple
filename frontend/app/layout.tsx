import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import Providers from "@/components/providers";

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
    <html lang="en">
      <body style={{ fontFamily: interSans }}>
        <Providers>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 min-h-screen bg-background">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

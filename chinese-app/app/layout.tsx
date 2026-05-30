import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Học tiếng Trung",
  description: "Ứng dụng học tiếng Trung với Spaced Repetition",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col bg-[#f8f9fb]">
        <NavBar />
        <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">{children}</main>
      </body>
    </html>
  );
}

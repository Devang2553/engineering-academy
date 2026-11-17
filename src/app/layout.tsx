import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { BottomNav, NavBar } from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Engineering Academy",
  description: "Deadline-driven engineering curriculum, notes and interview preparation.",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#131412" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <main className="mx-auto w-full max-w-2xl px-4 pt-5 pb-28 sm:px-6">{children}</main>
        <Suspense fallback={<NavBar path={null} />}><BottomNav /></Suspense>
      </body>
    </html>
  );
}

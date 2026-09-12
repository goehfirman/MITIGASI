import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toothpick Tower — Lab Gempa",
  description: "Laboratorium STEM 3D untuk membangun menara dan menguji guncangan di Papan Interaktif Digital.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}


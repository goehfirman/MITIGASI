import type { Metadata } from "next";
import "./globals.css";
import ViewportFit from './viewport-fit';
import AudioPlayer from '@/components/audio-player';

export const metadata: Metadata = {
  title: "Mengenal Kondisi Geografis Indonesia (Manfaat dan Ancaman)",
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
      <body className="antialiased">
        <ViewportFit>{children}</ViewportFit>
        <AudioPlayer />
      </body>
    </html>
  );
}


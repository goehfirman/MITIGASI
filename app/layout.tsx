import type { Metadata } from "next";
import "./globals.css";
import ViewportFit from './viewport-fit';
import AudioPlayer from '@/components/audio-player';
import PageTransition from '@/components/page-transition';

export const metadata: Metadata = {
  title: "Sigap Gempa",
  description: "Laboratorium STEM 3D untuk membangun menara dan menguji guncangan di Papan Interaktif Digital.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/stem-logo.png",
    shortcut: "/stem-logo.png",
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
        <ViewportFit>
          <PageTransition>{children}</PageTransition>
        </ViewportFit>
        <AudioPlayer />
      </body>
    </html>
  );
}

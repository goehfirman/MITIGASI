"use client";
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

/**
 * PageTransition — plays a fade-in animation whenever the route changes.
 * Simple and reliable: just re-keys the wrapper on pathname change so CSS
 * animation replays on every navigation.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="page-fade-in"
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </div>
  );
}

'use client';

import './globals.css';
import { ThawProvider } from '@/lib/store';
import { ToastProvider } from '@/components/ui/toast';
import { LibraryShell } from '@/components/LibraryShell';

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThawProvider>
      <ToastProvider>
        <LibraryShell>{children}</LibraryShell>
      </ToastProvider>
    </ThawProvider>
  );
}

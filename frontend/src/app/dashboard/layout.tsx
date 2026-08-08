'use client';

import Sidebar from '@/components/Sidebar';
import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

function DashboardContent({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!session) {
    return <div className="flex items-center justify-center h-screen">Unauthorized</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <DashboardContent>{children}</DashboardContent>
    </SessionProvider>
  );
}

'use client';

import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

// Note: Metadata can't be used in client components, but Next.js handles it automatically

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

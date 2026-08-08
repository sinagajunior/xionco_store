import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Xionco Store - Admin Panel',
  description: 'Store management admin panel for Xionco',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}

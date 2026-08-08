'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => pathname.startsWith(href);

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/products', label: 'Products' },
    { href: '/dashboard/stock', label: 'Stock' },
    { href: '/dashboard/sales', label: 'Sales' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold">Xionco Store</h2>
        <p className="text-sm text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive(link.href)
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-gray-800">
        <div className="text-sm mb-4">
          <p className="text-gray-400">Logged in as</p>
          <p className="text-white font-medium">{session?.user?.name || 'User'}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

'use client';

import { signOut, useSession } from 'next-auth/react';

export default function TopNav() {
  const { data: session } = useSession();

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-end items-center gap-4">
      <div className="text-right">
        <p className="text-sm text-gray-600">Logged in as</p>
        <p className="font-medium text-gray-900">{session?.user?.name || 'User'}</p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
}

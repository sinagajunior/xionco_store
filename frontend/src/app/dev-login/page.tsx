'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function DevLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDevLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Use NextAuth's credentials provider for dev login
      const result = await signIn('credentials', {
        redirect: false,
        username: '',
        password: '',
      });

      if (result?.ok) {
        // Redirect to dashboard after successful login
        window.location.href = '/dashboard';
      } else {
        setError('Dev login failed: ' + (result?.error || 'Unknown error'));
        setLoading(false);
      }
    } catch (error) {
      console.error('Dev login error:', error);
      setError('Error during dev login: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Xionco Store
        </h1>
        <p className="text-center text-red-600 mb-4 font-semibold">
          ⚠️ DEVELOPMENT LOGIN - TEST ONLY
        </p>
        <p className="text-center text-gray-600 mb-8">
          Admin Panel
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleDevLogin}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition"
          >
            {loading ? 'Logging in...' : 'Dev Login (Bypass OAuth)'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <a
            href="/login"
            className="w-full block text-center bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 px-4 rounded-lg font-medium transition"
          >
            Back to OAuth Login
          </a>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Dev Mode:</strong> This is a development login bypass.
            In production, use real OAuth (Google/Facebook) authentication.
          </p>
        </div>
      </div>
    </div>
  );
}

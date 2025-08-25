'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { Download, RefreshCw, LogOut, Shield } from 'lucide-react';
import { Session } from 'next-auth';

interface HeaderProps {
  onRefresh: () => void;
  loading: boolean;
  session: Session | null;
}

export default function Header({ onRefresh, loading, session }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Torrent Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download and manage your torrent files
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session?.user.role === 'admin' && (
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Torrent } from '@/types/torrent';
import TorrentCard from '@/components/TorrentCard';
import SearchBar from '@/components/SearchBar';
import ThemeToggle from '@/components/ThemeToggle';
import { Download, Folder, RefreshCw, LogOut, Shield } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [filteredTorrents, setFilteredTorrents] = useState<Torrent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  const fetchTorrents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/torrents');
      if (!response.ok) {
        throw new Error('Failed to fetch torrents');
      }
      const data = await response.json();
      setTorrents(data.torrents);
      setFilteredTorrents(data.torrents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTorrents();
  }, []);

  useEffect(() => {
    const filtered = torrents.filter(torrent =>
      torrent.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      torrent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTorrents(filtered);
  }, [searchTerm, torrents]);

  const handleDownload = async (torrent: Torrent) => {
    try {
      const response = await fetch(torrent.downloadUrl);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = torrent.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
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
                onClick={fetchTorrents}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Folder className="h-4 w-4" />
            <span>
              {filteredTorrents.length} of {torrents.length} torrents
            </span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading torrents...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <Download className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium">Error loading torrents</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={fetchTorrents}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredTorrents.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No torrents found' : 'No torrents available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Add some .torrent files to the public/torrents folder to get started'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTorrents.map((torrent) => (
              <TorrentCard
                key={torrent.name}
                torrent={torrent}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

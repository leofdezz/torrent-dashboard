'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Torrent } from '@/types/torrent';
import { useTorrents } from '@/hooks/useTorrents';
import Header from '@/components/layout/Header';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/torrents/LoadingSpinner';
import ErrorMessage from '@/components/torrents/ErrorMessage';
import EmptyState from '@/components/torrents/EmptyState';
import TorrentList from '@/components/torrents/TorrentList';
import { Folder } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    torrents,
    filteredTorrents,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    fetchTorrents,
  } = useTorrents();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

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

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage error={error} onRetry={fetchTorrents} />;
    }

    if (filteredTorrents.length === 0) {
      return <EmptyState searchTerm={searchTerm} />;
    }

    return <TorrentList torrents={filteredTorrents} onDownload={handleDownload} />;
  };

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header onRefresh={fetchTorrents} loading={loading} session={session} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Folder className="h-4 w-4" />
            <span>
              {filteredTorrents.length} of {torrents.length} torrents
            </span>
          </div>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}

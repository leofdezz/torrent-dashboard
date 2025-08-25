import { useState, useEffect, useMemo } from 'react';
import { Torrent } from '@/types/torrent';

export function useTorrents() {
  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTorrents();
  }, []);

  const filteredTorrents = useMemo(() => {
    return torrents.filter(torrent =>
      torrent.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      torrent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, torrents]);

  return {
    torrents,
    filteredTorrents,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    fetchTorrents,
  };
}

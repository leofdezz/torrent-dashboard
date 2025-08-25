'use client';

import { Torrent } from '@/types/torrent';
import { Download, Calendar, HardDrive } from 'lucide-react';
import { formatDate, formatFileSize } from '@/lib/utils';

interface TorrentCardProps {
  torrent: Torrent;
  onDownload: (torrent: Torrent) => void;
}

export default function TorrentCard({ torrent, onDownload }: TorrentCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1 mr-4">
            {torrent.displayName}
          </h3>
          <button
            onClick={() => onDownload(torrent)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm group-hover:scale-105 transform"
          >
            <Download size={16} />
            Download
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <HardDrive size={14} />
            <span>{formatFileSize(torrent.size)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(torrent.dateAdded)}</span>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-500 font-mono bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-md">
          {torrent.name}
        </div>
      </div>
    </div>
  );
}

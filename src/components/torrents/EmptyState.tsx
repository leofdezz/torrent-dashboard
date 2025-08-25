import { Folder } from 'lucide-react';

interface EmptyStateProps {
  searchTerm: string;
}

export default function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Folder className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {searchTerm ? 'No torrents found' : 'No torrents available'}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {searchTerm
          ? 'Try adjusting your search terms'
          : 'Add some .torrent files to the public/torrents folder to get started'}
      </p>
    </div>
  );
}

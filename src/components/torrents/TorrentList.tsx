import { Torrent } from '@/types/torrent';
import TorrentCard from '@/components/TorrentCard';

interface TorrentListProps {
  torrents: Torrent[];
  onDownload: (torrent: Torrent) => void;
}

export default function TorrentList({ torrents, onDownload }: TorrentListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {torrents.map((torrent) => (
        <TorrentCard
          key={torrent.name}
          torrent={torrent}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}

import { Download } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className="text-center py-12">
      <div className="text-red-600 dark:text-red-400 mb-4">
        <Download className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p className="text-lg font-medium">Error loading torrents</p>
        <p className="text-sm">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

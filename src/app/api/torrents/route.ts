import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const torrentsDir = path.join(process.cwd(), 'public', 'torrents');
    
    try {
      await fs.access(torrentsDir);
    } catch {
      await fs.mkdir(torrentsDir, { recursive: true });
    }

    const files = await fs.readdir(torrentsDir);
    const torrentFilesPromises = files
      .filter(file => file.endsWith('.torrent'))
      .map(async (file) => {
        const filePath = path.join(torrentsDir, file);
        const stats = await fs.stat(filePath);
        
        return {
          name: file,
          displayName: file.replace(/\.torrent$/, '').replace(/[._-]/g, ' '),
          size: stats.size,
          dateAdded: stats.birthtime,
          downloadUrl: `/api/download/${encodeURIComponent(file)}`
        };
      });

    const torrentFiles = await Promise.all(torrentFilesPromises);
    torrentFiles.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());

    return NextResponse.json({ torrents: torrentFiles });
  } catch (error) {
    console.error('Error fetching torrents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch torrents' },
      { status: 500 }
    );
  }
}

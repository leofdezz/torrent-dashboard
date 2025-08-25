import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const torrentsDir = path.join(process.cwd(), 'public', 'torrents');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(torrentsDir)) {
      fs.mkdirSync(torrentsDir, { recursive: true });
    }

    const files = fs.readdirSync(torrentsDir);
    const torrentFiles = files
      .filter(file => file.endsWith('.torrent'))
      .map(file => {
        const filePath = path.join(torrentsDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          name: file,
          displayName: file.replace('.torrent', '').replace(/[._-]/g, ' '),
          size: stats.size,
          dateAdded: stats.birthtime,
          downloadUrl: `/api/download/${encodeURIComponent(file)}`
        };
      })
      .sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());

    return NextResponse.json({ torrents: torrentFiles });
  } catch (error) {
    console.error('Error fetching torrents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch torrents' },
      { status: 500 }
    );
  }
}

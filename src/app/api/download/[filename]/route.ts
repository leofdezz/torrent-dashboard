import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(process.cwd(), 'public', 'torrents', decodedFilename);

    // Check if file exists and is a torrent file
    if (!fs.existsSync(filePath) || !decodedFilename.endsWith('.torrent')) {
      return NextResponse.json(
        { error: 'Torrent file not found' },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    const stats = fs.statSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-bittorrent',
        'Content-Disposition': `attachment; filename="${decodedFilename}"`,
        'Content-Length': stats.size.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading torrent:', error);
    return NextResponse.json(
      { error: 'Failed to download torrent' },
      { status: 500 }
    );
  }
}

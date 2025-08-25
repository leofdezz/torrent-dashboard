# Torrent Dashboard

A modern, responsive web application for managing and downloading torrent files with a beautiful UI/UX built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Modern Dashboard UI** - Clean, responsive design with dark/light theme support
- **Torrent File Management** - Automatically scans and displays .torrent files from the `public/torrents/` folder
- **Search & Filter** - Real-time search functionality to find torrents quickly
- **One-Click Downloads** - Download torrent files directly from the browser
- **File Information** - Display file size, date added, and formatted names
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Dark Mode** - Toggle between light and dark themes with system preference detection

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Add your torrent files to the `public/torrents/` folder
4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding Torrent Files

1. Place your `.torrent` files in the `public/torrents/` directory
2. The dashboard will automatically detect and display them
3. Use the refresh button to reload the torrent list after adding new files

### Downloading Torrents

1. Browse the available torrents on the dashboard
2. Use the search bar to find specific torrents
3. Click the "Download" button on any torrent card
4. The torrent file will be downloaded to your default downloads folder

## Project Structure

```
torrent-dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── torrents/route.ts      # API endpoint to list torrents
│   │   │   └── download/[filename]/route.ts  # API endpoint for downloads
│   │   └── page.tsx                   # Main dashboard page
│   ├── components/
│   │   ├── TorrentCard.tsx           # Individual torrent display component
│   │   ├── SearchBar.tsx             # Search functionality component
│   │   └── ThemeToggle.tsx           # Dark/light theme toggle
│   └── types/
│       └── torrent.ts                # TypeScript type definitions
├── public/
│   └── torrents/                     # Place your .torrent files here
└── README.md
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Node.js File System** - Server-side file operations

## API Endpoints

- `GET /api/torrents` - Returns list of available torrent files
- `GET /api/download/[filename]` - Downloads a specific torrent file

## Contributing

Feel free to submit issues and enhancement requests!

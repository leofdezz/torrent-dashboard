# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **PostgreSQL Database**: Set up a database (recommended: Vercel Postgres, Supabase, or Railway)

## Step 1: Prepare Your Code

### Apply the proposed changes:
1. Update `prisma/schema.prisma` to use PostgreSQL
2. Update `package.json` build scripts
3. Create `vercel.json` configuration file

### Install PostgreSQL client:
```bash
npm install pg @types/pg
```

## Step 2: Set Up Database

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Create a new project or select existing
3. Go to Storage → Create Database → Postgres
4. Copy the `DATABASE_URL` connection string

### Option B: Supabase (Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (use "Session" mode)

### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy the connection string from variables

## Step 3: Environment Variables

Set these in your Vercel dashboard (Settings → Environment Variables):

```
DATABASE_URL=your-postgresql-connection-string
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-32-character-secret-key
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Step 4: Deploy to Vercel

### Method 1: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Step 5: Database Migration

After deployment, run migrations:

### Option 1: Vercel CLI
```bash
# Set environment variables locally for migration
export DATABASE_URL="your-production-database-url"

# Run migration
npx prisma migrate deploy

# Create admin user
node scripts/create-admin.js
```

### Option 2: Vercel Functions (if CLI doesn't work)
Create a temporary API route to run migrations:

```typescript
// src/app/api/setup/route.ts (DELETE AFTER USE)
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // Check if admin exists
    const admin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!admin) {
      // Create admin user
      await prisma.user.create({
        data: {
          email: 'admin@torrent-dashboard.com',
          password: await bcrypt.hash('admin123', 12),
          name: 'Administrator',
          role: 'admin',
        },
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

Visit `https://your-app.vercel.app/api/setup` once, then delete the file.

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. You should be redirected to the sign-in page
3. Login with: `admin@torrent-dashboard.com` / `admin123`
4. Test creating users in the admin panel
5. Test torrent file uploads and downloads

## Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check Vercel build logs for specific errors
- Verify PostgreSQL connection string format

### Database Issues
- Confirm DATABASE_URL is correct
- Check database permissions
- Ensure database accepts connections from Vercel IPs

### Authentication Issues
- Verify NEXTAUTH_URL matches your domain
- Ensure NEXTAUTH_SECRET is set and 32+ characters
- Check that admin user was created successfully

## Security Notes

1. **Change default admin password** after first login
2. **Use strong DATABASE_URL** with proper credentials
3. **Keep NEXTAUTH_SECRET** secure and unique
4. **Enable database SSL** in production
5. **Consider IP restrictions** for admin access

## File Upload Considerations

For production file uploads, consider:
- **Vercel Blob Storage** for torrent files
- **AWS S3** or **Cloudinary** for larger files
- **File size limits** (Vercel has 4.5MB limit for serverless functions)

Your torrent dashboard is now ready for production use!

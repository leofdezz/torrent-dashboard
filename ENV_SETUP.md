# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-32-characters-long

# Database (SQLite - already configured in schema)
# No additional DATABASE_URL needed for SQLite
```

## Setup Steps

1. **Create the .env file:**
   ```bash
   touch .env
   ```

2. **Add the environment variables:**
   ```bash
   echo "NEXTAUTH_URL=http://localhost:3000" >> .env
   echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
   ```

3. **Create the initial admin user:**
   ```bash
   node scripts/create-admin.js
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Default Admin Credentials

After running the create-admin script:
- **Email:** `admin@torrent-dashboard.com`
- **Password:** `admin123`

⚠️ **Important:** Change the admin password after first login!

## Authentication Flow

1. Visit `http://localhost:3000` - you'll be redirected to sign in
2. Use the admin credentials to log in
3. Admin users can access the Admin Dashboard to create new users
4. Regular users can only access the torrent dashboard

## User Roles

- **Admin:** Can create/delete users, access admin dashboard, and use torrent dashboard
- **User:** Can only access the torrent dashboard

## Troubleshooting

If you encounter issues:
1. Make sure the `.env` file exists and has the correct variables
2. Ensure the database is migrated: `npx prisma migrate dev`
3. Check that the admin user was created: `node scripts/create-admin.js`
4. Restart the development server after making changes

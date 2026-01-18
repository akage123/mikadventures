# Vercel Postgres Setup Guide

## 🚀 Quick Setup for Mika Adventures

### Step 1: Create Vercel Account & Database
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login to your account
3. Go to your dashboard → Storage → Create Database
4. Choose **Postgres** and create a new database
5. Name it something like `mika-adventures-db`

### Step 2: Get Database Credentials
After creating the database, you'll get connection details. Copy these values.

### Step 3: Set Up Environment Variables
Create a `.env.local` file in your project root with these variables:

```bash
# Main database URL
POSTGRES_URL=postgresql://username:password@hostname:5432/database_name

# Prisma URL (usually same as above)
POSTGRES_PRISMA_URL=postgresql://username:password@hostname:5432/database_name

# Non-SSL version
POSTGRES_URL_NO_SSL=postgresql://username:password@hostname:5432/database_name?sslmode=require

# Non-pooling version
POSTGRES_URL_NON_POOLING=postgresql://username:password@hostname:5432/database_name

# Individual params (optional fallback)
POSTGRES_USER=your_username
POSTGRES_HOST=your_hostname
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=your_database_name
```

**Replace the values with your actual Vercel Postgres credentials!**

### Step 4: Test Your Setup
```bash
npm run dev
```

Visit `http://localhost:3000/admin` to test adding/editing trips. They should now save to your Vercel Postgres database!

### Step 5: Deploy to Vercel
When you're ready to deploy:
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add the environment variables in Vercel dashboard (Project Settings → Environment Variables)
4. Deploy!

## 🛠️ Troubleshooting

**Connection Issues?**
- Make sure your database is in the same region as your Vercel project
- Check that your `.env.local` file is in the project root
- Verify the connection URL format

**Still using localStorage?**
- If database connection fails, the app falls back to localStorage automatically
- Check browser console for error messages

## 💡 Pro Tips

- **Free Tier**: Vercel Postgres offers 512MB free storage
- **Auto-scaling**: Database scales automatically with your app
- **Backups**: Vercel handles database backups for you
- **Performance**: Much faster than localStorage for production apps

## 📞 Need Help?

If you run into issues:
1. Check the browser console for error messages
2. Verify your environment variables are correct
3. Make sure your Vercel Postgres database is active

Your Mik Adventures admin panel is now production-ready! 🎉
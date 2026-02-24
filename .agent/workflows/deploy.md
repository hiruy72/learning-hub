---
description: How to deploy the Lets_lern application to Vercel
---

# Deployment Workflow

Follow these steps to deploy your application to Vercel:

### 1. Push Code to GitHub
Ensure all your changes are committed and pushed to your GitHub repository.
```bash
git add .
git commit -m "Prepare for deployment"
git push
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your `Lets_lern` repository.

### 3. Configure Environment Variables
In the Vercel project settings, add the following environment variables:
- `DATABASE_URL`: Your Neon PostgreSQL connection string.
- `JWT_SECRET`: A secure random string (at least 32 characters).
- `RESEND_API_KEY`: Your Resend API key for sending emails.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: (If using Clerk)
- `CLERK_SECRET_KEY`: (If using Clerk)

### 4. Database Setup
The `postinstall` script I added will automatically run `prisma generate` on Vercel. 
To apply migrations to your database, run this command once locally or via a Vercel function:
```bash
npx prisma migrate deploy
```

### 5. Deploy
Click **Deploy**! Vercel will build and host your application.

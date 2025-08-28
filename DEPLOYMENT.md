# Deployment Guide

This guide will walk you through deploying your Directory App to Vercel.

## 🚀 Quick Deploy

### Step 1: Prepare Your Repository

1. **Ensure all files are committed**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify these files exist**:
   - ✅ `.env.example` (with placeholder values)
   - ✅ `vercel.json` (deployment configuration)
   - ✅ `package.json` (with build scripts)
   - ✅ `.gitignore` (excluding `.env`)

### Step 2: Deploy to Vercel

#### Option A: One-Click Deploy
1. Click the "Deploy with Vercel" button in README.md
2. Connect your GitHub account
3. Import your repository
4. Configure environment variables (see Step 3)
5. Deploy!

#### Option B: Manual Deploy
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Configure settings and deploy

### Step 3: Environment Variables Setup

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add each variable from your `.env` file:

| Variable | Description | Required |
|----------|-------------|----------|
| `TURSO_DATABASE_URL` | Your Turso database URL | ✅ |
| `TURSO_AUTH_TOKEN` | Your Turso auth token | ✅ |
| `BOHO_PASSWORD` | Admin panel password | ✅ |
| `BOHO_SECRET` | JWT secret key | ✅ |
| `ANTHROPIC_API_KEY` | Anthropic API key | ❌ |
| `EXASEARCH_API_KEY` | Exa search API key | ❌ |
| `LOOPS_API_KEY` | Loops email API key | ❌ |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | ✅ |

### Step 4: Domain Configuration

#### Free Subdomain
- Your app will be available at: `your-app-name.vercel.app`
- Update `NEXT_PUBLIC_SITE_URL` to this URL

#### Custom Domain (Optional)
1. **Add domain in Vercel**:
   - Go to **Settings** → **Domains**
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update environment variables**:
   - Set `NEXT_PUBLIC_SITE_URL` to your custom domain

### Step 5: Post-Deployment Setup

1. **Run database migrations**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Pull environment variables
   vercel env pull .env.local

   # Run migrations
   npm run db:migrate
   ```

2. **Verify deployment**:
   - Visit your deployed URL
   - Test admin login at `/admin`
   - Add a test bookmark
   - Verify all features work

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
- Check that all dependencies are in `package.json`
- Verify TypeScript compilation
- Check for missing environment variables

#### Database Connection Issues
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
- Ensure database exists and is accessible
- Check Turso dashboard for connection status

#### Admin Login Issues
- Verify `BOHO_PASSWORD` and `BOHO_SECRET` are set
- Check that password meets requirements (8+ characters)
- Clear browser cache and try again

#### Environment Variables Not Working
- Ensure variables are added to Vercel dashboard
- Redeploy after adding new variables
- Check variable names match exactly

### Performance Optimization

1. **Enable Vercel Analytics** (free)
2. **Monitor function execution times**
3. **Optimize images** (already configured)
4. **Use edge caching** where possible

## 📊 Monitoring

### Vercel Dashboard
- **Analytics**: View performance metrics
- **Functions**: Monitor serverless function usage
- **Logs**: Check for errors and issues

### Database Monitoring
- **Turso Dashboard**: Monitor database usage
- **Query Performance**: Check slow queries
- **Storage**: Monitor database size

## 🔄 Updates and Maintenance

### Updating Your App
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Vercel will automatically redeploy

### Environment Variable Updates
1. Update in Vercel dashboard
2. Redeploy manually or trigger new commit
3. Verify changes are applied

### Database Migrations
1. Create new migration: `npm run db:generate`
2. Test locally: `npm run db:migrate`
3. Deploy and run on production

## 🎉 Success!

Once deployed, your Directory App will be:
- ✅ Live and accessible
- ✅ Automatically updated on git pushes
- ✅ Optimized for performance
- ✅ Ready for users

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Check this guide for common solutions
5. Open an issue in the repository

---

**Happy deploying! 🚀**

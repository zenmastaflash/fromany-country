# Deployment Guide for fromany.country

This guide will walk you through deploying the application to Vercel.

## Prerequisites

1. Create accounts on:
   - Vercel (https://vercel.com)
   - Supabase (https://supabase.com) for database

## Step 1: Set Up Database

1. Go to Supabase
2. Create a new project
3. Get your database connection string from Settings > Database
4. Save this for later use

## Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click 'Add New Project'
3. Import your GitHub repository
4. Configure these environment variables:
   ```
   DATABASE_URL=(your Supabase connection string)
   NEXTAUTH_URL=https://fromany.country
   NEXTAUTH_SECRET=(generate a random string)
   GOOGLE_CLIENT_ID=(from Google Cloud Console)
   GOOGLE_CLIENT_SECRET=(from Google Cloud Console)
   ```
5. Click Deploy

## Step 3: Configure Domain

1. In Vercel, go to your project settings
2. Click 'Domains'
3. Add your domain 'fromany.country'
4. Follow the DNS configuration instructions

## Step 4: Verify Setup

1. Visit your domain
2. Try signing in
3. Test the core features:
   - Travel tracking
   - Document upload
   - Tax calculations

## Monitoring

1. Set up monitoring in Vercel:
   - Go to Project Settings > Monitoring
   - Enable Error Monitoring
   - Enable Performance Monitoring

2. Set up database monitoring in Supabase:
   - Enable Database Monitoring
   - Set up alerts for high usage

## Common Issues

1. **Database Connection Issues**
   - Check if your DATABASE_URL is correct
   - Verify IP restrictions in Supabase

2. **Authentication Problems**
   - Ensure Google OAuth redirect URIs are updated
   - Check NEXTAUTH_URL matches your domain

3. **Build Failures**
   - Check build logs in Vercel
   - Verify all environment variables are set

## Maintenance

1. **Regular Updates**
   ```bash
   # Update dependencies
   npm update
   
   # Check for security vulnerabilities
   npm audit
   ```

2. **Database Backups**
   - Supabase handles automatic backups
   - Consider setting up additional backup procedures

3. **SSL Certificates**
   - Vercel handles SSL automatically
   - Renews certificates automatically

## Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Review Supabase database logs
3. Contact support with:
   - Error messages
   - Deployment logs
   - Environment details
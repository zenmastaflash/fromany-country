# Setup Guide for fromany.country

This guide will walk you through setting up the fromany.country application from scratch.

## Prerequisites Installation

1. **Install Node.js**
   - Go to https://nodejs.org
   - Download and install Node.js 18 or later
   - Verify installation by opening a terminal and typing:
     ```bash
     node --version
     ```

2. **Install PostgreSQL**
   - Go to https://www.postgresql.org/download/
   - Download and install PostgreSQL for your operating system
   - Remember the password you set for the postgres user
   - For Windows: Add PostgreSQL to your PATH if the installer didn't do it

## Google OAuth Setup

1. Go to https://console.cloud.google.com/
2. Create a new project (or select an existing one)
3. In the sidebar, click 'APIs & Services' > 'Credentials'
4. Click 'Create Credentials' > 'OAuth client ID'
5. Configure the OAuth consent screen if prompted
6. Select 'Web application' as the application type
7. Add these Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google (for development)
   - https://fromany.country/api/auth/callback/google (for production)
8. Click 'Create'
9. Copy the Client ID and Client Secret

## Application Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/fromany-country.git
   cd fromany-country
   ```

2. **Run the Setup Script**
   ```bash
   # Make the script executable
   chmod +x scripts/setup.sh
   # Run the script
   ./scripts/setup.sh
   ```

3. **Configure Environment Variables**
   Edit .env.local and add:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/fromany-country"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-random-string"
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

## Common Issues and Solutions

1. **Database Connection Error**
   - Check if PostgreSQL is running
   - Verify your DATABASE_URL in .env.local
   - Make sure the database exists

2. **Authentication Issues**
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Check if redirect URIs are correctly set in Google Console
   - Ensure NEXTAUTH_URL matches your development URL

3. **Build Errors**
   - Try removing node_modules and package-lock.json
   - Run `npm install` again
   - Clear Next.js cache with `rm -rf .next`

## Development Tools Recommendations

1. **Code Editor**
   - VS Code (recommended): https://code.visualstudio.com/
   - Install these extensions:
     - Prisma
     - ESLint
     - Tailwind CSS IntelliSense

2. **Database Management**
   - TablePlus: https://tableplus.com/
   - pgAdmin: https://www.pgadmin.org/

## Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Add Environment Variables in Vercel**
   - Go to your project in Vercel
   - Settings > Environment Variables
   - Add all variables from .env.local

## Need Help?

If you encounter any issues:
1. Check the error message in the console
2. Look for similar issues in our GitHub repository
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment details (OS, Node version, etc.)

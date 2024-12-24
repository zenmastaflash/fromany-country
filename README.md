# FromAny.Country

**Your Global Life, Simplified**  
A comprehensive platform for digital nomads to manage their global lifestyle—track travel, store documents, calculate tax implications, and more.

---

## Table of Contents

1. [Features](#features)  
2. [Quick Start](#quick-start)  
3. [Detailed Setup](#detailed-setup)  
   - [Prerequisites](#prerequisites)  
   - [Database (PostgreSQL)](#database-postgresql)  
   - [Google OAuth](#google-oauth)  
   - [Environment Variables](#environment-variables)  
4. [Development](#development)  
   - [Database Migrations](#database-migrations)  
   - [Running Tests](#running-tests)  
5. [Common Issues](#common-issues)  
6. [Deployment](#deployment)  
   - [Local Production](#local-production)  
   - [Deploying to Vercel](#deploying-to-vercel)  
7. [Contributing](#contributing)  
8. [License](#license)

---

## Features

- **Travel tracking** with tax implications  
- **Document management** system for passports, visas, and more  
- **Tax residence calculator** to keep you compliant  
- **Entry requirements** checker for global destinations  
- **Resource center** with essential info for digital nomads

---

## Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/fromany-country.git
   cd fromany-country
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**  
   Copy `.env.example` to `.env.local` (or create `.env.local`) and fill in your details:
   ```ini
   DATABASE_URL="postgresql://user:password@localhost:5432/fromany-country"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-random-string"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set Up the Database**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

Your app is now running at http://localhost:3000!

## Detailed Setup

### Prerequisites

- **Node.js 18+**
  - Download from [nodejs.org](https://nodejs.org)
  - Verify with `node --version`
- **PostgreSQL**
  - Download from [postgresql.org](https://postgresql.org)
  - Keep track of your Postgres username and password
  - Ensure PostgreSQL is running (e.g., via pgAdmin or TablePlus)

### Database (PostgreSQL)

1. Create a Database named `fromany-country` (or any name you prefer)
2. Update `DATABASE_URL` in your `.env.local` with your connection details:
   ```ini
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fromany-country"
   ```
3. Apply Migrations:
   ```bash
   npx prisma migrate dev
   ```
   This ensures the schema is up-to-date.

### Google OAuth

1. Create a Project at [Google Cloud Console](https://console.cloud.google.com)
   - APIs & Services → Credentials → Create Credentials → OAuth client ID
   - Application type: Web application
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://fromany.country
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     https://fromany.country/api/auth/callback/google
     ```
2. Click Create and copy the Client ID and Client Secret into your `.env.local`:
   ```ini
   GOOGLE_CLIENT_ID="xxxxxxxxxxx.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your_google_secret"
   ```

### Environment Variables

Your `.env.local` might look like this:

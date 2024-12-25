# FromAny.Country

**Your Global Life, Simplified**  
A comprehensive platform for digital nomads to manage their global lifestyle—track travel, store documents, calculate tax implications, and more.

## Table of Contents

1. [Features](#features)  
2. [Quick Start](#quick-start)  
3. [Detailed Setup](#detailed-setup)  
4. [Development](#development)  
5. [Common Issues](#common-issues)  
6. [Deployment](#deployment)  
7. [Contributing](#contributing)  
8. [License](#license)
9. [Environment Variables](#environment-variables)

## Features

### Core Features

- **Document Management**
  - Upload & storage using Supabase and AWS S3
  - Document categorization
  - Metadata tracking
  - Expiration system
  - Document sharing
  - Version control

- **Document Intelligence**
  - OCR integration
  - Automatic data extraction
  - Smart categorization
  - Authenticity validation

- **Travel Integration**
  - Calendar integration
  - Flight data API connection
  - Day-by-day location tracking
  - Tax day calculations
  - Visa requirement warnings
  - Entry/exit tracking

- **Community Building**
  - Links to partner communities (e.g., coliving spaces)
  - Community forum or integrations with WhatsApp, Signal, Slack

- **Resource Center**
  - Coliving
  - Geo Arbitrage
  - Tax liability
  - Legal resources
  - Nomad visas
  - Other tools

### Next Steps

- Create a dashboard for tax residency, liability, and other useful insights
- Fix document storage "internal error"

### Recent Fixes

- Resolved Google Callback Error:
  - Ensured correct redirect URIs and environment variables.
- Fixed useSession Hook Usage:
  - Wrapped components with SessionProvider to ensure proper session handling.
- Addressed Prisma Schema Mismatches:
  - Updated database schema to match Prisma schema, adding missing columns like tags and sharedWith.
- Corrected Import Paths:
  - Fixed import paths for components like Button to resolve module not found errors.
- Handled useSearchParams Error:
  - Wrapped useSearchParams in a Suspense boundary to resolve client-side rendering issues.
- Resolved Merge Conflicts:
  - Merged changes from feat/auth-redirect-nav into main after resolving conflicts.

## Environment Variables

### Production Variables
- SUPABASE_ANON_KEY
- POSTGRES_DATABASE
- POSTGRES_PASSWORD (Sensitive)
- POSTGRES_HOST
- POSTGRES_USER
- POSTGRES_URL_NON_POOLING (Sensitive)
- POSTGRES_PRISMA_URL (Sensitive)
- POSTGRES_URL (Sensitive)

### All Environments
- NEXTAUTH_URL
- GOOGLE_CLIENT_SECRET
- GOOGLE_CLIENT_ID
- DATABASE_URL
- DIRECT_URL
- AWS_SECRET_ACCESS_KEY
- AWS_ACCESS_KEY_ID
- RESEND_API_KEY
- CRON_SECRET
- AWS_BUCKET_NAME
- AWS_REGION
- NEXTAUTH_SECRET

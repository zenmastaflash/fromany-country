# FromAny.Country

**Your Global Life, Simplified**  
A comprehensive platform for digital nomads to manage their global lifestyle—track travel, store documents, calculate tax implications, and more.

## Table of Contents

1. [Features](#features)
2. [Quick Start](#quick-start)
3. [Common Issues](#common-issues)
4. [Environment Variables](#environment-variables)
5. [License](#license)

## Features

### Design Elements

**Background**
- #2E2E2E (Dark Grey)

**Font**
#fcfbdc (Creamy White)

**Primary Colors**
- #003135
- #024950
- #964734
- #0FA4AF
- #AFDDE5

**Dark by Default**

We believe in dark mode for many reasons, as listed below:

- **Reduced Eye Strain**
Dark mode can significantly reduce eye strain, particularly in low-light environments. The contrast between text and background is less harsh, making it easier for users to read for extended periods without discomfort. This is especially beneficial when using devices at night or in dimly lit rooms.
Battery Efficiency
For devices with OLED or AMOLED screens, dark mode can extend battery life. On these displays, dark mode reduces power consumption as black pixels are turned off completely. For example:
	•	iPhones playing video in dark mode lasted 20 hours compared to 15 hours in light mode, a 33% increase.
	•	At 100% screen brightness, the dark interface in the YouTube app saves about 60% of screen energy compared to a white background.

- **Aesthetic Appeal**
Many users find dark mode visually appealing and modern. It offers a different visual experience that is often perceived as less harsh than light mode. Dark colors can symbolize luxury and elegance, and light tones pop more effectively against a dark background.

- **Potential Sleep Benefits**
Dark mode may improve sleep quality by reducing exposure to blue light, which can disrupt sleep patterns. By decreasing blue light emission, especially in the evening, dark mode may help maintain the body's natural circadian rhythm.

- **Accessibility Improvements**
For individuals with certain visual impairments, such as sensitivity to bright light or photophobia, dark mode can provide a more comfortable and accessible viewing experience. It offers a gentler visual experience, allowing for better focus and comprehension.
While dark mode offers these benefits, it's important to note that it may not be suitable for everyone, particularly those with astigmatism or in brightly lit environments. Users should choose the mode that works best for their individual needs and preferences.

### Core Features

- **Authentication**
  - ✅ Google Auth
  - ✅ Sign up flow
  - terms acceptance
  - password reset

- **Dashboard**
  - ✅ Shows tax liability
  - ✅ Critical dates (currently only document expiration, but looking to add important filing dates as well)
  - ✅ Compliance Alerts

- **Document Management**
  - ✅ Upload & storage using Supabase and AWS S3 
  - ✅ Document categorization
  - ✅ Metadata tracking
  - ✅ Expiration system
  - ✅ Document sharing
  - Version control

- **Document Intelligence**
  - OCR integration
  - Automatic data extraction
  - Smart categorization
  - Authenticity validation

- **Travel Integration**
  - ✅ Calendar integration
  - Flight data API connection
  - ✅ Day-by-day location tracking
  - ✅ Tax day calculations
  - Visa requirement warnings
  - Entry/exit tracking
  - Travel Planning - plan ahead to reduce tax liability
  - Natural language input for quick additions

- **Community Building**
  - Links to partner communities (e.g., coliving spaces)
  - Community forum or integrations with WhatsApp, Signal, Slack

- **Profile Page**
  - ✅ Profile Photo
  - ✅ Display name, bio, current location
  - Profile Visibility - Complete, but currently not active
  - Notification Preferences - Complete but currently not active
  - ✅ Emergency Contact - created, but no actions (SOS button)
  - SOS button (sends info to emergency contact with last known wheereabouts. Considering integration with a tool like internationalSOS or other)
  - ✅ Account Deletion.

- **Resource Center**
  - ✅ Coliving
  - ✅ Geo Arbitrage
  - ✅ Tax liability
  - ✅ Legal resources
  - ✅ Nomad visas
  - "Explore" function that helps you see at a glance what any given country's tax liability is
  - Other tools
 
- **Misc Features**
  - Natural Language Input
  - i18n Internationalization
  - Tax Residency Simulator
  - Geoarbitrage Calculator


### Current Works

- Build out country-based tax laws, important dates, etc
- Fixing annoying Accept Terms page issue where users have to accept upon each login

### Recent Fixes/Features
#### Fixed
- Negative days showing in Netherlands (and other countries) after meeting residency requirements
- Progress bar continuing past 100% when exceeding residency days requirement
- Progress bar color staying red even after meeting residency threshold
- Bug with TypeScript definitions causing build errors

#### Features
- Residency status indicators now show:
 - Blue bar when minimum days requirement is met
 - Red bar until minimum days requirement is met
 - "Minimum residency requirement met (X days)" message when requirement is met
 - Capped progress bar at 100% for residency permits/visas
- Tax residency warnings still show progress beyond 100% with red bar
- Added proper TypeScript definitions for all functions
- Kept existing compliant status messages

## Quick Start

### Prerequisites

1. Create accounts on:
   - Vercel (https://vercel.com)
   - Supabase (https://supabase.com) for database
   - Google Cloud (https://console.cloud.google.com/) for OAuth

### Step 1: Set Up Database

1. Go to Supabase
2. Create a new project
3. Get your database connection string from Settings > Database
4. Save this for later use

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click 'Add New Project'
3. Import your GitHub repository
4. Configure the Environment Variables at the bottom of this page
5. Click Deploy

### Step 3: Configure Domain

1. In Vercel, go to your project settings
2. Click 'Domains'
3. Add your domain 'fromany.country'
4. Follow the DNS configuration instructions

### Step 4: Google OAuth Setup

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

### Maintenance

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
- NEXT_PUBLIC_S3_BUCKET
- NEXT_PUBLIC_S3_REGION

## License

This project is licensed under the [GNU General Public License v3](./LICENSE).


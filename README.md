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

### Design Elements

**Colors**
#003135
#024950
#964734
#0FA4AF
#AFDDE5

**Dark by Default**
We believe in dark mode for many reasons, as listed below:
Reduced Eye Strain
Dark mode can significantly reduce eye strain, particularly in low-light environments. The contrast between text and background is less harsh, making it easier for users to read for extended periods without discomfort. This is especially beneficial when using devices at night or in dimly lit rooms.
Battery Efficiency
For devices with OLED or AMOLED screens, dark mode can extend battery life. On these displays, dark mode reduces power consumption as black pixels are turned off completely. For example:
	•	iPhones playing video in dark mode lasted 20 hours compared to 15 hours in light mode, a 33% increase.
	•	At 100% screen brightness, the dark interface in the YouTube app saves about 60% of screen energy compared to a white background.
Aesthetic Appeal
Many users find dark mode visually appealing and modern. It offers a different visual experience that is often perceived as less harsh than light mode. Dark colors can symbolize luxury and elegance, and light tones pop more effectively against a dark background.
Potential Sleep Benefits
Dark mode may improve sleep quality by reducing exposure to blue light, which can disrupt sleep patterns. By decreasing blue light emission, especially in the evening, dark mode may help maintain the body’s natural circadian rhythm.
Accessibility Improvements
For individuals with certain visual impairments, such as sensitivity to bright light or photophobia, dark mode can provide a more comfortable and accessible viewing experience. It offers a gentler visual experience, allowing for better focus and comprehension.
While dark mode offers these benefits, it’s important to note that it may not be suitable for everyone, particularly those with astigmatism or in brightly lit environments. Users should choose the mode that works best for their individual needs and preferences.

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

- Resolved document errors (some still pending)
- Resolved auth issues

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

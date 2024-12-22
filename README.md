# fromany.country

Your Global Life, Simplified - A platform for digital nomads to manage their global lifestyle, focusing on document management, travel tracking, and compliance.

## Project Status

### Current Features
- Basic app structure with Next.js 14
- User authentication with Google OAuth
- Document management system
- Travel tracking capabilities
- Row Level Security with Supabase

### Technical Stack
- Frontend: Next.js 14.0.0, React 18, TypeScript
- Authentication: NextAuth.js
- Database: PostgreSQL via Supabase with Prisma ORM
- Storage: AWS S3 for document storage
- Deployment: Vercel

### Environment Variables Required
```env
NEXTAUTH_URL=https://fromany-country.vercel.app
NEXTAUTH_SECRET=[secure secret]
GOOGLE_CLIENT_ID=[from Google Cloud Console]
GOOGLE_CLIENT_SECRET=[from Google Cloud Console]
DATABASE_URL=[Supabase connection string]
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=[for S3]
AWS_SECRET_ACCESS_KEY=[for S3]
AWS_BUCKET_NAME=fromany-country-docs
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (via Supabase)
- Google OAuth credentials
- AWS S3 bucket

### Installation
```bash
git clone https://github.com/zenmastaflash/fromany-country.git
cd fromany-country
npm install
```

### Database Setup
1. Set up a Supabase project
2. Apply RLS policies for the User table:
```sql
-- Enable users to view their own data
create policy "Enable users to view their own data only"
on "public"."User"
as PERMISSIVE
for SELECT
to authenticated
using (
  auth.uid()::text = id
);

-- Allow insert for authenticated users
create policy "Enable insert for authenticated users only"
on "public"."User"
as PERMISSIVE
for INSERT
to authenticated
with check (
  true
);

-- Allow users to update their own data
create policy "Enable users to update their own data"
on "public"."User"
as PERMISSIVE
for UPDATE
to authenticated
using (
  auth.uid()::text = id
);
```

### Google OAuth Setup
In Google Cloud Console:
1. Create new OAuth 2.0 credentials
2. Add authorized redirect URIs:
   - https://fromany-country.vercel.app/api/auth/callback/google
   - http://localhost:3000/api/auth/callback/google
3. Add authorized JavaScript origins:
   - https://fromany-country.vercel.app
   - http://localhost:3000

## Known Issues & Solutions

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for:
- Common build errors and solutions
- Authentication debugging tips
- RLS policy configuration

## Development Standards

### Code Style
- TypeScript strict mode
- React client/server components
- Tailwind for styling
- Prisma for database operations

### Branch Naming
- feature/* - New features
- fix/* - Bug fixes
- docs/* - Documentation updates

## Contributing
Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License
This project is licensed under the MIT License - see [LICENSE](./LICENSE) for details.
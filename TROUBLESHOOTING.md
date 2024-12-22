# Troubleshooting Guide

## Known Issues and Solutions

### NextAuth Configuration

#### Issue: AuthOptions Import Error
```typescript
Type error: Module '"next-auth"' has no exported member 'AuthOptions'.
```
**Solution:**
- Import NextAuthOptions instead of AuthOptions
- Ensure proper imports in route.ts:
```typescript
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
```

#### Issue: getServerSession Import Error
```typescript
Attempted import error: 'getServerSession' is not exported from 'next-auth'
```
**Solution:**
- Update import location:
```typescript
import { getServerSession } from 'next-auth/next';
```

### Prisma/Supabase Integration

#### Issue: RLS Policy Type Mismatch
```sql
ERROR: operator does not exist: uuid = text
```
**Solution:**
- Cast auth.uid() to text in RLS policies:
```sql
auth.uid()::text = id
```

#### Issue: Default Export Error
```typescript
Attempted import error: './prisma' does not contain a default export
```
**Solution:**
- Update Prisma client export:
```typescript
import { PrismaClient } from '@prisma/client';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma =
  prismaGlobal.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}
```

### Deployment Issues

#### Issue: Build Failing on Vercel
- Check environment variables are set correctly
- Verify Google OAuth configuration
- Ensure database connection string is correct
- Confirm AWS S3 credentials are valid

### Google OAuth Configuration

Required Setup:
1. Authorized redirect URIs:
   ```
   https://fromany-country.vercel.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
2. JavaScript origins:
   ```
   https://fromany-country.vercel.app
   http://localhost:3000
   ```

## Development Tips

### Local Development
1. Use `.env.local` for environment variables
2. Run database locally first
3. Test auth flow with `localhost:3000`

### Database Management
1. Always backup before applying RLS policies
2. Test policies with `auth.uid()` before deployment
3. Keep Prisma schema in sync with Supabase

### Authentication Flow
1. Test with multiple accounts
2. Verify session persistence
3. Check redirect behavior

## Getting Help
- Check existing issues in GitHub
- Verify all environment variables
- Test locally before deployment
- Use development mode for detailed errors
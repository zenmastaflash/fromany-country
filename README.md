FromAny.Country
Your Global Life, Simplified
A comprehensive platform for digital nomads to manage their global lifestyle—track travel, store documents, calculate tax implications, and more.

Table of Contents
Features
Quick Start
Detailed Setup
Prerequisites
Database (PostgreSQL)
Google OAuth
Environment Variables
Development
Database Migrations
Running Tests
Common Issues
Deployment
Local Production
Deploying to Vercel
Contributing
License
Features
Travel tracking with tax implications
Document management system for passports, visas, and more
Tax residence calculator to keep you compliant
Entry requirements checker for global destinations
Resource center with essential info for digital nomads
Quick Start
Clone the Repository
bash
Copy code
git clone https://github.com/yourusername/fromany-country.git
cd fromany-country
Install Dependencies
bash
Copy code
npm install
Configure Environment Variables
Copy .env.example to .env.local (or create .env.local) and fill in your details:
ini
Copy code
DATABASE_URL="postgresql://user:password@localhost:5432/fromany-country"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-string"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
Set Up the Database
bash
Copy code
npx prisma migrate dev
Start the Development Server
bash
Copy code
npm run dev
Your app is now running at http://localhost:3000!
Detailed Setup
Prerequisites
Node.js 18+
Download from nodejs.org
Verify with node --version
PostgreSQL
Download from postgresql.org
Keep track of your Postgres username and password
Ensure it’s running (e.g., via pgAdmin or TablePlus)
Database (PostgreSQL)
Create a Database named fromany-country (or any name you prefer).
Update DATABASE_URL in your .env.local with your connection details:
ini
Copy code
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fromany-country"
Apply Migrations:
bash
Copy code
npx prisma migrate dev
This ensures the schema is up-to-date.
Google OAuth
Create a Project at Google Cloud Console
APIs & Services → Credentials → Create Credentials → OAuth client ID
Application type: Web application
Authorized JavaScript origins:
arduino
Copy code
http://localhost:3000             (for local dev)
https://fromany.country           (for production, if using that domain)
Authorized redirect URIs:
ruby
Copy code
http://localhost:3000/api/auth/callback/google
https://fromany.country/api/auth/callback/google
Click Create and copy the Client ID and Client Secret into your .env.local:
ini
Copy code
GOOGLE_CLIENT_ID="xxxxxxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_secret"
Environment Variables
Your .env.local might look like this:

ini
Copy code
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/fromany-country"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="some-random-secret"
GOOGLE_CLIENT_ID="xxxx-xxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxxxxxx"
Note: If you’re running in production at https://fromany.country, set NEXTAUTH_URL="https://fromany.country".

Development
Database Migrations
To create a new migration whenever you change your Prisma schema:

bash
Copy code
npx prisma migrate dev --name your_migration_name
Running Tests
bash
Copy code
npm run test
Common Issues
Database Connection Error
Ensure PostgreSQL is running and DATABASE_URL is correct
Make sure the database actually exists
Authentication / Google OAuth Error
Check if the Authorized Redirect URIs match the domain in NEXTAUTH_URL
Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
Remove www from your domain if you’re only using https://fromany.country
Build Errors
Remove node_modules & package-lock.json, then npm install again
Clear Next.js cache by removing .next folder
Ensure your environment variables are set correctly
Deployment
Local Production
Build:
bash
Copy code
npm run build
Start:
bash
Copy code
npm start
The app runs at http://localhost:3000 by default.
Deploying to Vercel
Install Vercel CLI:
bash
Copy code
npm i -g vercel
Configure:
bash
Copy code
vercel login
vercel link
Environment Variables:
Go to Project Settings → Environment Variables in Vercel.
Add all from .env.local (like DATABASE_URL, NEXTAUTH_URL, etc.).
Deploy:
bash
Copy code
vercel
Vercel will build and host your app.
Tip: If you run into memory or build issues, you can optimize build settings in Vercel’s project config.

Contributing
Fork this repo
Create a new branch: git checkout -b feature/awesome-feature
Commit your changes: git commit -m 'Add awesome feature'
Push to the branch: git push origin feature/awesome-feature
Open a Pull Request
Please see our contributing guidelines for more details.

License
This project is licensed under the MIT License. Feel free to use, modify, and distribute this application as permitted.

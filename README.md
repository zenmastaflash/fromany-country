# fromany.country

Your Global Life, Simplified - A comprehensive platform for digital nomads to manage their global lifestyle.

## Features

- Travel tracking with tax implications
- Document management system
- Tax residence calculator
- Entry requirements checker
- Comprehensive resource center

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fromany-country.git
cd fromany-country
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your configuration.

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## Development

### Database Migrations

To create a new migration:
```bash
npx prisma migrate dev --name your_migration_name
```

### Running Tests

```bash
npm run test
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

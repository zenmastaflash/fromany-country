#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting setup for fromany.country...${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Please install Node.js 18 or later.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm not found. Please install npm.${NC}"
    exit 1
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${GREEN}Creating .env.local file...${NC}"
    cp .env.example .env.local
    echo -e "${YELLOW}Please edit .env.local with your configuration values${NC}"
fi

# Setup database
echo -e "${GREEN}Setting up database...${NC}"
npx prisma generate
npx prisma migrate dev

# Build the application
echo -e "${GREEN}Building the application...${NC}"
npm run build

echo -e "\n${GREEN}Setup complete! You can now start the development server with:${NC}"
echo -e "npm run dev"
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    throw error;
  }
}

async function optimizeBuild() {
  console.log('🚀 Starting build optimization...');

  // Clean previous build artifacts
  console.log('🧹 Cleaning previous builds...');
  try {
    fs.rmSync('.next', { recursive: true, force: true });
    fs.rmSync('node_modules/.prisma', { recursive: true, force: true });
  } catch (error) {
    console.log('No previous build files to clean');
  }

  // Install dependencies without generating Prisma artifacts
  console.log('📦 Installing dependencies...');
  runCommand('npm install --no-optional');

  // Generate Prisma client only once
  console.log('🔄 Generating Prisma client...');
  runCommand('npx prisma generate');

  // Build the application with optimized settings
  console.log('🏗️ Building application...');
  process.env.NODE_OPTIONS = '--max_old_space_size=4096'; // Increase memory limit
  runCommand('next build');

  console.log('✅ Build optimization complete!');
}

optimizeBuild().catch(console.error);
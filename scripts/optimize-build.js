const { execSync } = require('child_process');
const fs = require('fs');

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

  // Generate Prisma client
  console.log('🔄 Generating Prisma client...');
  runCommand('npx prisma generate');

  // Build the application
  console.log('🏗️ Building application...');
  process.env.NODE_OPTIONS = '--max_old_space_size=4096';
  runCommand('next build');

  console.log('✅ Build optimization complete!');
}

optimizeBuild().catch(console.error);
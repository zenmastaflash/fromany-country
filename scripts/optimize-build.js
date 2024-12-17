const { execSync } = require('child_process');

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    throw error;
  }
}

function optimizeBuild() {
  console.log('🚀 Starting build optimization...');
  console.log('🧹 Cleaning previous builds...');
  runCommand('rm -rf .next');
  console.log('🏗️ Building application...');
  runCommand('next build');
}

optimizeBuild();
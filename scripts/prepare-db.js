const { execSync } = require('child_process');

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`, error);
    process.exit(1);
  }
}

async function prepareDatabase() {
  console.log('🔄 Preparing database...');

  // Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  runCommand('npx prisma generate');

  // Reset the database (this will clean up any prepared statements)
  console.log('🧹 Resetting database...');
  try {
    runCommand('npx prisma migrate reset --force');
  } catch (error) {
    console.log('Migration reset failed, continuing with deploy...');
  }

  // Deploy migrations
  console.log('⬆️ Deploying migrations...');
  runCommand('npx prisma migrate deploy');

  console.log('✅ Database preparation complete!');
}

prepareDatabase().catch((error) => {
  console.error('Database preparation failed:', error);
  process.exit(1);
});
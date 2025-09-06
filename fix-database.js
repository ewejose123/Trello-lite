#!/usr/bin/env node

/**
 * Database Fix Script for Trello-lite
 * 
 * This script helps fix the database schema mismatch issue where
 * the Project.description column is missing from the database.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Trello-lite Database Fix Script');
console.log('==================================\n');

const backendDir = path.join(__dirname, 'backend');

function runCommand(command, description) {
    console.log(`📋 ${description}...`);
    try {
        const output = execSync(command, { 
            cwd: backendDir, 
            stdio: 'inherit',
            encoding: 'utf8' 
        });
        console.log(`✅ ${description} completed\n`);
        return true;
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        return false;
    }
}

async function fixDatabase() {
    console.log('Current working directory:', process.cwd());
    console.log('Backend directory:', backendDir);
    console.log();

    // Step 1: Install dependencies (if needed)
    console.log('Step 1: Ensuring dependencies are installed');
    if (!runCommand('npm install', 'Installing backend dependencies')) {
        return;
    }

    // Step 2: Generate Prisma client
    console.log('Step 2: Generating Prisma client');
    if (!runCommand('npx prisma generate', 'Generating Prisma client')) {
        return;
    }

    // Step 3: Check current migration status
    console.log('Step 3: Checking migration status');
    runCommand('npx prisma migrate status', 'Checking migration status');

    // Step 4: Create and apply migration for missing description column
    console.log('Step 4: Creating migration for missing Project.description column');
    if (!runCommand('npx prisma migrate dev --name add_project_description', 'Creating migration for Project.description column')) {
        console.log('⚠️  Migration may have failed. Trying to push schema instead...');
        
        // Alternative: Push schema directly to database
        console.log('Step 4b: Pushing schema to database (alternative approach)');
        if (!runCommand('npx prisma db push', 'Pushing schema to database')) {
            console.log('❌ Both migration and schema push failed. Please check your database connection.');
            return;
        }
    }

    // Step 5: Verify the fix
    console.log('Step 5: Verifying the database schema');
    runCommand('npx prisma db pull', 'Pulling current database schema');

    console.log('🎉 Database fix completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the backend: cd backend && npm run dev');
    console.log('2. Start the frontend: cd frontend && npm run dev');
    console.log('3. Test the team data fetching functionality');
}

// Add error handling for the script
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the fix
fixDatabase().catch(error => {
    console.error('❌ Database fix script failed:', error.message);
    process.exit(1);
});
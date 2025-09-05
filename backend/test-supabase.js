import { PrismaClient } from '@prisma/client';

async function testSupabaseConnection() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔄 Testing Supabase connection...');
        
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully!');
        
        // Test a simple query
        const userCount = await prisma.user.count();
        console.log(`📊 Users in database: ${userCount}`);
        
        // Test team count
        const teamCount = await prisma.team.count();
        console.log(`📊 Teams in database: ${teamCount}`);
        
        console.log('🎉 Supabase migration successful!');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check your DATABASE_URL in .env file');
        console.log('2. Verify Supabase project is running');
        console.log('3. Ensure database password is correct');
    } finally {
        await prisma.$disconnect();
    }
}

testSupabaseConnection();

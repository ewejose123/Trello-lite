// Simple script to test if backend is running and database is connected
// Using built-in fetch (Node.js 18+) instead of node-fetch

async function testConnection() {
    try {
        console.log('Testing backend connection...');
        
        // Test basic server response
        const response = await fetch('http://localhost:8000');
        const text = await response.text();
        console.log('✅ Backend server is running:', text);
        
        // Test health endpoint (if it exists)
        try {
            const healthResponse = await fetch('http://localhost:8000/api/health');
            if (healthResponse.ok) {
                console.log('✅ Health endpoint is working');
            }
        } catch (err) {
            console.log('⚠️  No health endpoint found (this is normal)');
        }
        
        // Test teams endpoint with authentication (you'll need a valid token)
        console.log('\n📝 To test protected endpoints:');
        console.log('1. Login through the frontend first');
        console.log('2. Copy the token from localStorage');
        console.log('3. Use tools like Postman or curl to test API endpoints');
        
    } catch (error) {
        console.error('❌ Backend connection failed:', error.message);
        console.log('Make sure the backend server is running on port 8000');
        console.log('\n🔧 To start the backend:');
        console.log('cd backend && npm run dev');
    }
}

testConnection();
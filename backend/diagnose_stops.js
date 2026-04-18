// Quick diagnostic script to check if everything is working
// Uses built-in fetch (Node 18+)

async function diagnose() {
    console.log('🔍 DIAGNOSTIC CHECK FOR STOPS MANAGEMENT\n');
    console.log('='.repeat(50));
    
    // Check 1: Backend server
    console.log('\n📡 Check 1: Backend Server');
    try {
        const healthCheck = await fetch('http://localhost:5000/health');
        const healthData = await healthCheck.json();
        console.log('✅ Backend is running:', healthData.status);
    } catch (err) {
        console.log('❌ Backend is NOT running!');
        console.log('   Solution: cd backend && npm run dev');
        return;
    }
    
    // Check 2: Stops API endpoint
    console.log('\n📡 Check 2: Stops API Endpoint');
    try {
        const response = await fetch('http://localhost:5000/api/stops');
        const result = await response.json();
        console.log('Response status:', response.status);
        console.log('Success:', result.success);
        
        if (result.success) {
            console.log('✅ API working! Found', result.data?.length || 0, 'stops');
            if (result.data && result.data.length > 0) {
                console.log('\n📋 Sample stop:');
                console.log(JSON.stringify(result.data[0], null, 2));
            } else {
                console.log('\n⚠️  No stops in database yet.');
                console.log('   This is OK - you can create one from the admin panel!');
            }
        } else {
            console.log('❌ API Error:', result.error);
            console.log('\n   Possible causes:');
            console.log('   1. Database table "stops" does not exist');
            console.log('   2. Supabase credentials are wrong');
            console.log('   3. RLS policies are blocking access');
        }
    } catch (err) {
        console.log('❌ Failed to connect to API');
        console.log('   Error:', err.message);
    }
    
    // Check 3: Try to create a test stop
    console.log('\n📡 Check 3: Test Creating a Stop');
    try {
        const testStop = {
            stop_name: 'Diagnostic Test Stop',
            stop_code: 'DIAG001',
            latitude: 20.9374,
            longitude: 77.7796,
            zone: 'Test Zone',
            is_active: true
        };
        
        const response = await fetch('http://localhost:5000/api/stops', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testStop)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Successfully created test stop!');
            console.log('   Stop ID:', result.data.id);
            
            // Clean up - delete the test stop
            console.log('\n📡 Check 4: Cleaning up test stop...');
            try {
                const deleteResponse = await fetch(`http://localhost:5000/api/stops/${result.data.id}`, {
                    method: 'DELETE'
                });
                const deleteResult = await deleteResponse.json();
                
                if (deleteResult.success) {
                    console.log('✅ Test stop deleted successfully');
                } else {
                    console.log('⚠️  Could not delete test stop (manual cleanup needed)');
                }
            } catch (err) {
                console.log('⚠️  Delete failed:', err.message);
            }
        } else {
            console.log('❌ Failed to create test stop');
            console.log('   Error:', result.error);
            console.log('\n   SOLUTION: The database table does not exist!');
            console.log('   Run the SQL script in Supabase:');
            console.log('   File: CREATE_STOPS_TABLE.sql');
        }
    } catch (err) {
        console.log('❌ Test failed:', err.message);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('\n📊 SUMMARY:');
    console.log('- If all checks passed: Everything is working! ✅');
    console.log('- If table missing: Run CREATE_STOPS_TABLE.sql in Supabase');
    console.log('- If backend not running: cd backend && npm run dev');
    console.log('\n');
}

diagnose();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_KEY;

console.log('🔍 Testing Supabase Connection...\n');
console.log('URL:', SUPABASE_URL);
console.log('Key exists:', !!SUPABASE_KEY);
console.log('Service Role Key exists:', !!SUPABASE_SERVICE_ROLE_KEY);
console.log('');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testConnection() {
    try {
        // Test 1: Check if we can connect
        console.log('📡 Test 1: Checking connection...');
        const { data: testData, error: testError } = await supabase.from('stops').select('count').limit(1);
        
        if (testError) {
            if (testError.message.includes('relation') || testError.message.includes('does not exist')) {
                console.log('❌ ERROR: The "stops" table does NOT exist in your database!');
                console.log('');
                console.log('📋 SOLUTION: You need to create the stops table first.');
                console.log('');
                console.log('Run this SQL in your Supabase SQL Editor:');
                console.log('https://app.supabase.com/project/YOUR_PROJECT/sql');
                console.log('');
                console.log('--- COPY FROM HERE ---');
                console.log(`
CREATE TABLE IF NOT EXISTS stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_name TEXT NOT NULL,
  stop_code TEXT NOT NULL UNIQUE,
  latitude FLOAT8,
  longitude FLOAT8,
  zone TEXT DEFAULT 'Other',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON stops FOR ALL TO anon USING (true) WITH CHECK (true);
                `.trim());
                console.log('--- END COPY ---');
                console.log('');
                return;
            }
            console.log('❌ Connection error:', testError.message);
            return;
        }
        
        console.log('✅ Connection successful!\n');
        
        // Test 2: Try to insert a test stop
        console.log('📡 Test 2: Trying to insert a test stop...');
        const testStop = {
            stop_name: 'Test Stop',
            stop_code: 'TEST001',
            latitude: 20.9374,
            longitude: 77.7796,
            zone: 'Test Zone',
            is_active: true
        };
        
        const { data: insertedData, error: insertError } = await supabase
            .from('stops')
            .insert([testStop])
            .select();
        
        if (insertError) {
            console.log('❌ Insert failed:', insertError.message);
            console.log('');
            console.log('Possible issues:');
            console.log('1. RLS policies are blocking inserts');
            console.log('2. Missing required fields');
            console.log('3. Duplicate stop_code');
            return;
        }
        
        console.log('✅ Insert successful!');
        console.log('Inserted stop:', insertedData[0]);
        console.log('');
        
        // Test 3: Fetch all stops
        console.log('📡 Test 3: Fetching all stops...');
        const { data: allStops, error: fetchError } = await supabase
            .from('stops')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (fetchError) {
            console.log('❌ Fetch failed:', fetchError.message);
            return;
        }
        
        console.log(`✅ Found ${allStops?.length || 0} stops in database`);
        console.log('');
        
        // Test 4: Clean up - delete the test stop
        console.log('📡 Test 4: Cleaning up test stop...');
        const { error: deleteError } = await supabase
            .from('stops')
            .delete()
            .eq('stop_code', 'TEST001');
        
        if (deleteError) {
            console.log('⚠️  Delete failed:', deleteError.message);
        } else {
            console.log('✅ Test stop deleted successfully');
        }
        
        console.log('');
        console.log('🎉 All tests passed! Your database is working correctly.');
        console.log('');
        console.log('Next steps:');
        console.log('1. Make sure backend server is running: cd backend && npm run dev');
        console.log('2. Navigate to http://localhost:5000/api/stops to see all stops');
        console.log('3. Try creating a stop from the admin panel');
        
    } catch (err: any) {
        console.log('❌ Unexpected error:', err.message);
        console.log('Stack:', err.stack);
    }
}

testConnection();

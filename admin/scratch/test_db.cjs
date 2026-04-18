const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vcahhbylqrlqntnibjzt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PwxcutOw2EqEC5pY3c0JcA_Ae17iVNc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log("🔍 Testing Supabase Connection...");
  
  const { data, error } = await supabase.from('stops').select('*').limit(1);
  
  if (error) {
    console.error("❌ ERROR DETECTED:");
    console.error("   Code: ", error.code);
    console.error("   Message: ", error.message);
    if (error.code === '42P01') {
      console.log("\n💡 DIAGNOSIS: The table 'stops' does not exist in your Supabase project.");
    } else if (error.code === 'PGRST116') {
      console.log("\n💡 DIAGNOSIS: Connection established, but the table is empty.");
    }
  } else {
    console.log("✅ SUCCESS: Table 'stops' found and connected.");
    console.log(`📊 Found ${data.length} records.`);
  }
}

test();

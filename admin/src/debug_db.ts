import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vcahhbylqrlqntnibjzt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PwxcutOw2EqEC5pY3c0JcA_Ae17iVNc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testSupabase() {
  console.log('Testing Supabase Connection...');
  
  // 1. Check if table exists
  const { data: selectData, error: selectError } = await supabase
    .from('stops')
    .select('count', { count: 'exact', head: true });
    
  if (selectError) {
    console.error('Select Error:', selectError);
    return;
  }
  console.log('Table found. Current count:', selectData);

  // 2. Try simple insert
  const testStop = {
    name: 'Connection Test ' + Date.now(),
    route: 'Debug',
    lat: 20.93,
    lng: 77.78
  };
  
  console.log('Attempting insert:', testStop);
  const { data: insertData, error: insertError } = await supabase
    .from('stops')
    .insert(testStop)
    .select();
    
  if (insertError) {
    console.error('Insert Error:', insertError);
  } else {
    console.log('Insert Success:', insertData);
    
    // 3. Cleanup
    const { error: deleteError } = await supabase
      .from('stops')
      .delete()
      .eq('id', insertData[0].id);
    console.log('Cleanup Success');
  }
}

testSupabase();

#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('🚀 Running AI Config System migration...\n');

  // Read migration file
  const migrationPath = path.join(__dirname, 'services/supabase/supabase/migrations/005_ai_config_system.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('📄 Migration file loaded:', migrationPath);
  console.log('📊 SQL length:', sql.length, 'characters\n');

  try {
    // Execute the migration using rpc
    // Since we can't execute raw SQL directly via JS client, we'll use the REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      // If rpc doesn't exist, we need to create tables manually via API calls
      console.log('⚠️  Direct SQL execution not available via REST API');
      console.log('📋 Please run this SQL manually in Supabase Dashboard:');
      console.log('   1. Go to: https://supabase.com/dashboard/project/jlatbisropqmrkilphuz/editor');
      console.log('   2. Click "SQL Editor"');
      console.log('   3. Paste the contents of:', migrationPath);
      console.log('   4. Click "Run"\n');
      
      // Check if tables already exist
      const { data: tables, error } = await supabase
        .from('ai_features')
        .select('count')
        .limit(0);
      
      if (error && error.code === 'PGRST204') {
        console.log('❌ Table ai_features does not exist yet');
        console.log('   👉 Please run the migration manually as described above\n');
      } else if (!error) {
        console.log('✅ Table ai_features already exists!');
        console.log('   Migration may have already been run.\n');
      }
      
      process.exit(0);
    }

    console.log('✅ Migration executed successfully!\n');

    // Verify tables exist
    const { data, error } = await supabase
      .from('ai_features')
      .select('feature_id, name')
      .limit(5);

    if (error) {
      console.error('❌ Error verifying tables:', error.message);
    } else {
      console.log('✅ Tables verified! Found', data.length, 'AI features:');
      data.forEach(f => console.log('   -', f.feature_id, ':', f.name));
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();

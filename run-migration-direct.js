const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('❌ Please provide migration file path');
  process.exit(1);
}

const sql = fs.readFileSync(migrationFile, 'utf8');

console.log(`📋 Running migration: ${migrationFile}`);
console.log(`📊 SQL length: ${sql.length} characters\n`);

// Execute SQL via REST API directly
async function runMigration() {
  try {
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`🔄 Executing ${statements.length} statements...\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Skip comments and empty lines
      if (statement.startsWith('--') || statement.trim() === ';') {
        continue;
      }
      
      try {
        // Use raw SQL execution via REST
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          // If RPC doesn't exist, try via fetch
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql_query: statement })
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
          }
        }
        
        successCount++;
        process.stdout.write(`✓`);
      } catch (err) {
        errorCount++;
        console.error(`\n❌ Error on statement ${i + 1}:`, statement.substring(0, 100));
        console.error(`   ${err.message}\n`);
      }
    }
    
    console.log(`\n\n✅ Migration complete: ${successCount} successful, ${errorCount} errors`);
    
    if (errorCount > 0) {
      console.log('\n📝 Some statements failed. You may need to run them manually in Supabase SQL Editor.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error('\n📝 Please run this SQL manually in Supabase SQL Editor:');
    console.error('='.repeat(80));
    console.error(sql);
    console.error('='.repeat(80));
    process.exit(1);
  }
}

runMigration();



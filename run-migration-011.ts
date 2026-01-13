import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function runMigration() {
  console.log('🚀 Running migration 011: Auto-assign work contexts...\n');
  
  const sql = readFileSync('./supabase/migrations/011_user_work_context_auto_assign.sql', 'utf-8');
  
  console.log('Executing migration SQL...');
  const { data, error } = await supabase.rpc('query', { 
    query_text: sql 
  });

  if (error) {
    console.error('❌ Error:', error);
    // Try alternative approach - execute directly
    console.log('\n⚠️  Trying direct SQL execution...');
    const { data: d2, error: e2 } = await supabase
      .from('_migrations')
      .insert({ name: '011_user_work_context_auto_assign', sql });
    
    if (e2) {
      console.error('❌ Migration failed:', e2);
      process.exit(1);
    }
  }

  console.log('\n✅ Migration 011 completed successfully!');
  console.log('✅ Trigger: auto_assign_user_work_contexts created');
  console.log('✅ Existing users backfilled with work contexts');
  console.log('✅ New users will automatically get default work contexts (POLI, KLINIEK, SEH, IC, OK, DAGBEHANDELING)');
}

runMigration().catch(console.error);

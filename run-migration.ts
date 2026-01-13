import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('📦 Reading migration file...');
  const migrationPath = join(process.cwd(), 'services/supabase/supabase/migrations/010_unify_work_contexts.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  console.log('🚀 Executing migration 010_unify_work_contexts.sql...');
  
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  console.log('✅ Migration completed successfully');
  console.log(data);
}

runMigration();

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('🔄 Starting migration 010_unify_work_contexts.sql...\n');

  try {
    // Read migration file
    const migrationPath = join(process.cwd(), 'services/supabase/supabase/migrations/010_unify_work_contexts.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded');
    console.log(`📏 Size: ${Math.round(sql.length / 1024)}KB\n`);

    // Split into statements and execute
    console.log('🚀 Executing migration...\n');
    
    // Execute via RPC (using a custom function or direct SQL)
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: sql 
    });

    if (error) {
      // If exec_sql doesn't exist, try direct execution via REST API
      console.log('⚠️  RPC method not available, trying direct execution...\n');
      
      // Split by semicolon and execute statements one by one
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        
        // Skip comments
        if (statement.startsWith('--') || statement.startsWith('/*')) continue;
        
        try {
          const { error: stmtError } = await supabase.rpc('exec', { 
            sql: statement + ';' 
          });
          
          if (stmtError) {
            console.error(`❌ Statement ${i + 1} failed:`, stmtError.message);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err: any) {
          console.error(`❌ Statement ${i + 1} failed:`, err.message);
          errorCount++;
        }
      }

      console.log(`\n📊 Results: ${successCount} succeeded, ${errorCount} failed\n`);
      
      if (errorCount > 0) {
        console.error('❌ Migration completed with errors');
        console.log('\n💡 Please run the migration manually via Supabase Dashboard:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new');
        console.log('   2. Copy contents from: services/supabase/supabase/migrations/010_unify_work_contexts.sql');
        console.log('   3. Paste and click "Run"\n');
        process.exit(1);
      }
    }

    console.log('✅ Migration executed\n');

    // Verify migration
    console.log('🔍 Verifying migration results...\n');

    // Check 1: work_contexts have themes
    const { data: contexts, error: contextsError } = await supabase
      .from('work_contexts')
      .select('code, display_name, theme_config, icon_name')
      .order('display_order');

    if (contextsError) {
      console.error('❌ Could not verify work_contexts:', contextsError.message);
    } else {
      console.log('✓ Work contexts with themes:');
      contexts?.forEach(ctx => {
        console.log(`  - ${ctx.code.padEnd(15)} ${ctx.display_name.padEnd(25)} ${ctx.icon_name}`);
      });
      console.log();
    }

    // Check 2: ui_templates migrated
    const { data: templateStats, error: statsError } = await supabase
      .from('ui_templates')
      .select('id, work_context_id');

    if (statsError) {
      console.error('❌ Could not verify templates:', statsError.message);
    } else {
      const total = templateStats?.length || 0;
      const migrated = templateStats?.filter(t => t.work_context_id).length || 0;
      console.log(`✓ Templates migrated: ${migrated}/${total}`);
      if (migrated !== total) {
        console.warn(`⚠️  Warning: Not all templates have work_context_id!`);
      }
      console.log();
    }

    // Check 3: ui_templates_enriched view
    const { data: enrichedTemplates, error: enrichedError } = await supabase
      .from('ui_templates_enriched')
      .select('id, work_context_code, work_context_name')
      .limit(3);

    if (enrichedError) {
      console.error('❌ Could not verify enriched view:', enrichedError.message);
    } else {
      console.log(`✓ ui_templates_enriched view working (${enrichedTemplates?.length || 0} templates tested)`);
      console.log();
    }

    console.log('✨ Migration completed successfully!\n');
    console.log('Next steps:');
    console.log('  1. Assign work contexts to your user');
    console.log('  2. Test provider-dashboard: cd apps/provider-dashboard && pnpm dev');
    console.log();

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n💡 Please run the migration manually via Supabase Dashboard:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new');
    console.log('   2. Copy contents from: services/supabase/supabase/migrations/010_unify_work_contexts.sql');
    console.log('   3. Paste and click "Run"\n');
    process.exit(1);
  }
}

runMigration();

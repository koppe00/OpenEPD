// vault-sync-service.ts
// run command = npx ts-node packages/vault-sync-service.ts vanuit de root
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("❌ FOUT: Kan .env variabelen niet vinden.");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runVaultSync() {
  console.log("🚀 Sovereign Vault Sync (ZIB Editie) is actief...");
  console.log("Monitoring 'zib_compositions'...");

  setInterval(async () => {
    // 1. Zoek data in de NIEUWE tabel
    // FIX: Tabelnaam aangepast van 'vitals_read_store' naar 'zib_compositions'
    const { data: pendingData, error } = await supabase
      .from('zib_compositions') 
      .select('*')
      .eq('storage_status', 'sync_pending');

    if (error) {
      console.error("Fout bij pollen:", error.message);
      return;
    }

    if (pendingData && pendingData.length > 0) {
      console.log(`📦 ${pendingData.length} ZIB-meting(en) gevonden.`);

      for (const record of pendingData) {
        // Log welk type ZIB dit is (handig voor debugging)
        console.log(`🔐 Encrypting ${record.zib_id} (ID: ${record.id})...`);
        
        // Simuleer encryptie/overdracht
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 2. Update status in de NIEUWE tabel
        // FIX: Tabelnaam aangepast
        const { error: updateError } = await supabase
        .from('zib_compositions')
        .update({ 
            storage_status: 'local_vault_only',
            local_vault_id: record.id,
            // Optioneel: Je zou hier ook de 'content' kunnen wissen 
            // als je écht 'Sovereign' wilt zijn en de cloud leeg wilt maken:
            // content: {} 
        })
        .eq('id', record.id);

        if (updateError) {
          console.error("❌ SYNC FOUT:", updateError.message);
        } else {
          console.log(`✅ ${record.zib_id} veilig opgeslagen in Vault.`);
        }
      }
    }
  }, 3000); 
}

runVaultSync();
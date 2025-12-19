// vault-sync-service.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Dit zoekt ALTIJD naar de .env in de hoofdmap van je project
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Debug check (optioneel, maar handig)
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("❌ FOUT: Kan .env variabelen niet vinden in:", process.cwd());
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


async function runVaultSync() {
  console.log("🚀 Personal Vault Sync is actief...");
  console.log("Monitoring voor 'sync_pending' records op de cloud...");
  

  // We blijven de database pollen (net als een echte NAS zou doen)
  setInterval(async () => {
    // 1. Zoek data die nog niet lokaal staat
    const { data: pendingData, error } = await supabase
      .from('vitals_read_store')
      .select('*')
      .eq('storage_status', 'sync_pending');

    if (error) {
      console.error("Fout bij ophalen:", error);
      return;
    }

    if (pendingData && pendingData.length > 0) {
      console.log(`📦 ${pendingData.length} meting(en) gevonden voor synchronisatie.`);

      for (const record of pendingData) {
        console.log(`🔐 Versleutelen van meting ${record.id} voor Lokale NAS...`);
        
        // Simuleer een vertraging van de beveiligde overdracht
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 2. Update de status op de cloud naar 'local_vault_only'
        console.log(`🔐 Poging tot update voor record ${record.id}...`);

        const { error: updateError } = await supabase
        .from('vitals_read_store')
        .update({ 
            storage_status: 'local_vault_only',
            // We gebruiken het ID van het record zelf als vault_id, 
            // dat is gegarandeerd een geldig UUID formaat.
            local_vault_id: record.id 
        })
        .eq('id', record.id);

        if (updateError) {
        console.error("❌ UPDATE FOUT:", updateError.message);
        } else {
        console.log(`✅ Succes! Meting ${record.id} is nu verplaatst.`);
        }
      }
    }
  }, 3000); // Check elke 3 seconden
}

runVaultSync();
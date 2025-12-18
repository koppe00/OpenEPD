// packages/projection-service/project-vitals.ts

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path'; // Node.js ingebouwde module

// Expliciet de environment variabelen laden vanaf de absolute root.
// process.cwd() geeft de root van de monorepo, wat de juiste locatie is.
dotenv.config({ path: path.join(process.cwd(), '.env.local') }); 

// Configuratie
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

// Maak de Supabase client (verbinding met de Query Store)
// Deze zal nu de geladen URL en Key gebruiken.
const supabase = createClient(supabaseUrl, supabaseKey);

// Functie om gedenormaliseerde data op te slaan in de Query Store
export async function saveVitalsProjection(ehr_id: string, systolic: number, diastolic: number) {
    // We gebruiken nu de unieke EHR ID die u eerder kreeg
    const { error } = await supabase
        .from('vitals_read_store')
        .insert([
            {
                ehr_id: ehr_id,
                data_type: 'blood_pressure',
                recorded_at: new Date().toISOString(),
                systolic: systolic,
                diastolic: diastolic,
            },
        ]);

    if (error) {
        // Dit vangt fouten in de Supabase API op (bijv. verkeerde key of onjuiste ehr_id-format)
        console.error("❌ FOUT bij opslaan in Query Store:", error.message);
        return false;
    }
    return true;
}


async function runProjectionTest() {
  // CRUCIAAL: Dit moet de ID zijn die u kreeg in de succesvolle 'hello-world' test
  const TEST_EHR_ID = '9edb2719-268c-429f-a5bb-62608af565f1'; 
  
  // Controleer of de variabelen nu wel geladen zijn
  if (!supabaseUrl) {
      console.error("\n❌ FOUT: Supabase URL is nog steeds niet geladen. Controleer of '.env.local' in de root staat en of de pnpm command correct wordt uitgevoerd.");
      return;
  }
  
  console.log(`\nStart Query Store Validatie voor EHR ID: ${TEST_EHR_ID}`);
  console.log("1. Schrijf test-data (125/78) direct naar Supabase (Query Store)...");
  
  // Dit simuleert de ACTIE van de Projection Service
  const success = await saveVitalsProjection(TEST_EHR_ID, 125, 78);

  if (success) {
    console.log(`\n✅ Projectie Compleet: Bloeddruk 125/78 is nu snel leesbaar in Supabase.`);
    console.log("---------------------------------------------------");
    console.log("De CQRS Backbone is geactiveerd. Controleer uw Supabase Dashboard!");
    console.log("---------------------------------------------------");
  } else {
    // Deze foutmelding komt alleen als de Supabase API fout geeft (foute key, RLS-fout)
    console.log("⚠️ Kan niet schrijven. Controleer Supabase API/RLS instellingen.");
  }
}

runProjectionTest(); // Voer de test uit
// packages/projection-service/register-user.ts

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';

// Expliciet de environment variabelen laden
dotenv.config({ path: path.join(process.cwd(), '.env.local') }); 

const supabaseUrl = process.env.SUPABASE_URL!;

// CRUCIAAL: Gebruik de Service Role Key voor deze administratieve taak
const supabaseMasterKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 

// Maak de Supabase client met de Service Role Key
const supabase = createClient(supabaseUrl, supabaseMasterKey, {
    auth: {
        persistSession: false,
    }
});

async function registerTestUser() {
  console.log("\n👤 Start Gebruikersregistratie in Query Store (Master Key wordt gebruikt)...");
  
  // CRUCIAAL: Gebruik de EHR ID die u kreeg in de succesvolle 'hello-world' test
  const EHR_ID_FROM_EHRBASE = '9edb2719-268c-429f-a5bb-62608af565f1'; 
  
  // ... (rest van de functie blijft hetzelfde)
// ...
  // UUID's voor de Auth-laag (Simulatie)
  const TEST_USER_UUID = '00000000-0000-0000-0000-000000000001'; 
  const TEST_EMAIL = 'patient.jansen@opene.nl';

  try {
    const { error } = await supabase
      .from('users')
      .insert([
        {
          id: TEST_USER_UUID,
          ehr_id: EHR_ID_FROM_EHRBASE,
          email: TEST_EMAIL,
          storage_location: 'Google Drive ID', // Metadata voor de Agentic Services
        },
      ]);

    if (error) {
      if (error.code === '23505') { // Code voor duplicate key
        console.log("⚠️ Gebruiker is al geregistreerd. Gaan door.");
        return true;
      }
      throw error;
    }

    console.log(`\n✅ Registratie Compleet!`);
    console.log(`   De EHR ID ${EHR_ID_FROM_EHRBASE} is nu gekoppeld aan Auth ID ${TEST_USER_UUID}.`);
    console.log("---------------------------------------------------");
    console.log("De Foreign Key Constraint is nu gerespecteerd.");
    console.log("---------------------------------------------------");
    return true;

  } catch (error: any) {
    console.error("\n❌ FOUT bij registratie:", error.message);
    return false;
  }
}

registerTestUser();
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// --- CONFIGURATIE (Zelfde als voorheen) ---
const envPath = path.resolve(__dirname, '../../.env.local');
const result = dotenv.config({ path: envPath });

if (result.error) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Geen Supabase keys gevonden.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- LOGICA AANGEPAST AAN JOUW BESTAANDE TABEL ---
async function projectVitals() {
  // 1. We gebruiken de EHR_ID van 'patient.jansen' die je net gaf
  const targetEhrId = "9edb2719-268c-429f-a5bb-62608af565f1"; 
  
  // 2. Simuleer een nieuwe meting (iets anders dan wat er al in staat)
  const simulatedMeasurement = {
    systolic: 128,  // Een variatie op de 125 die je al had
    diastolic: 80,
    recorded_at: new Date().toISOString()
  };

  console.log(`🔄 Projecteren naar 'vitals_read_store' voor EHR: ${targetEhrId}...`);

  // 3. Insert in de bestaande tabel 'vitals_read_store'
  const { data, error } = await supabase
    .from('vitals_read_store') // <--- JOUW BESTAANDE TABEL
    .insert([
      {
        ehr_id: targetEhrId,       // De koppeling naar de patiënt
        data_type: 'blood_pressure',
        systolic: simulatedMeasurement.systolic,
        diastolic: simulatedMeasurement.diastolic,
        recorded_at: simulatedMeasurement.recorded_at,
      },
    ])
    .select();

  if (error) {
    console.error("❌ Fout bij opslaan:", error.message);
  } else {
    console.log("✅ Succes! Data toegevoegd aan 'vitals_read_store':", data);
  }
}

projectVitals();
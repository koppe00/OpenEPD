import { createClient } from '@supabase/supabase-js';

// Gebruik de environment variabelen die we in Stap 1 hebben gedefinieerd
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set in the environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Dit object zal de gedenormaliseerde data in de Query Store opslaan
export async function saveVitalsProjection(ehr_id: string, systolic: number, diastolic: number) {
    const { data, error } = await supabase
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
        console.error("❌ FOUT bij opslaan in Query Store:", error.message);
        return false;
    }
    return true;
}
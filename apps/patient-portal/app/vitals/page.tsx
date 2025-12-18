// apps/patient-portal/app/vitals/page.tsx

import { createClient } from '@supabase/supabase-js';

// Let op: In een echte app zou de 'auth.uid()' van de patiënt dynamisch geladen worden,
// en gebruikt worden om de EHR ID uit de 'users' tabel te halen.
// Nu gebruiken we de direct bekende EHR ID.
const TEST_EHR_ID = '9edb2719-268c-429f-a5bb-62608af565f1'; 

// Environment variables (gebruiken de ANONYMOUS key voor leesacties)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables zijn niet geladen in Next.js (Patient Portal)');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface VitalsRecord {
  ehr_id: string;
  systolic: number;
  diastolic: number;
  recorded_at: string;
}

// Data fetching functie: Haalt ALLE vitals op die horen bij DIT EHR ID
async function fetchPatientVitals(): Promise<VitalsRecord[]> {
  const { data, error } = await supabase
    .from('vitals_read_store')
    .select('systolic, diastolic, recorded_at')
    .eq('ehr_id', TEST_EHR_ID) // <-- CRUCIALE FILTER: Toont alleen data van dit EHR ID
    .order('recorded_at', { ascending: false });

  if (error) {
    console.error('Fout bij het ophalen van patiënt data:', error);
    return [];
  }

  return data as VitalsRecord[];
}

// De Component
export default async function PatientVitalsPage() {
  const patientVitals = await fetchPatientVitals();
  const criticalCount = patientVitals.filter(v => v.systolic > 120).length;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Mijn Gedeelde Gegevens (Patiënt Portaal)</h1>
      <p className="mb-4 text-sm text-gray-600">
        **Status EHR ID:** {TEST_EHR_ID}
      </p>

      {patientVitals.length > 0 ? (
        <div className="space-y-4">
          <p className="font-semibold text-xl border-b pb-2">Overzicht Vitale Functies ({patientVitals.length} metingen)</p>
          {patientVitals.map((item, index) => (
            <div key={index} className={`p-4 rounded-lg shadow-sm ${item.systolic > 120 ? 'bg-yellow-100' : 'bg-green-50'}`}>
              <p className="font-semibold">Bloeddruk: {item.systolic}/{item.diastolic} mmHg</p>
              {item.systolic > 120 && <p className="text-red-700 text-xs mt-1">Opmerking: Is boven de drempel van de Triage Agent.</p>}
              <p className="text-xs text-gray-500">
                Opgenomen: {new Date(item.recorded_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Geen vitale functies gevonden in uw dossier.</p>
      )}

      <p className="mt-8 text-xs text-gray-400">
        (Data gefilterd op EHR ID, direct vanuit de Query Store, ter illustratie van privacy.)
      </p>
    </div>
  );
}
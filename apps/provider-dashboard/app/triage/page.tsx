// apps/provider-dashboard/app/triage/page.tsx

import { createClient } from '@supabase/supabase-js';

// De Next.js component moet de Supabase client aanmaken
// Dit is de meest betrouwbare manier om de environment variabelen te lezen in Next.js
// Let op: De Supabase client hier gebruikt de ANONYMOUS key (read-only)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables zijn niet geladen in Next.js');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Interfaces voor de Triage Data
interface VitalsRecord {
  ehr_id: string;
  systolic: number;
  diastolic: number;
  recorded_at: string;
}

// Data fetching functie: Haalt kritieke data op uit de CQRS Query Store
async function fetchTriageData(): Promise<VitalsRecord[]> {
  const CRITICAL_THRESHOLD = 120; // Gebaseerd op de Triage Agent logica

  // Query de vitals_read_store direct
  const { data, error } = await supabase
    .from('vitals_read_store')
    .select('ehr_id, systolic, diastolic, recorded_at')
    .gt('systolic', CRITICAL_THRESHOLD) // Filter op de kritieke drempel
    .order('recorded_at', { ascending: false });

  if (error) {
    console.error('Fout bij het ophalen van triage data:', error);
    return [];
  }

  return data as VitalsRecord[];
}

// De Component (toont de kritieke meldingen)
export default async function TriagePage() {
  const triageData = await fetchTriageData();
  const criticalCount = triageData.length;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Triage Meldingen (CQRS Query Store)</h1>
      <p className={`mb-4 text-lg ${criticalCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
        {criticalCount} kritieke meldingen gevonden in de laatste 24 uur.
      </p>

      {criticalCount > 0 ? (
        <div className="space-y-4">
          {triageData.map((item, index) => (
            <div key={index} className="p-4 border border-red-300 rounded-lg bg-red-50 shadow-md">
              <p className="font-semibold text-red-800">🚨 KRITIEK: Bloeddruk</p>
              <p className="text-sm">EHR ID: {item.ehr_id}</p>
              <p className="text-xl my-1">
                {item.systolic}/{item.diastolic} mmHg
              </p>
              <p className="text-xs text-gray-500">
                Opgenomen: {new Date(item.recorded_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Geen actieve kritieke meldingen gevonden.</p>
      )}

      <p className="mt-8 text-sm text-gray-400">
        (Data direct gelezen van Supabase Query Store voor maximale snelheid.)
      </p>
    </div>
  );
}
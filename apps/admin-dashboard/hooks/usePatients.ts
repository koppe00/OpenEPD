import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function usePatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchPatients = async () => {
    setLoading(true);
    // Beperkte selectie conform privacy-ontwerp (geen medische data)
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, bsn_number, date_of_birth, wid_status')
      .eq('is_patient', true)
      .order('full_name');

    setPatients(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  return { patients, loading, refresh: fetchPatients };
}
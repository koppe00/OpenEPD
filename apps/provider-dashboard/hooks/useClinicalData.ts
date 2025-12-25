'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// Type voor de frontend
export interface ClinicalObservation {
  id: string;
  zib_id: string;
  patient_id: string;
  effective_at: string;
  value: Record<string, unknown>;
  unit?: string;
}

// Type voor de ruwe database row
interface ZibCompositionRow {
  id: string;
  zib_id: string;
  patient_id: string;
  effective_at: string;
  content: Record<string, unknown>;
}

export const useClinicalData = (patientId?: string) => {
  const [observations, setObservations] = useState<ClinicalObservation[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  // 1. We definiëren de fetch logica als een pure functie binnen de hook,
  // maar we roepen hem nog niet aan.
  const executeFetch = useCallback(async () => {
    if (!patientId) return [];

    const { data, error } = await supabase
      .from('zib_compositions')
      .select('*')
      .eq('patient_id', patientId)
      .order('effective_at', { ascending: false });

    if (error) {
      console.error('Vault access error:', error);
      return [];
    }

    // Cast en map de data
    const rows = data as unknown as ZibCompositionRow[];
    return rows.map((row) => ({
      id: row.id,
      zib_id: row.zib_id,
      patient_id: row.patient_id,
      effective_at: row.effective_at,
      value: row.content
    }));
  }, [patientId, supabase]);

  // 2. Dit is de "Refetch" functie die we naar buiten exposen (voor de Save knop)
  const refetch = useCallback(async () => {
    setLoading(true);
    const data = await executeFetch();
    setObservations(data);
    setLoading(false);
  }, [executeFetch]);

  // 3. De Effect Hook regelt de initiële load en de subscription
  useEffect(() => {
    if (!patientId) return;

    let isActive = true; // Voorkomt race conditions (standaard React pattern)

    const init = async () => {
      setLoading(true); 
      const data = await executeFetch();
      if (isActive) {
        setObservations(data);
        setLoading(false);
      }
    };

    init();

    // Setup Real-time Subscription
    const channel = supabase
      .channel(`vault_sync_${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'zib_compositions',
          filter: `patient_id=eq.${patientId}`
        },
        () => {
          // Als er data verandert, halen we opnieuw op
          if (isActive) {
             // We roepen executeFetch direct aan om state te updaten
             executeFetch().then(newData => {
                if (isActive) setObservations(newData);
             });
          }
        }
      )
      .subscribe();

    return () => {
      isActive = false;
      supabase.removeChannel(channel);
    };
  }, [patientId, supabase, executeFetch]);

  return { observations, loading, refetch };
};
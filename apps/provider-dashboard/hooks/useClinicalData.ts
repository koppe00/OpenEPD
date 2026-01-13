'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabaseBrowserClient, withSessionProtection } from '@/lib/supabase';

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
    const supabase = getSupabaseBrowserClient();

  const [observations, setObservations] = useState<ClinicalObservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Sessie refresh mechanisme om sessie actief te houden
  // Vermijd te frequente refreshes om realtime verbindingen niet te verstoren
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const interval = setInterval(async () => {
      try {
        // Controleer sessie status zonder refresh te forceren
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session && !error) {
          // Sessie is nog geldig, refresh alleen als echt nodig
          const now = Math.floor(Date.now() / 1000);
          const expiresAt = session.expires_at;
          // Refresh alleen als minder dan 2 minuten over (in plaats van 5)
          if (expiresAt && expiresAt - now < 120) {
            console.log('[Session] Refreshing session before expiry');
            await supabase.auth.refreshSession();
          }
        }
      } catch (err) {
        console.warn('[Session] Refresh error:', err);
      }
    }, 60000); // elke minuut checken in plaats van elke 30 seconden
    return () => clearInterval(interval);
  }, []); // Remove supabase dependency to avoid re-creating interval

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
  }, [executeFetch, patientId]);

  // 3. De Effect Hook regelt de initiële load en de subscription
  useEffect(() => {
    if (!patientId) return;

    let isActive = true; // Voorkomt race conditions (standaard React pattern)
    let channel: any = null;
    let subscriptionTimeout: NodeJS.Timeout;

    const init = async () => {
      setLoading(true);
      const data = await executeFetch();
      if (isActive) {
        setObservations(data);
        setLoading(false);
      }
    };

    // Debounce subscription setup to prevent rapid switching issues
    subscriptionTimeout = setTimeout(async () => {
      if (!isActive) return;

      init();

      // Setup Real-time Subscription with error handling and session preservation
      const setupSubscription = async () => {
        return withSessionProtection(async () => {
          const channelName = `vault_sync_${patientId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; // Unique channel name
          const newChannel = supabase
            .channel(channelName, {
              config: {
                broadcast: { self: false },
                presence: { key: '' }
              }
            })
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'zib_compositions',
                filter: `patient_id=eq.${patientId}`
              },
              (payload: any) => {
                // Als er data verandert, halen we opnieuw op maar alleen als component nog actief is
                if (isActive) {
                  // Debounce updates to prevent excessive API calls during rapid changes
                  setTimeout(() => {
                    if (isActive) {
                      executeFetch().then((newData: ClinicalObservation[]) => {
                        if (isActive) {
                          setObservations(newData);
                        }
                      }).catch((error: any) => {
                        console.error('[Realtime] Error fetching data:', error);
                      });
                    }
                  }, 100); // Small debounce to batch rapid updates
                }
              }
            )
            .subscribe((status: string, err?: any) => {
              if (status === 'SUBSCRIBED') {
                console.log(`[Realtime] Successfully subscribed to patient ${patientId}`);
              } else if (status === 'CHANNEL_ERROR') {
                console.error(`[Realtime] Channel error for patient ${patientId}:`, err);
              } else if (status === 'TIMED_OUT') {
                console.warn(`[Realtime] Channel timed out for patient ${patientId}`);
              } else if (status === 'CLOSED') {
                console.log(`[Realtime] Channel closed for patient ${patientId}`);
              } else {
                console.log(`[Realtime] Channel status for patient ${patientId}:`, status);
              }
            });

          return newChannel;
        }, `subscription setup for patient ${patientId}`);
      };

      // Setup subscription synchronously and store reference
      setupSubscription().then((ch: any) => {
        if (isActive) {
          channel = ch;
        } else {
          // If component is no longer active, immediately unsubscribe
          ch.unsubscribe();
        }
      }).catch((error: any) => {
        // error handling
      });
    }, 200); // 200ms debounce to prevent rapid switching issues

    return () => {
      isActive = false;
      clearTimeout(subscriptionTimeout);
      // Properly unsubscribe from channel
      if (channel) {
        try {
          console.log(`[Realtime] Unsubscribing from patient ${patientId}`);
          channel.unsubscribe();
          // Also try to remove from Supabase's channel registry
          if (supabase && typeof supabase.removeChannel === 'function') {
            supabase.removeChannel(channel);
          }
        } catch (error: any) {
          console.error(`[Realtime] Error unsubscribing from patient ${patientId}:`, error);
        }
      }
    };
  }, [patientId]); // Only depend on patientId to avoid unnecessary re-subscriptions

  return { observations, loading, refetch };
};
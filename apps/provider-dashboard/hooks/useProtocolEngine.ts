import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ClinicalObservation } from './useClinicalData';

// 1. Strictere Types (Geen 'any' meer)
export interface ProtocolAction {
  id: string;
  label: string;
  action_type: string;
  ui_color_class: string;
  action_payload: Record<string, unknown>; // Vervangt 'any'
}

export interface ActiveProtocol {
  id: string;
  title: string;
  alert_message?: string;
  actions: ProtocolAction[];
}

// Interne interface voor de Supabase response
interface DBProtocolRule {
  id: string;
  logic_type: string;
  condition_json: unknown; // We casten dit veilig tijdens runtime
  alert_message: string;
  protocol: {
    id: string;
    title: string;
    is_active: boolean;
  } | null; // Kan null zijn door de join
}

export function useProtocolEngine(observations: ClinicalObservation[] | undefined) {
  const [activeProtocols, setActiveProtocols] = useState<ActiveProtocol[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase client declareren we buiten de effect, maar gebruiken we erin
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // 2. Logic verplaatst naar binnenin useEffect (voorkomt hoisting & dep issues)
    const evaluateRules = async () => {
      // Check vooraf: als er geen observaties zijn, kunnen we niet matchen
      if (!observations) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data: allRules } = await supabase
        .from('protocol_rules')
        .select(`
          id,
          logic_type,
          condition_json,
          alert_message,
          protocol:clinical_protocols (
            id,
            title,
            is_active
          )
        `)
        .eq('protocol.is_active', true)
        .returns<DBProtocolRule[]>(); // Type assertion voor Supabase response

      if (!allRules) {
        setLoading(false);
        return;
      }

      const matchedProtocolIds = new Set<string>();
      const protocolsFound: ActiveProtocol[] = [];

      for (const rule of allRules) {
        // Veiligheidscheck: bestaat het protocol object? (door join)
        if (!rule.protocol) continue;

        const condition = rule.condition_json as { zib: string, operator: string, value: string };
        
        if (matchedProtocolIds.has(rule.protocol.id)) continue;

        const match = observations.find(obs => {
          if (obs.zib_id !== condition.zib) return false;
          
          const contentString = JSON.stringify(obs.content).toLowerCase();
          const valueString = condition.value.toLowerCase();
          
          return contentString.includes(valueString);
        });

        if (match) {
          const protocolId = rule.protocol.id;
          matchedProtocolIds.add(protocolId);

          const { data: actions } = await supabase
            .from('protocol_actions')
            .select('*')
            .eq('protocol_id', protocolId)
            .order('sort_order')
            .returns<ProtocolAction[]>(); // Type assertion

          protocolsFound.push({
            id: protocolId,
            title: rule.protocol.title,
            alert_message: rule.alert_message,
            actions: actions || []
          });
        }
      }

      setActiveProtocols(protocolsFound);
      setLoading(false);
    };

    evaluateRules();
    // Dependencies zijn nu correct
  }, [observations, supabase]);

  return { activeProtocols, loading };
}
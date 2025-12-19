'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Activity, Shield, Clock, CheckCircle2, HeartPulse, Sparkles, AlertCircle } from 'lucide-react';
import { createPatientAdvicePrompt, AI_CONFIG } from '../config/prompts';

interface VitalSign {
  id: number;
  ehr_id: string;
  data_type: string;
  systolic: number;
  diastolic: number;
  recorded_at: string;
  agent_note?: string;
  storage_status?: string;
}

export default function PatientPortal() {
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [patientAdvice, setPatientAdvice] = useState<string>("Uw gegevens worden geanalyseerd...");
  const [loading, setLoading] = useState(true);
  const [isAiOverloaded, setIsAiOverloaded] = useState(false); // Nieuwe state voor rate-limits

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  // --- AI FUNCTIE ---
  const generatePatientFriendlyAdvice = useCallback(async (vital: VitalSign) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        setPatientAdvice("AI configuratie ontbreekt.");
        return;
    }

    // Reset error state bij nieuwe poging
    setIsAiOverloaded(false);

    const promptText = createPatientAdvicePrompt(
        vital.systolic, 
        vital.diastolic, 
        vital.agent_note
    );

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: {
                        temperature: AI_CONFIG.temperature,
                        maxOutputTokens: AI_CONFIG.maxOutputTokens
                    }
                })
            }
        );

        // --- SPECIFIEKE 429 AFHANDELING ---
        if (response.status === 429) {
            console.warn("Gemini Rate Limit Hit (429)");
            setIsAiOverloaded(true);
            setPatientAdvice("De digitale assistent is momenteel erg druk. Probeer het over een minuutje nog eens.");
            return;
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Veilige data extractie
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            setPatientAdvice(text);
        } else {
            setPatientAdvice("Kon geen advies genereren.");
        }

    } catch (e) {
        console.error("AI Error:", e);
        setPatientAdvice("Advies tijdelijk niet beschikbaar.");
    }
  }, []);

  // --- EFFECT HOOK ---
  useEffect(() => {
    const loadData = async () => {
        const { data, error } = await supabase
            .from('vitals_read_store')
            .select('*')
            .eq('ehr_id', '9edb2719-268c-429f-a5bb-62608af565f1')
            .order('recorded_at', { ascending: false });

        if (!error && data && data.length > 0) {
            setVitals(data as VitalSign[]);
            // Alleen AI aanroepen als er data is
            if (data[0]) {
                generatePatientFriendlyAdvice(data[0]);
            }
        }
        setLoading(false);
    };

    loadData();

    const channel = supabase
      .channel('patient-live-feed')
      .on(
          'postgres_changes', 
          { event: '*', schema: 'public', table: 'vitals_read_store' }, 
          () => { loadData(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, generatePatientFriendlyAdvice]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-200">
              <Shield size={20} strokeWidth={2.5} />
            </div>
            <h1 className="font-bold text-lg text-slate-800 tracking-tight">MijnOpenEPD</h1>
          </div>
          <div className="flex items-center gap-3 bg-white pl-3 pr-1 py-1 rounded-full border border-slate-200 shadow-sm">
             <span className="text-xs font-bold text-slate-600">Jan Jansen</span>
             <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">J</div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">
        
        {/* --- DE AI HEALTH COACH --- */}
        {!loading && vitals.length > 0 && (
            <div className={`rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden animate-in slide-in-from-bottom-4 duration-700 ${
                isAiOverloaded 
                    ? 'bg-gradient-to-br from-slate-600 to-slate-700 shadow-slate-200' // Grijze look bij error
                    : 'bg-gradient-to-br from-indigo-600 to-blue-700 shadow-indigo-200' // Normale blauwe look
            }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-16 blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4 opacity-80">
                        {isAiOverloaded ? <AlertCircle size={18} className="text-orange-300"/> : <Sparkles size={18} className="text-yellow-300" />}
                        <span className="text-xs font-bold uppercase tracking-widest">
                            {isAiOverloaded ? 'Systeemmelding' : 'Persoonlijk Advies'}
                        </span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
                        &quot;{patientAdvice}&quot;
                    </h2>
                    
                    <p className="text-indigo-200 text-sm mt-4 font-medium flex items-center gap-2">
                        <Clock size={14} />
                        Gebaseerd op uw meting van zojuist
                    </p>
                </div>
            </div>
        )}

        {/* --- RECENTE METINGEN --- */}
        <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <HeartPulse size={16} /> Recente Metingen
            </h3>

            {loading ? (
              <div className="h-40 bg-white rounded-[2rem] animate-pulse border border-slate-100" />
            ) : (
              <div className="space-y-4">
                {vitals.map((v) => (
                  <div key={v.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                    
                    <div className="flex items-center gap-6">
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors ${
                            v.systolic > 140 ? 'bg-rose-500 shadow-rose-200' : 'bg-emerald-500 shadow-emerald-200'
                        }`}>
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900">{v.systolic}</span>
                                <span className="text-xl text-slate-300">/</span>
                                <span className="text-3xl font-black text-slate-900">{v.diastolic}</span>
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">
                                {new Date(v.recorded_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:block text-right">
                         {v.storage_status === 'local_vault_only' ? (
                            <div className="flex items-center justify-end gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                <span className="text-[10px] font-black uppercase">In Kluis</span>
                                <CheckCircle2 size={14} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-end gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                                <span className="text-[10px] font-black uppercase">Sync...</span>
                                <Clock size={14} />
                            </div>
                        )}
                        <p className="text-[10px] text-slate-400 mt-2 max-w-[150px] truncate ml-auto italic">
                           &quot;{v.agent_note}&quot;
                        </p>
                    </div>

                  </div>
                ))}
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Activity, Shield, HeartPulse, Sparkles, LogOut, Lock } from 'lucide-react';
import { createPatientAdvicePrompt, AI_CONFIG } from '../config/prompts';

interface VitalRecord {
  id: string;
  systolic: number;
  diastolic: number;
  recorded_at: string;
  agent_note: string;
  storage_status: string; // Cruciaal voor de Sync Badge
}

interface UserProfile {
  id: string;
  user_metadata: {
    full_name?: string;
  };
}

export default function PatientPortal() {
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [patientAdvice, setPatientAdvice] = useState<string>("Uw soevereine schil analyseert de laatste meting...");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const generateSovereignAdvice = useCallback(async (vital: VitalRecord) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setPatientAdvice("De AI-coach is momenteel in ruststand. Bekijk uw waarden hieronder.");
      return;
    }

    const promptText = createPatientAdvicePrompt(vital.systolic, vital.diastolic, vital.agent_note);

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
      
      if (response.status === 429) {
        setPatientAdvice("U heeft vandaag de regie genomen over al uw analyses. De AI rust uit tot morgen.");
        return;
      }

      const data = await response.json();
      setPatientAdvice(data?.candidates?.[0]?.content?.parts?.[0]?.text || "Uw waarden zijn stabiel.");
    } catch (error) {
      setPatientAdvice("Uw lokale data is veilig, maar de analyse-laag is offline.");
    }
  }, []);

  useEffect(() => {
    const initPortal = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        window.location.href = '/login';
        return;
      }
      
      setUser(authData.user as unknown as UserProfile);

      const { data, error } = await supabase
        .from('vitals_read_store')
        .select('id, systolic, diastolic, recorded_at, agent_note, storage_status')
        .eq('ehr_id', authData.user.id)
        .order('recorded_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const typedData = data as VitalRecord[];
        setVitals(typedData);
        generateSovereignAdvice(typedData[0]);
      }
      setLoading(false);
    };

    initPortal();
  }, [generateSovereignAdvice, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-6">
        <Activity className="text-emerald-500 animate-pulse" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center">
            Dossier beveiligen...<br/>Vault Sync Initializing
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 text-slate-900 font-sans">
      <header className="bg-white/80 backdrop-blur-xl border-b p-6 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-2.5 rounded-2xl text-white shadow-lg shadow-slate-200">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none">MyEPD</h1>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
        </div>
        <button onClick={handleSignOut} className="bg-slate-50 p-3 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-slate-100">
          <LogOut size={20} />
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-12 mt-8">
        {/* Sovereign Intelligence Schil */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-[3.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles size={18} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/80">Sovereign Insights</span>
              </div>
              <p className="text-2xl font-medium leading-relaxed tracking-tight italic text-slate-100">
                &quot;{patientAdvice}&quot;
              </p>
            </div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full"></div>
          </div>
        </div>

        {/* Vault-Sync-Service Monitor */}
        <section className="bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 h-2 w-2 rounded-full animate-pulse"></div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Vault-Sync-Service</h4>
            </div>
            <span className="text-[9px] font-bold bg-white px-3 py-1 rounded-full border border-emerald-100 text-emerald-600 uppercase tracking-widest">Active</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-emerald-100/50 text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Source</p>
              <p className="text-[10px] font-bold text-slate-700">OpenEPD GP</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100/50 text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Node</p>
              <p className="text-[10px] font-bold text-slate-700 italic">local-vault-01</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100/50 text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Encryption</p>
              <p className="text-[10px] font-bold text-emerald-600 tracking-tighter uppercase">AES-256</p>
            </div>
          </div>
        </section>

        {/* Historiek */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
              <HeartPulse size={16} className="text-rose-500" /> Medische Brongegevens
            </h3>
          </div>
          
          <div className="grid gap-6">
            {vitals.length > 0 ? vitals.map((v) => (
              <div key={v.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex items-center justify-between group relative overflow-hidden transition-all hover:scale-[1.01]">
                {/* Sync Badge */}
                <div className="absolute top-6 right-8 flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm ${
                    v.storage_status === 'synced' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                  }`}>
                    {v.storage_status === 'synced' ? <Shield size={10} /> : <Activity size={10} />}
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      {v.storage_status === 'synced' ? 'Vault Secured' : 'Syncing...'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center ${
                    v.systolic > 140 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
                  }`}>
                    <Activity size={28} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5 leading-none">
                      <span className="text-5xl font-black tracking-tighter">{v.systolic}</span>
                      <span className="text-3xl text-slate-200 font-extralight">/</span>
                      <span className="text-5xl font-black tracking-tighter">{v.diastolic}</span>
                      <span className="text-[11px] font-black text-slate-300 ml-4 uppercase tracking-[0.2em]">mmHg</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                      {new Date(v.recorded_at).toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })} • Node: local-vault-01
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[4rem] bg-slate-50/50 italic font-bold text-slate-300 uppercase tracking-widest text-[10px]">
                Geen gevalideerde metingen in kluis gevonden
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
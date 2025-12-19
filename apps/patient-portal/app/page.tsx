'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Activity, Shield, Clock, Database, CheckCircle2, ArrowRight, HeartPulse } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from('vitals_read_store')
      .select('*')
      .eq('ehr_id', '9edb2719-268c-429f-a5bb-62608af565f1')
      .order('recorded_at', { ascending: false });

    if (!error) setVitals(data as VitalSign[] || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let ignore = false;
    const startSync = async () => {
      const { data, error } = await supabase
        .from('vitals_read_store')
        .select('*')
        .eq('ehr_id', '9edb2719-268c-429f-a5bb-62608af565f1')
        .order('recorded_at', { ascending: false });
      if (!ignore && !error) {
        setVitals(data as VitalSign[] || []);
        setLoading(false);
      }
    };
    startSync();

    const channel = supabase
      .channel('patient-live-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vitals_read_store' }, () => {
        fetchData();
      })
      .subscribe();

    return () => { 
      ignore = true;
      supabase.removeChannel(channel); 
    };
  }, [supabase, fetchData]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      {/* --- PREMIUM HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-200">
              <Shield size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-800">MijnOpenEPD</h1>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Gekoppeld aan kluis</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 pl-4 pr-1.5 py-1.5 rounded-full border border-slate-100">
             <span className="text-xs font-bold text-slate-600">Jan Jansen</span>
             <div className="h-8 w-8 bg-gradient-to-tr from-slate-200 to-slate-300 rounded-full border-2 border-white flex items-center justify-center font-bold text-slate-600 shadow-sm">
                J
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* --- WELCOME SECTION --- */}
        <div className="mt-4 mb-10">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welkom Jan,</h2>
          <p className="text-slate-500 mt-2 font-medium">Je medische data is versleuteld en uitsluitend voor jou toegankelijk.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT SIDE: VITALS LIST --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <HeartPulse size={16} className="text-rose-500" />
                    Bloeddruk Historie
                </h3>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-40 bg-white rounded-[2.5rem] animate-pulse border border-slate-100" />)}
              </div>
            ) : (
              <div className="grid gap-6">
                {vitals.map((v) => (
                  <div key={v.id} className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-emerald-200 transition-all group relative overflow-hidden">
                    
                    {/* Vault Status Indicator */}
                    <div className="absolute top-6 right-8">
                        {v.storage_status === 'local_vault_only' ? (
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 px-4 py-2 rounded-2xl border border-emerald-100/50">
                                <CheckCircle2 size={16} />
                                <span className="text-[11px] font-black uppercase tracking-tight">Persoonlijke Kluis</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl animate-pulse border border-amber-100/50">
                                <Database size={16} />
                                <span className="text-[11px] font-black uppercase tracking-tight">Synchroniseren...</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-6 uppercase tracking-widest">
                        <Clock size={14} />
                        {new Date(v.recorded_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
                    </div>

                    <div className="flex items-center gap-8">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black text-slate-900 tracking-tighter">{v.systolic}</span>
                                <span className="text-2xl font-bold text-slate-300">/</span>
                                <span className="text-6xl font-black text-slate-900 tracking-tighter">{v.diastolic}</span>
                            </div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Millimeters Kwik (mmHg)</p>
                        </div>
                        
                        {/* Visual Health Gauge */}
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ${v.systolic > 140 ? 'bg-gradient-to-r from-orange-400 to-rose-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
                                style={{ width: `${Math.min((v.systolic / 200) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* AI Agent Insight */}
                    {v.agent_note && (
                        <div className="mt-8 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                    <Activity size={12} />
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-widest opacity-70">Uitleg van de Assistent</p>
                            </div>
                            <p className="text-sm font-medium leading-relaxed italic">
                                &quot;{v.agent_note}&quot;
                            </p>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT SIDE: CLOUD STATUS --- */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Shield className="text-emerald-400" size={20} />
                    Data Soevereiniteit
                </h4>
                <div className="space-y-4">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-sm">
                        <p className="opacity-70 text-xs mb-1 uppercase font-bold">Cloud Status</p>
                        <p className="font-bold">Alleen tijdelijk doorgeefluik</p>
                    </div>
                    <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/20 text-sm">
                        <p className="text-emerald-300 text-xs mb-1 uppercase font-bold">Eigenaarschap</p>
                        <p className="font-bold">100% Jan Jansen</p>
                    </div>
                </div>
                <button className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2">
                    Download Medisch Archief
                    <ArrowRight size={16} />
                </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
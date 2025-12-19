'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Activity, Clock, User, Plus, X, Save, BrainCircuit, AlertCircle } from 'lucide-react';

// Nu bestaat dit bestand wel:
import { createClinicalAnalysisPrompt, AI_CONFIG } from '../config/prompts';

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

export default function Dashboard() {
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newSystolic, setNewSystolic] = useState('');
  const [newDiastolic, setNewDiastolic] = useState('');

  // 1. Initialiseer Supabase
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  // 2. EFFECT HOOK (Alles-in-één om linter errors te voorkomen)
  useEffect(() => {
    // We definiëren de functie BINNEN de effect
    const loadData = async () => {
        const { data, error } = await supabase
            .from('vitals_read_store')
            .select('*')
            .eq('ehr_id', '9edb2719-268c-429f-a5bb-62608af565f1')
            .order('recorded_at', { ascending: false });

        if (!error) setVitals(data as VitalSign[] || []);
        setLoading(false);
    };

    // Direct uitvoeren bij start
    loadData();

    // Abonneren op updates (zodat de lijst ververst na een insert)
    const channel = supabase
      .channel('vitals-realtime')
      .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'vitals_read_store',
          filter: 'ehr_id=eq.9edb2719-268c-429f-a5bb-62608af565f1' 
      }, () => {
          // Bij elke verandering in de DB, laden we opnieuw
          loadData();
      })
      .subscribe();

    return () => { 
        supabase.removeChannel(channel); 
    };
  }, [supabase]); // Geen complexe dependencies meer!

  // 3. ACTIE: Nieuwe meting
  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sys = parseInt(newSystolic);
    const dia = parseInt(newDiastolic);
    let aiNote = "Meting handmatig opgeslagen.";

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (apiKey) {
        try {
            const promptText = createClinicalAnalysisPrompt(sys, dia);

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
                console.warn("AI Rate Limit exceeded");
                aiNote = "AI systeem overbelast (429). Meting is wel opgeslagen.";
            } else {
                const data = await response.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) aiNote = text;
            }
        } catch (err) {
            console.error("AI Network Error:", err);
            aiNote = "Meting opgeslagen (AI offline).";
        }
    }

    // Insert in Supabase (dit triggert automatisch de useEffect hierboven!)
    const { error } = await supabase
      .from('vitals_read_store')
      .insert([{
          ehr_id: '9edb2719-268c-429f-a5bb-62608af565f1',
          data_type: 'blood_pressure',
          systolic: sys,
          diastolic: dia,
          recorded_at: new Date().toISOString(),
          agent_note: aiNote,
          storage_status: 'sync_pending'
      }]);

    if (!error) {
      setNewSystolic('');
      setNewDiastolic('');
      setIsModalOpen(false);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold tracking-tighter text-lg">OpenEPD</div>
            <div className="h-4 w-px bg-gray-200" />
            <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Provider Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">Dr. Vries</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Cardiologie</p>
             </div>
             <div className="h-10 w-10 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                <User size={20} />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Patiënt Info Card */}
        <div className="bg-white border border-gray-200 rounded-[2rem] p-8 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-100">JJ</div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Jansen, J. (Jan)</h2>
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
                        <Clock size={16} className="text-blue-500" /> BSN: 123 456 789 • 12 mei 1965 (59j)
                    </p>
                </div>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
            >
                <Plus size={20} /> Nieuwe Meting
            </button>
        </div>

        <div className="flex items-center gap-3 mb-8">
            <Activity className="text-blue-600" size={24} />
            <h3 className="text-xl font-black tracking-tight text-gray-800">Vitale Functies</h3>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-[2rem] animate-pulse border border-gray-100" />)}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vitals.map((v) => (
              <div key={v.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all p-8 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                        v.storage_status === 'sync_pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                        {v.storage_status === 'sync_pending' ? '☁️ Syncing' : '🏠 Sovereign'}
                    </span>
                </div>

                <div className="text-xs text-gray-400 mb-4 font-bold flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(v.recorded_at).toLocaleDateString('nl-NL')} • {new Date(v.recorded_at).toLocaleTimeString('nl-NL', {hour:'2-digit', minute:'2-digit'})}
                </div>

                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-black text-gray-900 tracking-tighter">{v.systolic}</span>
                    <span className="text-2xl font-bold text-gray-300">/</span>
                    <span className="text-5xl font-black text-gray-900 tracking-tighter">{v.diastolic}</span>
                    <span className="text-xs font-black text-gray-400 ml-1">mmHg</span>
                </div>

                {/* AI Note Display */}
                {v.agent_note && (
                  <div className="mt-4 p-5 bg-blue-50/50 rounded-2xl border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                        {v.agent_note.includes('429') ? (
                           <AlertCircle size={14} className="text-orange-500" />
                        ) : (
                           <BrainCircuit size={14} className="text-blue-600" />
                        )}
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            {v.agent_note.includes('429') ? 'System Alert' : 'Gemini Analysis'}
                        </span>
                    </div>
                    <p className="text-sm text-blue-900 leading-relaxed font-medium italic">
                      &quot;{v.agent_note}&quot;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white">
                <div className="px-8 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-black text-2xl text-gray-900">Nieuwe Meting</h3>
                        <p className="text-sm text-gray-500 font-medium">Bloeddruk invoeren voor dossier</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors border border-gray-100">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleAddMeasurement} className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Bovendruk</label>
                            <input 
                                type="number" required value={newSystolic}
                                onChange={(e) => setNewSystolic(e.target.value)}
                                className="w-full bg-gray-50 rounded-3xl border-2 border-transparent focus:border-blue-500 focus:bg-white px-6 py-6 text-4xl font-black outline-none transition-all shadow-inner" 
                                placeholder="120"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Onderdruk</label>
                            <input 
                                type="number" required value={newDiastolic}
                                onChange={(e) => setNewDiastolic(e.target.value)}
                                className="w-full bg-gray-50 rounded-3xl border-2 border-transparent focus:border-blue-500 focus:bg-white px-6 py-6 text-4xl font-black outline-none transition-all shadow-inner" 
                                placeholder="80"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button 
                            type="submit" disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-lg hover:bg-blue-700 flex justify-center items-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-95"
                        >
                            {isSubmitting ? (
                                <>Analyseren & Opslaan...</>
                            ) : (
                                <><Save size={24} /> Meting Opslaan</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
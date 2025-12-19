'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Activity, Clock, User, Plus, X, Save, Database } from 'lucide-react';

// 1. Data model definitie
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

  // Initialiseer Supabase Client
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  // --- FUNCTIE: Data ophalen uit de cloud ---
  // We gebruiken useCallback zodat we deze functie veilig in de useEffect kunnen gebruiken
  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from('vitals_read_store')
      .select('*')
      .eq('ehr_id', '9edb2719-268c-429f-a5bb-62608af565f1')
      .order('recorded_at', { ascending: false });

    if (!error) {
      setVitals(data as VitalSign[] || []);
    } else {
      console.error("Fout bij ophalen data:", error.message);
    }
    setLoading(false);
  }, [supabase]);

// --- EFFECT: Eerste laadbeurt en Real-time Luisteren ---
  useEffect(() => {
    let ignore = false;

    // We maken een lokale functie om te voorkomen dat we setState direct in de body aanroepen
    const startDataSync = async () => {
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

    startDataSync();

    // Real-time kanaal opzetten
    const channel = supabase
      .channel('vitals-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vitals_read_store',
          filter: 'ehr_id=eq.9edb2719-268c-429f-a5bb-62608af565f1'
        },
        () => {
          // Bij een update halen we de data opnieuw op
          fetchData();
        }
      )
      .subscribe();

    return () => {
      ignore = true; // Voorkomt state updates op een component die al weg is
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchData]);

  // --- ACTIE: Nieuwe meting opslaan ---
  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sys = parseInt(newSystolic);
    const dia = parseInt(newDiastolic);

    // AI Agent Logica (Brain)
    let agentNote = "Meting binnen normale grenzen.";
    if (sys > 140 || dia > 90) {
      agentNote = "⚠️ Verhoogde waarde. Agent adviseert: Controleer zoutinname en plan vervolgmeting over 2 dagen.";
    }
    if (sys > 160) {
      agentNote = "🚨 Kritieke waarde! Agent adviseert: Direct contact met patiënt opnemen.";
    }

    const { error } = await supabase
      .from('vitals_read_store')
      .insert([
        {
          ehr_id: '9edb2719-268c-429f-a5bb-62608af565f1',
          data_type: 'blood_pressure',
          systolic: sys,
          diastolic: dia,
          recorded_at: new Date().toISOString(),
          agent_note: agentNote,
          storage_status: 'sync_pending'
        }
      ]);

    if (!error) {
      setNewSystolic('');
      setNewDiastolic('');
      setIsModalOpen(false);
      // DIRECTE UPDATE: Niet wachten op real-time, maar meteen de lijst verversen
      await fetchData(); 
    } else {
      alert('Fout bij opslaan: ' + error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold">OPEN-EPD</div>
            <h1 className="text-sm font-medium text-gray-500">Provider Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Dr. Vries</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Cardiologie</p>
             </div>
             <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={18} />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Patiënt Context */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">JJ</div>
                <div>
                    <h2 className="text-xl font-bold">Jansen, J. (Jan)</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> Geboren: 12-05-1965 • BSN: 123456789
                    </p>
                </div>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-200"
            >
                <Plus size={20} /> Nieuwe Meting
            </button>
        </div>

        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Activity className="text-blue-600" /> Vitale Functies Historie
        </h3>

        {loading ? (
          <div className="flex justify-center py-12 text-gray-400 italic">Gegevens laden uit de cloud...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vitals.map((v) => (
              <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 relative overflow-hidden">
                
                {/* Status Badge */}
                <div className="absolute top-0 right-0 p-3">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-bl-lg rounded-tr-lg absolute top-0 right-0 ${
                        v.storage_status === 'sync_pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                        {v.storage_status === 'sync_pending' ? '☁️ Cloud Sync' : '🏠 Local Vault'}
                    </span>
                </div>

                <div className="text-xs text-gray-400 mb-2 font-medium">
                    {new Date(v.recorded_at).toLocaleDateString('nl-NL')} • {new Date(v.recorded_at).toLocaleTimeString('nl-NL', {hour:'2-digit', minute:'2-digit'})}
                </div>

                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-800">{v.systolic}</span>
                    <span className="text-xl text-gray-300">/</span>
                    <span className="text-4xl font-black text-gray-800">{v.diastolic}</span>
                    <span className="text-xs font-bold text-gray-400 ml-2">mmHg</span>
                </div>

                {v.agent_note && (
                  <div className="mt-4 p-3 bg-blue-50/50 border-l-2 border-blue-400 rounded-r-lg">
                    <p className="text-[11px] font-bold text-blue-600 uppercase tracking-tighter mb-1 flex items-center gap-1">
                      <Database size={12} /> Agent Analyse
                    </p>
                    <p className="text-xs text-blue-900 leading-relaxed italic">
                      &quot;{v.agent_note}&quot;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-xl">Bloeddruk Invoeren</h3>
                    <button onClick={() => setIsModalOpen(false)} className="bg-white p-1 rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleAddMeasurement} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Systolisch</label>
                            <input 
                                type="number" required value={newSystolic}
                                onChange={(e) => setNewSystolic(e.target.value)}
                                className="w-full bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white px-4 py-4 text-3xl font-black outline-none transition-all" 
                                placeholder="120"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Diastolisch</label>
                            <input 
                                type="number" required value={newDiastolic}
                                onChange={(e) => setNewDiastolic(e.target.value)}
                                className="w-full bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white px-4 py-4 text-3xl font-black outline-none transition-all" 
                                placeholder="80"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button 
                            type="button" onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                        >
                            Annuleren
                        </button>
                        <button 
                            type="submit" disabled={isSubmitting}
                            className="flex-[2] bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            {isSubmitting ? 'Verwerken...' : <><Save size={20} /> Opslaan</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
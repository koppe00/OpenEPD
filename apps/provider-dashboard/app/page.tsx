'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Activity, Clock, User, Plus, X, Save } from 'lucide-react';

interface VitalSign {
  id: number;
  ehr_id: string;
  data_type: string;
  systolic: number;
  diastolic: number;
  recorded_at: string;
}

export default function Dashboard() {
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Deze trigger gebruiken we om de useEffect opnieuw te laten vuren
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSystolic, setNewSystolic] = useState('');
  const [newDiastolic, setNewDiastolic] = useState('');

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  // --- EFFECT: Data ophalen ---
  // Deze draait bij het laden EN elke keer als refreshTrigger verandert
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('vitals_read_store')
        .select('*')
        .eq('ehr_id', '9edb2719-268c-429f-a5bb-62608af565f1')
        .order('recorded_at', { ascending: false });

      if (!error) setVitals(data as VitalSign[] || []);
      setLoading(false);
    }

    fetchData();
  }, [supabase, refreshTrigger]); // <--- Hier zit de magie

  // --- ACTIE: Nieuwe meting opslaan ---
  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('vitals_read_store')
      .insert([
        {
          ehr_id: '9edb2719-268c-429f-a5bb-62608af565f1',
          data_type: 'blood_pressure',
          systolic: parseInt(newSystolic),
          diastolic: parseInt(newDiastolic),
          recorded_at: new Date().toISOString(),
        }
      ]);

    if (error) {
      alert('Fout bij opslaan: ' + error.message);
    } else {
      setNewSystolic('');
      setNewDiastolic('');
      setIsModalOpen(false);
      
      // I.p.v. een functie aanroepen, veranderen we de trigger.
      // De useEffect pikt dit op en ververst de data.
      setRefreshTrigger((prev) => prev + 1); 
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">
              OPEN-EPD
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <a href="#" className="text-blue-600">Dashboard</a>
              <a href="#" className="hover:text-gray-900">Patiënten</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Dr. Vries</p>
                <p className="text-xs text-gray-500">Cardiologie</p>
             </div>
             <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-600" />
             </div>
          </div>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Context Balk */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                JJ
            </div>
            <div>
                <h2 className="text-lg font-bold text-blue-900">Jansen, J. (Jan)</h2>
                <p className="text-sm text-blue-700">EHR: ...65f1</p>
            </div>
        </div>

        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity className="text-red-500" />
                Vitale Functies
            </h3>
            
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
                <Plus size={18} />
                Nieuwe Meting
            </button>
        </div>

        {loading ? (
          <p>Laden...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vitals.map((v) => (
              <div key={v.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                        {v.data_type.replace('_', ' ')}
                    </span>
                    <div className="flex items-center text-xs text-gray-400 gap-1">
                        <Clock size={12} />
                        {new Date(v.recorded_at).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-gray-900">{v.systolic}</span>
                    <span className="text-2xl font-medium text-gray-400">/</span>
                    <span className="text-4xl font-extrabold text-gray-900">{v.diastolic}</span>
                    <span className="text-sm font-medium text-gray-500 ml-1">mmHg</span>
                </div>
                {/* Balkje */}
                <div className="mt-6 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                        className={`h-full ${v.systolic > 140 ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${(v.systolic / 200) * 100}%` }}
                    ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- MODAL (POP-UP) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-900">Nieuwe Bloeddrukmeting</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleAddMeasurement} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bovendruk (Sys)</label>
                            <input 
                                type="number" 
                                required
                                value={newSystolic}
                                onChange={(e) => setNewSystolic(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="120"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Onderdruk (Dia)</label>
                            <input 
                                type="number" 
                                required
                                value={newDiastolic}
                                onChange={(e) => setNewDiastolic(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="80"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                        >
                            Annuleren
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex justify-center items-center gap-2"
                        >
                            {isSubmitting ? 'Opslaan...' : <><Save size={18} /> Opslaan</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}
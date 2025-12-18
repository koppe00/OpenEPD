'use client';

import { useEffect, useState, useMemo } from 'react'; // useMemo toegevoegd
import { createBrowserClient } from '@supabase/ssr';
import { Activity, Clock, User } from 'lucide-react';

// 1. Definieer het type (Lost de 'any' fout op)
interface VitalSign {
  id: number;
  ehr_id: string;
  data_type: string;
  systolic: number;
  diastolic: number;
  recorded_at: string;
}

export default function Dashboard() {
  // Gebruik het nieuwe type in de useState
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Gebruik useMemo (Lost de 'useEffect' waarschuwing veilig op)
  // Dit zorgt dat 'supabase' stabiel blijft tussen renders
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    async function fetchVitals() {
      const { data, error } = await supabase
        .from('vitals_read_store')
        .select('*')
        .eq('ehr_id', '9edb2719-268c-429f-a5bb-62608af565f1')
        .order('recorded_at', { ascending: false });

      if (error) {
        console.error("Fout:", error);
      } else {
        // We casten de data naar ons type
        setVitals(data as VitalSign[] || []);
      }
      
      setLoading(false);
    }
    fetchVitals();
  }, [supabase]); // Nu mag supabase veilig hierin staan

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
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
              <a href="#" className="hover:text-gray-900">Agenda</a>
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
                <p className="text-sm text-blue-700 flex gap-4">
                    <span>Geb: 12-05-1980 (45j)</span>
                    <span>BSN: 123456789</span>
                    <span className="font-mono text-xs opacity-70">EHR: ...65f1</span>
                </p>
            </div>
        </div>

        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="text-red-500" />
            Vitale Functies (Real-time Projectie)
        </h3>

        {loading ? (
          <div className="animate-pulse space-y-4">
             <div className="h-32 bg-gray-200 rounded-xl"></div>
             <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        ) : vitals.length === 0 ? (
          <p className="text-gray-500">Geen metingen gevonden.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vitals.map((v) => (
              <div key={v.id} className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                        {v.data_type.replace('_', ' ')}
                    </span>
                    <div className="flex items-center text-xs text-gray-400 gap-1">
                        <Clock size={12} />
                        {new Date(v.recorded_at).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}
                        <span className="ml-1 text-[10px]">{new Date(v.recorded_at).toLocaleDateString('nl-NL')}</span>
                    </div>
                </div>
                
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-gray-900">{v.systolic}</span>
                    <span className="text-2xl font-medium text-gray-400">/</span>
                    <span className="text-4xl font-extrabold text-gray-900">{v.diastolic}</span>
                    <span className="text-sm font-medium text-gray-500 ml-1">mmHg</span>
                </div>

                {/* Visuele balk (normaalwaarde indicatie) */}
                <div className="mt-6 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                        className={`h-full ${v.systolic > 140 ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${(v.systolic / 200) * 100}%` }}
                    ></div>
                </div>
                <p className="mt-2 text-xs text-gray-400 text-right">
                    Bron: OpenEHR Observatie
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
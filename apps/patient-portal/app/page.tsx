'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Heart, Calendar, ChevronRight, Activity, ShieldCheck, User } from 'lucide-react';

// 1. Definieer het type (Geen 'any' meer!)
interface VitalSign {
  id: number;
  ehr_id: string;
  data_type: string;
  systolic: number;
  diastolic: number;
  recorded_at: string;
}

export default function Page() { // of Dashboard / PatientHome
  // 2. Gebruik het type in de useState
  const [measurements, setMeasurements] = useState<VitalSign[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Gebruik useMemo zodat de client niet elke render opnieuw wordt gemaakt
  // Dit lost de infinite loop op als we hem straks in de dependency array zetten
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('vitals_read_store')
        .select('*')
        .eq('ehr_id', '9edb2719-268c-429f-a5bb-62608af565f1')
        .order('recorded_at', { ascending: false });

      if (!error) setMeasurements(data as VitalSign[] || []);
      setLoading(false);
    }
    fetchData();
  }, [supabase]); // <--- 4. Nu mag supabase veilig in deze array

  // ... hieronder de rest van je return (...) code ...

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-lg">
            <Heart className="fill-current" size={20} />
            <span>MijnGezondheid</span>
          </div>
          <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <User size={18} />
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4 pb-20">
        
        {/* --- WELKOMST SECTION --- */}
        <div className="py-6">
            <h1 className="text-2xl font-bold text-slate-900">Hallo, Jan 👋</h1>
            <p className="text-slate-500 text-sm mt-1">
                Uw gegevens zijn veilig gesynchroniseerd.
            </p>
        </div>

        {/* --- STATUS CARD --- */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6 flex gap-4 items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
            </div>
            <div>
                <h3 className="text-sm font-semibold text-slate-900">Kluis Verbinding Actief</h3>
                <p className="text-xs text-slate-500">U deelt data met Dr. Vries</p>
            </div>
        </div>

        {/* --- METINGEN LIJST --- */}
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Recente Metingen</h2>
            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">Live</span>
        </div>

        {loading ? (
           <div className="space-y-3">
               {[1,2].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse"></div>)}
           </div>
        ) : measurements.length === 0 ? (
           <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
               <p>Nog geen metingen</p>
           </div>
        ) : (
           <div className="space-y-4">
             {measurements.map((m) => (
               <div key={m.id} className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-teal-200 transition-all cursor-pointer relative overflow-hidden">
                  
                  {/* Decoratieve achtergrond gloed */}
                  <div className="absolute top-0 right-0 h-16 w-16 bg-teal-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>

                  <div className="relative z-10 flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                          <div className="h-12 w-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                              <Activity size={24} />
                          </div>
                          <div>
                              <p className="font-bold text-slate-900 text-lg">Bloeddruk</p>
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                  <Calendar size={12} />
                                  {new Date(m.recorded_at).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
                                  <span>•</span>
                                  {new Date(m.recorded_at).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-3">
                          <div className="text-right">
                              <span className="block text-2xl font-black text-slate-800 tracking-tight">
                                  {m.systolic}/{m.diastolic}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">mmHg</span>
                          </div>
                          <ChevronRight className="text-slate-300 group-hover:text-teal-500 transition-colors" size={20} />
                      </div>
                  </div>
               </div>
             ))}
           </div>
        )}
      </main>
    </div>
  );
}
// apps/patient-portal/app/page.tsx

'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import {
  Shield,
  Activity,
  LogOut,
  HeartPulse,
  ChevronDown,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Jouw core
import { ZIB_CONFIG } from '@openepd/clinical-core/constants/zibConfig';
import { ZibValidationService } from '@openepd/clinical-core/validation/ZibValidationService';

// === Types ===
interface ZibComposition {
  id: string;
  zib_id: string;
  content: Record<string, unknown>;
  recorded_at: string;
  storage_status: string;
}

interface BloodPressurePoint {
  date: string;
  systolic?: number;
  diastolic?: number;
}

export default function PatientPortal() {
  const [zibs, setZibs] = useState<ZibComposition[]>([]);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['Bloeddruk']));
  const [patientAdvice, setPatientAdvice] = useState<string>('Uw dossier wordt veilig geladen...');
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  };

  // Extract bloeddruk historie met jouw validation service – type-safe
  const bloodPressureHistory = useMemo<BloodPressurePoint[]>(() => {
    return zibs
      .filter((zib) => zib.zib_id.includes('Bloeddruk') || zib.zib_id.includes('BloodPressure'))
      .map((zib) => {
        const validationResult = ZibValidationService.validate(zib.zib_id, zib.content);
        const data = validationResult.success ? validationResult.data : {};

        const systolic = 'systolic' in data ? Number(data.systolic) : undefined;
        const diastolic = 'diastolic' in data ? Number(data.diastolic) : undefined;

        return {
          date: format(new Date(zib.recorded_at), 'dd MMM yyyy'),
          systolic: systolic && !isNaN(systolic) ? systolic : undefined,
          diastolic: diastolic && !isNaN(diastolic) ? diastolic : undefined,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [zibs]);

  // Groepeer op basis van ZIB_CONFIG aanwezigheid + fallback
  const groupedZibs = useMemo<[string, ZibComposition[]][]>(() => {
    const groups: Record<string, ZibComposition[]> = {};

    zibs.forEach((zib) => {
      let category = 'Overig';

      if (ZIB_CONFIG[zib.zib_id]) {
        const shortName = zib.zib_id.split('.').pop() || zib.zib_id;
        category = shortName.charAt(0).toUpperCase() + shortName.slice(1);
      } else {
        const shortName = zib.zib_id.split('.').pop() || zib.zib_id;
        category = shortName;
      }

      if (!groups[category]) groups[category] = [];
      groups[category].push(zib);
    });

    const ordered = ['Bloeddruk', 'Beleid', 'LichamelijkOnderzoek', 'Laboratoriumuitslagen', 'Alert', 'Medicatie', 'Overig'];

    const sorted: [string, ZibComposition[]][] = [];

    ordered.forEach((cat) => {
      if (groups[cat]) {
        sorted.push([
          cat,
          groups[cat].sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()),
        ]);
      }
    });

    Object.keys(groups)
      .filter((cat) => !ordered.includes(cat))
      .sort()
      .forEach((cat) => sorted.push([cat, groups[cat]]));

    return sorted;
  }, [zibs]);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        window.location.href = '/login';
        return;
      }

      const { data: zibData } = await supabase
        .from('zib_compositions')
        .select('id, zib_id, content, recorded_at, storage_status')
        .order('recorded_at', { ascending: false });

      if (zibData) {
        setZibs(zibData as ZibComposition[]);
        setPatientAdvice('Uw persoonlijke gezondheidsdossier is veilig gesynchroniseerd en klaar voor inzage.');
      }

      setLoading(false);
    };

    init();

    channel = supabase.channel('patient-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'zib_compositions' }, init)
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-6">
          <Activity className="text-emerald-500 animate-pulse" size={48} />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center">
            Dossier beveiligen...<br />Vault Sync Initializing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 text-slate-900 font-sans">
      <header className="bg-white/80 backdrop-blur-xl border-b p-6 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-2.5 rounded-2xl text-white shadow-lg">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none">MyEPD</h1>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
              End-to-End Encrypted • Patiënt in Regie
            </span>
          </div>
        </div>
        <button onClick={handleSignOut} className="bg-slate-50 p-3 rounded-2xl hover:bg-rose-50 transition">
          <LogOut size={20} />
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-12 mt-8">
        {/* Sovereign Insights */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-[3.5rem] blur opacity-20 group-hover:opacity-30 transition"></div>
          <div className="relative bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/80">
                  Sovereign Insights
                </span>
              </div>
              <p className="text-2xl font-medium leading-relaxed tracking-tight italic text-slate-100">
                &quot;{patientAdvice}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Bloeddruk Trend Grafiek */}
        {bloodPressureHistory.length > 1 && (
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp size={24} className="text-rose-500" />
              <h3 className="font-black text-2xl tracking-tight">Bloeddruk Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={bloodPressureHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[60, 180]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ fill: '#ef4444', r: 6 }}
                  name="Systolisch"
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', r: 6 }}
                  name="Diastolisch"
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-slate-500 mt-6 text-center">
              Laatste {bloodPressureHistory.length} metingen
            </p>
          </section>
        )}

        {/* Medische Brongegevens */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
            <HeartPulse size={16} className="text-rose-500" />
            Medische Brongegevens
          </h3>

          {groupedZibs.length === 0 ? (
            <p className="text-center py-20 text-slate-400 italic">
              Geen gegevens gevonden in uw persoonlijke kluis.
            </p>
          ) : (
            groupedZibs.map(([category, items]) => (
              <div key={category} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <button
                  onClick={() => toggleSection(category)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <ChevronDown
                      size={20}
                      className={`text-slate-500 transition-transform duration-300 ${openSections.has(category) ? 'rotate-180' : ''}`}
                    />
                    <h4 className="font-black text-lg tracking-tight">{category}</h4>
                    <span className="text-sm font-medium text-slate-500">({items.length})</span>
                  </div>
                </button>

                {openSections.has(category) && (
                  <div className="px-8 pb-8 space-y-6">
                    {items.map((zib) => {
                      const narrative = zib.content.narrative_text as string | undefined;

                      return (
                        <div key={zib.id} className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200">
                          <div className="flex justify-between items-start mb-4">
                            <p className="font-bold text-slate-800">
                              {zib.zib_id.replace('nl.zorg.', '').replaceAll('.', ' ')}
                            </p>
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                              zib.storage_status === 'local_vault_only' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {zib.storage_status === 'local_vault_only' ? 'Alleen in vault' : 'Gesynchroniseerd'}
                            </div>
                          </div>

                          {narrative && (
                            <p className="text-slate-700 text-lg italic mb-4">&quot;{narrative}&quot;</p>
                          )}

                          <p className="text-xs text-slate-500">
                            {format(new Date(zib.recorded_at), 'PPPp', { locale: nl })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
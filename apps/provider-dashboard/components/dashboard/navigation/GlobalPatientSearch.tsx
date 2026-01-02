'use client';

import React, { useState, useEffect } from 'react';
import { Search, User, Calendar, MapPin, Loader2, ArrowRight, X } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export function GlobalPatientSearch({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (patient: any) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 3) {
        setResults([]);
        return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${val}%,bsn_number.eq.${val}`)
      .eq('is_patient', true)
      .limit(8);

    if (!error) setResults(data || []);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-20 p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <Search className="text-blue-500" size={24} />
            <input 
                autoFocus
                placeholder="Zoek patiënt in landelijke database (Naam of BSN)..."
                className="flex-1 text-lg font-bold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm">
                <X size={20} />
            </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {loading && (
                <div className="flex items-center justify-center py-12 text-slate-400 gap-3 font-bold text-xs uppercase tracking-widest">
                    <Loader2 size={20} className="animate-spin text-blue-500" /> Doorzoeken van alle dossiers...
                </div>
            )}

            {!loading && results.length === 0 && query.length >= 3 && (
                <div className="py-12 text-center text-slate-400">
                    <p className="font-bold">Geen resultaten voor "{query}"</p>
                    <p className="text-[10px] uppercase mt-1">Check het BSN of de spelling van de achternaam</p>
                </div>
            )}

            {!loading && results.map((p) => (
                <button 
                    key={p.id}
                    onClick={() => {
                        onSelect(p); // Geef de hele patiënt terug aan het dashboard
                        onClose();
                    }}
                    className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-900/5 transition-all group text-left"
                >
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors border border-slate-100">
                        <User size={24} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">
                            {p.full_name}
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                <Calendar size={12} /> {p.date_of_birth}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                <MapPin size={12} /> {p.address_city}
                            </span>
                        </div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={18} />
                    </div>
                </button>
            ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-8">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Master Patient Index (MPI) koppeling actief</p>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-600 uppercase">Verbonden</span>
            </div>
        </div>
      </div>
    </div>
  );
}
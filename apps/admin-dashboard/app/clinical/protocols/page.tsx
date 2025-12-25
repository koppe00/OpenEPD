'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation'; // Nieuw: Router voor navigatie
import { Plus, Search, Stethoscope, ArrowRight } from 'lucide-react';

type Protocol = {
  id: string;
  title: string;
  specialty: string;
  version: string;
  is_active: boolean;
  description: string;
  updated_at: string;
};

export default function ProtocolListPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const supabase = createClient();
  const router = useRouter(); // Nieuw

  useEffect(() => {
    fetchProtocols();
  }, []);

  const fetchProtocols = async () => {
    const { data, error } = await supabase
      .from('clinical_protocols')
      .select('*')
      .order('updated_at', { ascending: false }); // Nieuwste eerst
    
    if (data) setProtocols(data);
    setLoading(false);
  };

  const createNew = async () => {
    const title = prompt("Naam van nieuw protocol (bv. 'MDL - Coeliakie'):");
    if (!title) return;
    
    // 1. Maak aan
    const { data, error } = await supabase.from('clinical_protocols').insert({
      title,
      specialty: 'MDL', // Default, kan later aangepast worden
      description: 'Nieuw concept protocol',
      version: '0.1',
      is_active: false
    }).select().single();
    
    // 2. Stuur direct door naar de editor
    if (data) {
      router.push(`/clinical/protocols/${data.id}`);
    }
  };

  const filtered = protocols.filter(p => 
    p.title.toLowerCase().includes(filter.toLowerCase()) || 
    p.specialty.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Klinische Protocollen</h1>
          <p className="text-slate-500 mt-2">Beheer de beslisregels (GLM) en order-sets.</p>
        </div>
        <button 
          onClick={createNew}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} /> Nieuw Protocol
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search size={20} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Zoek op naam, specialisme of ziektebeeld..." 
          className="flex-1 outline-none text-slate-700 font-medium placeholder:text-slate-300"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Protocol Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Protocollen laden...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4"><Stethoscope size={32} className="text-slate-300" /></div>
            <h3 className="text-slate-900 font-bold">Geen protocollen gevonden</h3>
            <p className="text-slate-500 text-sm mt-1">Maak er eentje aan om te beginnen.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-6 py-4 text-xs font-black uppercase text-slate-400 tracking-wider">Protocol</th>
                <th className="p-6 py-4 text-xs font-black uppercase text-slate-400 tracking-wider">Specialisme</th>
                <th className="p-6 py-4 text-xs font-black uppercase text-slate-400 tracking-wider">Status</th>
                <th className="p-6 py-4 text-xs font-black uppercase text-slate-400 tracking-wider">Laatst Gewijzigd</th>
                <th className="p-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((protocol) => (
                <tr 
                  key={protocol.id} 
                  onClick={() => router.push(`/clinical/protocols/${protocol.id}`)}
                  className="group hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {protocol.title.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{protocol.title}</div>
                        <div className="text-xs text-slate-400">v{protocol.version}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                      {protocol.specialty}
                    </span>
                  </td>
                  <td className="p-6">
                     {protocol.is_active ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                           <span className="relative flex h-1.5 w-1.5">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                           </span>
                           Actief
                        </span>
                     ) : (
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Concept</span>
                     )}
                  </td>
                  <td className="p-6 text-sm text-slate-500 font-mono">
                    {new Date(protocol.updated_at || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation(); // Voorkom dubbele navigatie
                           router.push(`/clinical/protocols/${protocol.id}`);
                         }}
                         className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                       >
                          Bewerken <ArrowRight size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
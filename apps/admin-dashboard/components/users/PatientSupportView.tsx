import React from 'react';
import { Search, UserCheck, ShieldAlert, History } from 'lucide-react';

export function PatientSupportView({ patients, loading }: { patients: any[], loading: boolean }) {
  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Zoek patiënt op naam of BSN..." 
            className="w-full pl-12 pr-6 py-3 bg-slate-50 rounded-xl border-none font-bold text-sm"
          />
        </div>
        <div className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-2">
          <ShieldAlert size={14} /> Beperkte Support Toegang
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-8 py-5">Patiënt</th>
              <th className="px-8 py-5">BSN</th>
              <th className="px-8 py-5">Geboortedatum</th>
              <th className="px-8 py-5">Status (WID)</th>
              <th className="px-8 py-5 text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {patients.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5 font-bold text-slate-900">{p.full_name}</td>
                <td className="px-8 py-5 font-mono text-xs text-slate-500">{p.bsn_number || '•••••••••'}</td>
                <td className="px-8 py-5 text-xs text-slate-600">{p.date_of_birth || 'Onbekend'}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                    p.wid_status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {p.wid_status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button title="Audit Log inzien" className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                    <History size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
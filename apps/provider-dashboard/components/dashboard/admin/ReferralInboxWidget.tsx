'use client';
import { Mail, Check, X, AlertCircle } from 'lucide-react';

export function ReferralInboxWidget() {
  // MOCK DATA (In het echt haal je dit uit supabase 'referrals')
  const referrals = [
    { id: 1, from: 'Huisarts de Vries', patient: 'J. Bakker', reason: 'Anemie', prio: 'high', time: '08:30' },
    { id: 2, from: 'ZorgDomein', patient: 'M. Visser', reason: 'Diabetes', prio: 'normal', time: '09:15' },
    { id: 3, from: 'SEH', patient: 'K. Yilmaz', reason: 'Nierfalen', prio: 'urgent', time: '10:00' },
  ];

  return (
    <div className="bg-white p-0 rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-black text-sm text-slate-700 uppercase tracking-wide">Inbox Verwijzingen</h3>
        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full">3 Nieuw</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {referrals.map((ref) => (
          <div key={ref.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{ref.from} • {ref.time}</span>
                {ref.prio === 'urgent' && <AlertCircle size={12} className="text-rose-500" />}
            </div>
            <div className="font-bold text-slate-800 text-sm">{ref.patient}</div>
            <div className="text-xs text-slate-500 mb-3">{ref.reason}</div>
            
            <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 bg-emerald-50 text-emerald-600 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-emerald-100">
                    <Check size={12} /> Accepteren
                </button>
                <button className="flex-1 bg-slate-100 text-slate-500 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-slate-200">
                    Details
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
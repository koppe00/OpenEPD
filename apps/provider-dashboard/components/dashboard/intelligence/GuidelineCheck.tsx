'use client';

import { ShieldCheck, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { ClinicalObservation } from '../../../hooks/useClinicalData';
import { useProtocolEngine } from '../../../hooks/useProtocolEngine';

export const GuidelineCheck = ({ observations }: { observations: ClinicalObservation[] | undefined }) => {
  const { activeProtocols, loading } = useProtocolEngine(observations);

  if (loading) return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center gap-2 text-slate-400 text-xs">
      <Loader2 size={14} className="animate-spin" /> Controleren op GLM protocollen...
    </div>
  );

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
           <ShieldCheck size={18} className="text-emerald-500" />
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Richtlijnen (GLM)</h3>
        </div>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
           {activeProtocols.length} Actief
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
        {activeProtocols.length > 0 ? (
          activeProtocols.map((protocol) => (
            <div key={protocol.id} className="p-3 bg-amber-50 border border-amber-100 rounded-xl animate-in slide-in-from-right-2 duration-500">
               <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                     <p className="text-xs font-bold text-amber-900">{protocol.title}</p>
                     {protocol.alert_message && (
                       <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">
                         {protocol.alert_message}
                       </p>
                     )}
                  </div>
               </div>
            </div>
          ))
        ) : (
           <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2 min-h-[100px]">
              <CheckCircle2 size={24} className="opacity-20" />
              <p className="text-[10px] font-medium text-center">Geen afwijkingen gevonden.<br/>Alle protocollen conform.</p>
           </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { Activity, Thermometer, Heart, FileText, Zap, ArrowUpRight, ClipboardCheck } from 'lucide-react';
import { DashboardWidget } from './DashboardWidget';
import { ClinicalObservation } from '../../../hooks/useClinicalData';
import { useProtocolEngine } from '../../../hooks/useProtocolEngine';

// Type definitie voor de inhoud van een vitale parameter (voorkomt 'any')
interface VitalContent {
  value?: string | number;
  systolic?: number;
  diastolic?: number;
  unit?: string;
  [key: string]: unknown; // Voor eventuele extra velden
}

// --- WIDGET 1: VITALS ---
export const VitalsWidget = ({ observations }: { observations: ClinicalObservation[] }) => {
  // Helper om laatste waarde te vinden
  const getLatest = (code: string): VitalContent | null => {
    const found = observations
      .filter(o => o.zib_id === code)
      .sort((a, b) => new Date(b.effective_at).getTime() - new Date(a.effective_at).getTime())[0];
    
    return found ? (found.value as VitalContent) : null; 
  };

  const bp = getLatest('nl.zorg.Bloeddruk'); 
  const hr = getLatest('nl.zorg.Polsfrequentie');
  const temp = getLatest('nl.zorg.Lichaamstemperatuur');

  // FIX: Type 'any' vervangen door 'VitalContent | null'
  const displayValue = (data: VitalContent | null, fallback = '--') => {
    if (!data) return fallback;
    
    // Specifiek voor bloeddruk (systolic/diastolic)
    if (typeof data.systolic === 'number' && typeof data.diastolic === 'number') {
      return `${data.systolic}/${data.diastolic}`;
    }
    
    // Voor enkele waarden
    return data.value?.toString() || fallback;
  };

  return (
    <DashboardWidget title="Vitale Parameters" icon={Activity} iconColor="bg-rose-600">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Bloeddruk */}
        <div className="bg-rose-50 border border-rose-200 rounded p-2 flex flex-col justify-between">
           <div className="flex items-center gap-1 text-rose-400 mb-1">
             <Activity size={12} /> <span className="text-[9px] font-extrabold uppercase">Tensie</span>
           </div>
           <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-rose-900">{displayValue(bp)}</span>
              <span className="text-[8px] font-bold text-rose-500">mmHg</span>
           </div>
        </div>
        
        {/* Hartslag */}
        <div className="bg-blue-50 border border-blue-200 rounded p-2 flex flex-col justify-between">
           <div className="flex items-center gap-1 text-blue-400 mb-1">
             <Heart size={12} /> <span className="text-[9px] font-extrabold uppercase">Pols</span>
           </div>
           <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-blue-900">{displayValue(hr)}</span>
              <span className="text-[8px] font-bold text-blue-500">/min</span>
           </div>
        </div>

        {/* Temperatuur */}
        <div className="bg-emerald-50 border border-emerald-200 rounded p-2 flex flex-col justify-between">
           <div className="flex items-center gap-1 text-emerald-400 mb-1">
             <Thermometer size={12} /> <span className="text-[9px] font-extrabold uppercase">Temp</span>
           </div>
           <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-900">{displayValue(temp)}</span>
              <span className="text-[8px] font-bold text-emerald-500">°C</span>
           </div>
        </div>
      </div>
    </DashboardWidget>
  );
};

// --- WIDGET 2: RESULTS (LAB/Onderzoeken) ---
export const ResultsWidget = ({ observations }: { observations: ClinicalObservation[] }) => {
  const labs = observations.filter(o => o.zib_id.includes('LaboratoriumUitslag')).slice(0, 5);

  return (
    <DashboardWidget title="Recente Uitslagen" icon={FileText} iconColor="bg-blue-500" className="flex-1">
      <div className="space-y-0 divide-y divide-slate-50">
         {labs.length > 0 ? labs.map((lab) => {
           // Veilige access tot content
           const content = lab.value as VitalContent;
           return (
             <div key={lab.id} className="py-3 flex justify-between items-center group cursor-pointer hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-blue-400" />
                   <div>
                      <p className="text-xs font-bold text-slate-700">
                        {content?.value?.toString() || 'Meting'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(lab.effective_at).toLocaleDateString()}
                      </p>
                   </div>
                </div>
                <span className="text-xs font-mono font-medium text-slate-500">
                  {content?.unit || '-'}
                </span>
             </div>
           );
         }) : (
           <div className="text-center py-8 text-slate-300 text-xs italic">Geen recente laboratoriumuitslagen.</div>
         )}
      </div>
    </DashboardWidget>
  );
};

// --- WIDGET 3: ACTIES (DYNAMIC GLM) ---
export const ActionWidget = ({ observations }: { observations: ClinicalObservation[] }) => {
  const { activeProtocols, loading } = useProtocolEngine(observations);
  const allActions = activeProtocols.flatMap(p => p.actions);

  return (
    <DashboardWidget title="Quick Actions (GLM)" icon={Zap} iconColor="bg-amber-500" className="h-full">
       <div className="space-y-3">
          {loading ? (
             <div className="p-4 text-center text-[10px] text-slate-400 italic">Laden...</div>
          ) : allActions.length > 0 ? (
             <>
               <div className="flex flex-wrap gap-2 mb-2">
                  {activeProtocols.map(p => (
                    <span key={p.id} className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                      {p.title}
                    </span>
                  ))}
               </div>
               
               {allActions.map((action, i) => (
                 <button 
                   key={i} 
                   className={`w-full text-left p-3 rounded-xl border flex items-center justify-between group transition-all hover:shadow-md hover:scale-[1.02] ${action.ui_color_class || 'bg-slate-50 border-slate-100 text-slate-700'}`}
                   onClick={() => alert(`Actie gestart: ${action.label}\nPayload: ${JSON.stringify(action.action_payload)}`)}
                 >
                    <span className="text-xs font-black">{action.label}</span>
                    <ArrowUpRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                 </button>
               ))}
             </>
          ) : (
             <div className="text-center py-6">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Geen protocol acties</p>
             </div>
          )}

          <div className="pt-4 mt-4 border-t border-slate-50">
             <button className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 border border-dashed border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                <ClipboardCheck size={12} /> Toon alle protocollen
             </button>
          </div>
       </div>
    </DashboardWidget>
  );
};
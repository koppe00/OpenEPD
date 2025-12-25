import React from 'react';
import { ZIB_CONFIG } from '@openepd/clinical-core';
import { Activity, Edit3, FileText, ChevronRight } from 'lucide-react';
import { DashboardWidget } from '@/hooks/useDashboardLayout';
import { ClinicalObservation } from '@/hooks/useClinicalData';
import { SmartTemplateEditor } from './clinical/SmartTemplateEditor';
import { AIAssistantWidget } from './ai/AIAssistantWidget'; 
import { ReferralInboxWidget } from './admin/ReferralInboxWidget';
import { AppointmentSchedulerWidget } from './admin/AppointmentSchedulerWidget';


interface ZibValue {
  systolic?: number;
  diastolic?: number;
  weight_value?: number;
  anamnesis_text?: string;
  narrative_text?: string;
  progress_note?: string;
  policy_text?: string;
  evaluation_text?: string;
  [key: string]: unknown;
}

type ExtendedObservation = ClinicalObservation & {
  value?: Record<string, unknown>; 
  value_quantity?: { value: number; unit: string };
};

interface Props {
  widget: DashboardWidget;
  observations: ClinicalObservation[];
  patientId: string;
  onAddMeasurement?: (zibId: string) => void;
  onViewDetail?: (zibId: string) => void;
  onDataChange?: () => void; // <--- NIEUW: Prop om verandering te melden
}

export function UniversalZibWidget({ widget, observations, patientId, onAddMeasurement, onViewDetail, onDataChange
 }: Props) {
  const { configuration, engine_type, display_title } = widget;
  
  // 1. EDITOR ENGINE
  if (engine_type === 'universal_zib_form') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Edit3 size={14} className="text-blue-500" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
            {display_title || widget.widget_name}
          </h3>
        </div>
        <SmartTemplateEditor 
          observations={observations} 
          mode="spreekuur" 
          allowedZibs={configuration.zibs as string[]} 
          embedded={true}
          patientId={patientId} 
          onSaveSuccess={onDataChange}
        />
      </div>
    );
  }

  // 2. AI COPILOT ENGINE (NIEUW)
  if (engine_type === 'ai_copilot') {
    const targetZibs = (configuration.zibs as string[]) || []; 
    return (
      <AIAssistantWidget 
        observations={observations} 
        monitoredZibs={targetZibs}
        patientId={patientId}
      />
    );
  }

  // 3. VIEWER ENGINE
  if (engine_type === 'universal_zib_viewer') {
    const targetZibs = (configuration.zibs as string[]) || [];
    const primaryZib = targetZibs[0];

    return (
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col hover:border-blue-200 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Activity size={16} /></div>
             <h3 className="font-black text-sm text-slate-900">{display_title || widget.widget_name}</h3>
          </div>
          <button 
            onClick={() => onAddMeasurement && primaryZib && onAddMeasurement(primaryZib)}
            className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
          >
            + Meting
          </button>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {targetZibs.map((zibKey: string) => {
            const zibDef = ZIB_CONFIG[zibKey];
            if (!zibDef) return null;

            const latestObs = observations
              .filter(o => o.zib_id === zibKey)
              .sort((a, b) => new Date(b.effective_at).getTime() - new Date(a.effective_at).getTime())[0] as ExtendedObservation | undefined;

            let displayContent = <span className="text-2xl font-black text-slate-900 tracking-tight">--</span>;
            let isText = false;

            if (latestObs && latestObs.value) {
                const val = latestObs.value as ZibValue;
                
                if (typeof val === 'object' && val !== null) {
                    if (zibKey.includes('Bloeddruk') && val.systolic !== undefined) {
                         displayContent = <span className="text-2xl font-black text-slate-900 tracking-tight">{val.systolic}/{val.diastolic || '-'}</span>;
                    } 
                    else if (zibKey.includes('Gewicht') && val.weight_value !== undefined) {
                         displayContent = <span className="text-2xl font-black text-slate-900 tracking-tight">{String(val.weight_value)}</span>;
                    }
                    else if (val.anamnesis_text || val.narrative_text || val.progress_note || val.policy_text || val.evaluation_text) {
                        isText = true;
                        const text = String(val.anamnesis_text || val.progress_note || val.policy_text || val.evaluation_text || val.narrative_text);
                        displayContent = (
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 italic bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                                {text}
                            </p>
                        );
                    }
                    else {
                        const firstVal = Object.values(val)[0];
                        displayContent = <span className="text-sm font-bold text-slate-700">{String(firstVal)}</span>;
                    }
                } else {
                    displayContent = <span className="text-2xl font-black text-slate-900 tracking-tight">{String(val)}</span>;
                }
            }

            return (
              <div 
                key={zibKey} 
                onClick={() => onViewDetail && latestObs && onViewDetail(zibKey)}
                className={`group ${latestObs ? 'cursor-pointer' : ''}`}
              >
                <div className="flex justify-between items-end mb-1">
                  <div className="flex items-center gap-2">
                     {isText && <FileText size={10} className="text-slate-400" />}
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{zibDef[0]?.label || zibKey.replace('nl.zorg.', '')}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium group-hover:text-blue-500 transition-colors">
                    {latestObs ? new Date(latestObs.effective_at).toLocaleDateString() : '-'}
                  </span>
                </div>
                
                <div className="flex items-baseline gap-2">
                  {displayContent}
                  {!isText && <span className="text-xs font-bold text-slate-400">{zibDef[0]?.unit || ''}</span>}
                </div>
                
                {!isText && (
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-slate-900 w-2/3 rounded-full opacity-0 group-hover:opacity-20 transition-opacity" />
                    </div>
                )}
                
                {isText && latestObs && (
                    <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] font-bold text-blue-500 flex items-center">Details <ChevronRight size={10} /></span>
                    </div>
                )}
              </div>
            );
          })}
          
          {targetZibs.length === 0 && (
            <div className="text-center py-10 text-slate-300 italic text-xs">
              Geen ZIBs geconfigureerd.
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (engine_type === 'admin_referral_list') {
    return <ReferralInboxWidget />;
  }
  if (engine_type === 'admin_scheduler') {
      return <AppointmentSchedulerWidget />;
  }  

  return null;
}
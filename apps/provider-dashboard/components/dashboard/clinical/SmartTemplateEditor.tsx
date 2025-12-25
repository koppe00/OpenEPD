'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Database, Info, Settings, CheckCircle2 } from 'lucide-react';
import { ZIB_CONFIG } from '@openepd/clinical-core';
import { ClinicalObservation } from '@/hooks/useClinicalData';
import { useRouter } from 'next/navigation';

type ExtendedObservation = ClinicalObservation & {
  value?: Record<string, unknown>; 
  value_quantity?: { value: number; unit: string };
};

interface WidgetSection {
  id: string;
  label: string;
  section_key: string;
  zib_mapping: string;
  ui_control_type: 'text_area' | 'measurement_group' | 'checklist';
  placeholder: string;
  selected_fields?: string[];
}

interface SmartTemplateEditorProps {
  observations?: ClinicalObservation[];
  mode?: string;
  allowedZibs?: string[];
  embedded?: boolean;
  patientId?: string;
  onSaveSuccess?: () => void; // <--- De nieuwe callback prop
}

export const SmartTemplateEditor = ({ 
  observations = [], 
  embedded, 
  allowedZibs, 
  patientId,
  onSaveSuccess 
}: SmartTemplateEditorProps) => {
  const [sections, setSections] = useState<WidgetSection[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Strict typing voor form data
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
  
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    async function fetchBlueprint() {
      const { data: widgetDef } = await supabase
        .from('widget_definitions')
        .select('id')
        .eq('component_key', 'SmartTemplateEditor')
        .single();

      if (widgetDef) {
        const query = supabase
          .from('widget_sections')
          .select('*')
          .eq('widget_definition_id', widgetDef.id)
          .order('sort_order');

        const { data: s } = await query;
        
        if (s) {
          const filtered = allowedZibs 
            ? s.filter(sec => sec.zib_mapping && allowedZibs.includes(sec.zib_mapping))
            : s;
          setSections(filtered);
        }
      }
      setLoading(false);
    }

    fetchBlueprint();
  }, [supabase, allowedZibs]);

  // --- OPSLAAN LOGICA ---
  const handleSave = async () => {
    if (!patientId) {
        alert("Geen patiënt geselecteerd.");
        return;
    }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entriesToSave: Record<string, any> = {};

    // 1. Gestructureerde inputs
    Object.entries(formData).forEach(([key, value]) => {
        const lastDotIndex = key.lastIndexOf('.');
        if (lastDotIndex === -1) return; 

        const zibId = key.substring(0, lastDotIndex); 
        const fieldName = key.substring(lastDotIndex + 1); 

        if (!entriesToSave[zibId]) entriesToSave[zibId] = {};
        entriesToSave[zibId][fieldName] = value;
    });

    // 2. Vrije tekst velden
    sections.forEach(section => {
        // Cast naar string voor checks
        const val = formData[section.section_key] as string | undefined;
        if (val && section.zib_mapping) {
            if (!entriesToSave[section.zib_mapping]) entriesToSave[section.zib_mapping] = {};
            
            const fieldName = section.zib_mapping.includes('Decursus') ? 'progress_note' : 
                              section.zib_mapping.includes('Anamnese') ? 'anamnesis_text' : 'narrative_text';
            entriesToSave[section.zib_mapping][fieldName] = val;
        }
    });

    const rows = Object.entries(entriesToSave).map(([zibId, content]) => ({
        patient_id: patientId,
        caregiver_id: user.id,
        zib_id: zibId,
        zib_version: '2024',
        clinical_status: 'final',
        verification_status: 'confirmed',
        effective_at: new Date().toISOString(),
        content: content, 
        source_system: 'SmartTemplateEditor'
    }));

    if (rows.length > 0) {
        const { error } = await supabase.from('zib_compositions').insert(rows);
        if (!error) {
            setFormData({}); 
            
            // CRUCIAAL: Roep de refresh callback aan
            if (onSaveSuccess) onSaveSuccess();
            
            // Router refresh voor de zekerheid
            router.refresh(); 
        } else {
            console.error("Save Error", error);
            alert("Fout bij opslaan: " + error.message);
        }
    }
    setSaving(false);
  };

  const getLatestValue = (zibMapping: string, fieldName: string) => {
    const obs = observations.find(o => o.zib_id === zibMapping) as ExtendedObservation | undefined;
    if(obs && obs.value && typeof obs.value === 'object') {
        const val = (obs.value as Record<string, unknown>)[fieldName];
        if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
            return val;
        }
    }
    return '';
  };

  // Type-safe handler
  const handleFieldChange = (zibMapping: string, fieldName: string, val: string | number | boolean) => {
    setFormData(prev => ({
        ...prev,
        [`${zibMapping}.${fieldName}`]: val
    }));
  };

  // Helper renderer
  const renderZibField = (zibMapping: string, fieldName: string) => {
    const zibDef = ZIB_CONFIG[zibMapping];
    if (!zibDef) return null;
    const fieldConfig = zibDef.find(f => f.name === fieldName);
    if (!fieldConfig) return null;
    const key = `${zibMapping}.${fieldName}`;
    
    // Zorg dat value altijd string of number is voor de input
    const rawValue = formData[key] !== undefined ? formData[key] : getLatestValue(zibMapping, fieldName);
    const value = rawValue === '' ? '' : rawValue; 

    return (
      <div key={fieldName} className="flex flex-col gap-1.5">
        <label className="text-[9px] font-bold uppercase text-slate-500">{fieldConfig.label}</label>
        {fieldConfig.type === 'select' ? (
           <div className="relative">
             <select 
                value={String(value)} 
                onChange={(e) => handleFieldChange(zibMapping, fieldName, e.target.value)} 
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs font-medium text-slate-700 outline-none"
             >
               <option value="">- Selecteer -</option>
               {fieldConfig.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
             </select>
           </div>
        ) : (
           <div className="relative flex items-center">
             <input 
                type={fieldConfig.type === 'number' ? 'number' : 'text'} 
                value={String(value)} 
                onChange={(e) => handleFieldChange(zibMapping, fieldName, fieldConfig.type === 'number' ? Number(e.target.value) : e.target.value)} 
                placeholder={fieldConfig.placeholder || '...'} 
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs font-medium text-slate-700 outline-none" 
             />
             {fieldConfig.unit && <span className="absolute right-3 text-[10px] text-slate-400 font-bold">{fieldConfig.unit}</span>}
           </div>
        )}
      </div>
    );
  };

  if (loading) return <div>Laden...</div>;

  return (
    <div className={`flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden ${embedded ? 'h-full' : ''}`}>
      <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center px-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-blue-600"><Lock size={14} /></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Smart Editor {allowedZibs ? '(Filtered)' : ''}</span>
        </div>
        <div className="flex items-center gap-4"><span className="text-[8px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase">Autosave Active</span></div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
        {sections.length > 0 ? sections.map((section) => (
          <div key={section.id} className="group space-y-4">
            <div className="flex justify-between items-center px-1 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-800">{section.label}</label>
                {section.zib_mapping && (
                  <div className="group/zib relative"><Database size={12} className="text-blue-300 cursor-help" /></div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className={`${(section.selected_fields?.length || 0) > 0 ? 'col-span-7' : 'col-span-12'}`}>
                     <div className="relative h-full">
                        <textarea
                        value={(formData[section.section_key] as string) || ''}
                        onChange={(e) => setFormData({...formData, [section.section_key]: e.target.value})}
                        placeholder={section.placeholder}
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all text-sm leading-relaxed text-slate-700 min-h-[120px] resize-none shadow-inner h-full"
                        />
                    </div>
                </div>
                {section.selected_fields && section.selected_fields.length > 0 && section.zib_mapping && (
                    <div className="col-span-5 bg-blue-50/30 rounded-2xl p-4 border border-blue-100/50">
                        <div className="mb-3 flex items-center gap-2">
                            <Info size={12} className="text-blue-400" />
                            <span className="text-[9px] font-black uppercase text-blue-400 tracking-wider">Gestructureerde Data</span>
                        </div>
                        <div className="space-y-3">
                            {section.selected_fields.map(fieldName => renderZibField(section.zib_mapping!, fieldName))}
                        </div>
                    </div>
                )}
            </div>
          </div>
        )) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-20"><Settings size={32} className="text-slate-200 mb-4" /><p className="text-xs font-bold text-slate-400 uppercase">Geen secties</p></div>
        )}
      </div>

      <div className="p-6 border-t border-slate-50 bg-white px-8 flex justify-end gap-3">
         <button disabled={saving} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Concept opslaan</button>
         <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
         >
            {saving ? 'Verwerken...' : <><CheckCircle2 size={14} /> Valideren & Publiceren</>}
         </button>
      </div>
    </div>
  );
};
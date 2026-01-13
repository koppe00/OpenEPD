'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Lock, Database, Info, Settings, CheckCircle2, Loader2 } from 'lucide-react';
import { ZIB_CONFIG } from '@openepd/clinical-core';
import { ClinicalObservation } from '@/hooks/useClinicalData';
import { useRouter } from 'next/navigation';
import { SectionDataRenderer } from '../UniversalZibWidget';
import { WidgetSection } from '@/hooks/useDashboardLayout';

type ExtendedObservation = ClinicalObservation & {
  value?: Record<string, unknown>; 
  value_quantity?: { value: number; unit: string };
};

// 1. Voeg layoutSections toe aan de Interface
interface SmartTemplateEditorProps {
  observations?: ClinicalObservation[];
  mode?: string;
  allowedZibs?: string[];
  embedded?: boolean;
  patientId?: string;
  onSaveSuccess?: () => void;
  layoutSections?: WidgetSection[]; // <--- Dit gebruikt nu de geimporteerde versie
}

export const SmartTemplateEditor = ({ 
  observations = [], 
  embedded, 
  allowedZibs, 
  patientId,
  onSaveSuccess,
  layoutSections = [] 
}: SmartTemplateEditorProps) => {
  
  // 1. Lokale state voor secties en succes-status
  const [sections, setSections] = useState<WidgetSection[]>(layoutSections);
  // Initialiseer loading op true als we nog geen secties hebben
  const [loading, setLoading] = useState(layoutSections.length === 0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  
  const supabase = getSupabaseBrowserClient();

  // 2. Synchroniseer secties wanneer layoutSections (uit de database join) binnenkomt

useEffect(() => {
  if (layoutSections && layoutSections.length > 0) {
    // OPTIE A: Laat ALLES zien wat in de architect staat (Aanbevolen)
    setSections(layoutSections);
    setLoading(false);
    
    /* OPTIE B: Alleen filteren als je echt specifiek widgets wilt beperken, 
    maar voor nu is dit vaak de reden dat je 'Geen secties' ziet:
    const filtered = allowedZibs && allowedZibs.length > 0
      ? layoutSections.filter(sec => sec.zib_mapping && allowedZibs.includes(sec.zib_mapping))
      : layoutSections;
    setSections(filtered);
    */
  } else if (layoutSections) {
    setLoading(false);
  }
}, [layoutSections]); // Haal allowedZibs uit de dependency als je Optie A kiest


  const handleSave = async () => {
    if (!patientId) {
        alert("Geen patiënt geselecteerd.");
        return;
    }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const entriesToSave: Record<string, any> = {};

    // 1. Gestructureerde & Vrije tekst velden verzamelen
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
            setShowSuccess(true); // Toon de checkmark
            if (onSaveSuccess) onSaveSuccess();
            setTimeout(() => setShowSuccess(false), 3000); // Verberg na 3 sec
        } else {
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

  // 3. Verbeterde Loading State (Gebruikersvriendelijker)
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">
          Consult-notities laden...
        </p>
      </div>
    );
  }
  return (
    <div className={`flex flex-col bg-white rounded-md border border-slate-200 overflow-hidden ${embedded ? 'h-full' : ''}`}>
      {/* Header - ultra compact */}
      <div className="px-2 py-1 border-b border-slate-100 bg-slate-50 flex justify-between items-center min-h-[28px]">
        <div className="flex items-center gap-1">
          <Lock size={10} className="text-blue-600" />
          <span className="text-[8px] font-bold uppercase tracking-wide text-slate-500">Smart Editor</span>
        </div>
        <div className="flex items-center gap-1">
           {showSuccess && (
             <span className="flex items-center gap-0.5 text-emerald-500 font-bold text-[8px] uppercase"><CheckCircle2 size={10} /> Opgeslagen</span>
           )}
           <span className="text-[7px] font-bold text-emerald-500 bg-emerald-50 px-1 py-0.5 rounded">Live Sync</span>
        </div>
      </div>

      {/* Content - ultra compact, minimale witruimte */}
      <div className="flex-1 overflow-y-auto px-2 py-1 custom-scrollbar">
        {sections.length > 0 ? sections.map((section) => (
          <div key={section.id} className="relative border-b border-slate-100 last:border-b-0">
            <SectionDataRenderer 
              key={section.id} 
              section={section} 
              observations={observations}
              patientId={patientId}
              onDataChange={onSaveSuccess}
              mode="journal"
            />
          </div>
        )) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-4">
            <Settings size={18} className="text-slate-200 mb-1" />
            <p className="text-[9px] font-bold text-slate-400 uppercase">Geen secties geconfigureerd</p>
          </div>
        )}
      </div>

      {/* Footer - ultra compact */}
      <div className="px-2 py-1 border-t border-slate-100 bg-white flex justify-end gap-1">
        <button className="px-2 py-1 rounded text-[8px] font-bold uppercase text-slate-400 hover:text-slate-600">Concept</button>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className={`px-3 py-1 rounded font-bold text-[8px] uppercase tracking-wide flex items-center gap-0.5 shadow ${
            showSuccess ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-blue-600'
          }`}
        >
          {saving ? <Loader2 className="animate-spin" size={10} /> : <CheckCircle2 size={10} />}
          {saving ? 'Verwerken...' : showSuccess ? 'Gepubliceerd' : 'Valideren & Publiceren'}
        </button>
      </div>
    </div>
  );
};
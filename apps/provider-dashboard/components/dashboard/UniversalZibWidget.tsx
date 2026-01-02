'use client';

import React, { useState } from 'react';
import { ZIB_CONFIG } from '@openepd/clinical-core';
import { 
  Activity, Edit3, Save, Calendar, User, ChevronRight, Plus, Loader2 
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { DashboardWidget, WidgetSection } from '@/hooks/useDashboardLayout';
import { ClinicalObservation } from '@/hooks/useClinicalData';
import { ZibValidationService } from '@openepd/clinical-core';

// Engines
import { SmartTemplateEditor } from './clinical/SmartTemplateEditor';
import { AIAssistantWidget } from './ai/AIAssistantWidget'; 
import { ReferralInboxWidget } from './admin/ReferralInboxWidget';
import { AppointmentSchedulerWidget } from './admin/AppointmentSchedulerWidget';
import { PatientRegistrationWidget } from './admin/PatientRegistrationWidget';

interface Props {
  widget: DashboardWidget;
  observations: ClinicalObservation[];
  patientId: string;
  onAddMeasurement?: (zibId: string) => void;
  onViewDetail?: (zibId: string) => void;
  onDataChange?: () => void;
}

export function UniversalZibWidget(props: Props) {
  const { widget, observations = [], patientId, onViewDetail, onDataChange, onAddMeasurement } = props;
  const definition = widget.definition;
  
  // HIER ZIT DE SLEUTEL: We kijken nu naar het database veld 'engine_type'
  // In je SQL script is dit 'form', 'list', 'admin_scheduler', etc.
  const engine_type = definition?.engine_type || (widget as any).engine_type;
  
  const configuration = widget.configuration || {};
  const display_title = widget.display_title || definition?.name || 'Naamloze Widget';
  const sections = (definition?.sections as WidgetSection[]) || [];

  // 1. ADMIN ENGINES (Blijft hetzelfde)
  if (engine_type === 'admin_registration_form') return <PatientRegistrationWidget />;
  if (engine_type === 'admin_referral_list') return <ReferralInboxWidget />;
  if (engine_type === 'admin_scheduler') return <AppointmentSchedulerWidget />;

  // 2. AI COPILOT (Blijft hetzelfde)
  if (engine_type === 'ai_copilot') {
    const targetZibs = (configuration?.zibs as string[]) || []; 
    return <AIAssistantWidget observations={observations} monitoredZibs={targetZibs} patientId={patientId} />;
  }

  // ===========================================================================
  // 3. FORM ENGINE (Main Content)
  // Voorheen checkte je hier op 'universal_zib_form'. Nu checken we op 'form'.
  // Dit is voor de grote blokken zoals 'Cardio Metingen' of 'Wondzorg'.
  // ===========================================================================
  if (engine_type === 'form') {
    return (
      <div className="h-full flex flex-col bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6 px-4">
          <Edit3 size={16} className="text-blue-500" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">{display_title}</h3>
        </div>
        
        {/* De SmartTemplateEditor handelt de secties af in 'Journal' mode */}
        <SmartTemplateEditor 
          observations={observations} 
          layoutSections={sections} 
          patientId={patientId}
          onSaveSuccess={onDataChange}
          embedded={true}
        />
      </div>
    );
  }

  // ===========================================================================
  // 4. LIST ENGINE (Sidebar)
  // Dit is nieuw. Hier vangen we de 'list' widgets op (zoals Alerts, Scores).
  // We renderen ze als compacte lijstjes onder elkaar.
  // ===========================================================================
  if (engine_type === 'list') {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col p-5 hover:border-blue-300 transition-all overflow-hidden">
        <div className="flex justify-between items-center mb-6 px-1">
           <div className="flex items-center gap-2">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
               <Activity size={16} />
             </div>
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">{display_title}</h3>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
           {sections.length > 0 ? sections.map((section) => (
              <SectionDataRenderer 
                key={section.id || section.section_key} 
                section={section} 
                observations={observations} 
                onViewDetail={onViewDetail}
                onDataChange={onDataChange}
                patientId={patientId}
                mode="compact" // <--- FORCEER COMPACT MODE
              />
            )) : (
              <div className="text-[10px] text-slate-400 p-4 text-center">Geen secties geconfigureerd</div>
            )}
        </div>
      </div>
    );
  }

  // 5. LEGACY FALLBACK (Vangnet)
  return (
    <LegacyViewer 
      widget={widget} 
      observations={observations} 
      onAddMeasurement={onAddMeasurement} 
      onViewDetail={onViewDetail} 
      patientId={patientId} 
    />
  );
}

// =============================================================================
// SUB-COMPONENT: SectionDataRenderer (De 'Journal' weergave)
// =============================================================================
export function SectionDataRenderer({ 
  section, 
  observations, 
  onDataChange, 
  patientId, 
  onViewDetail, 
  mode = 'compact' 
}: any) {
  const [inputValue, setInputValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Historie filteren en sorteren
const history = observations
  .filter((obs: any) => {
    if (!obs.zib_id || !section.zib_mapping) return false;
    
    // Normaliseer beide ID's (lowercase en verwijder nl.zorg. prefix voor de vergelijking)
    const normalize = (id: string) => id.toLowerCase().replace('nl.zorg.', '');
    
    const obsIdClean = normalize(obs.zib_id);
    const mapIdClean = normalize(section.zib_mapping);
    
    // Match als ze gelijk zijn, of als de een de ander bevat
    return obsIdClean === mapIdClean || 
           obsIdClean.includes(mapIdClean) || 
           mapIdClean.includes(obsIdClean);
  })
  .sort((a: any, b: any) => new Date(b.effective_at).getTime() - new Date(a.effective_at).getTime());
 
 const saveEntry = async () => {
  if (!inputValue.trim()) return;
  setIsSaving(true);
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. INTELLIGENTIE: Valideer en Transformeer de input
    // De service kijkt naar de zib_mapping (bijv. nl.zorg.Weight) 
    // en probeert de inputValue te parsen naar het juiste JSON formaat.
    const validation = ZibValidationService.validate(section.zib_mapping, inputValue);

    // Als de service de data kan structureren (bijv. "85" naar { value: 85, unit: "kg" })
    // dan gebruiken we die geparste data, anders vallen we terug op de ruwe tekst.
    const structuredContent = validation.success 
      ? { ...validation.data, author_name: user.email?.split('@')[0] }
      : { value: inputValue, author_name: user.email?.split('@')[0], interpretation: "raw_text" };

    // 2. OPSLAAN in conform ZIB-formaat
    const { error } = await supabase.from('zib_compositions').insert({
      patient_id: patientId,
      caregiver_id: user.id,
      zib_id: section.zib_mapping,
      zib_version: "3.1",
      clinical_status: "active",
      verification_status: "unverified",
      content: structuredContent, // Hier zit nu de 'slimme' JSON in
      effective_at: new Date().toISOString(),
      source_system: 'OpenEPD-Sovereign'
    });

    if (error) throw error;
    setInputValue('');
    if (onDataChange) onDataChange();
  } catch (e: any) {
    console.error("Opslaan mislukt:", e.message);
  } finally {
    setIsSaving(false);
  }
};

 const getCompactValue = (obs: any) => {
  // 1. Als er helemaal geen observation is, stop direct
  if (!obs) return '--';

  // 2. Pak de data uit content (nieuw) of value (oud/legacy)
  const data = obs.content || obs.value; 
  if (!data) return '--';
  
  const selectedFields = section.selected_fields || [];

  // 3. Als de architect velden heeft gekozen, map deze
  if (selectedFields.length > 0) {
    const formattedValues = selectedFields
      .map((field: string) => {
        const val = data[field] || data[field.toLowerCase()];
        if (val === undefined || val === null) return null;

        // Haal eenheid uit ZIB_CONFIG via de mapping uit de architect
        // @ts-ignore
        const fieldConfig = ZIB_CONFIG[section.zib_mapping]?.fields?.[field];
        const unitSuffix = fieldConfig?.unit ? ` ${fieldConfig.unit}` : '';

        return `${val}${unitSuffix}`;
      })
      .filter(Boolean); // Verwijder null waarden

    return formattedValues.length > 0 ? formattedValues.join(' / ') : '--';
  }

  // 4. Fallback: als er geen architect-velden zijn, toon de ruwe waarde
  return data.value || data.quantity || '--';
};

  // Helper functie om tekst uit ZIB data te vissen
const formatMedicalText = (obs: any) => {
  const val = obs.value || obs.content;
  if (!val) return "Geen inhoud";

  // Als het al een string is, direct teruggeven
  if (typeof val === 'string') return val;

  // Zoek naar bekende tekst-velden in het object
  const text = 
    val.value || 
    val.narrative_text || 
    val.anamnesis_text || 
    val.progress_note || 
    val.findings ||
    // Als we niets vinden, maar er is wel tekst in de JSON, toon de eerste string-waarde
    Object.values(val).find(v => typeof v === 'string');

  return text || "Geen leesbare tekst";
};


  // --- WEERGAVE A: COMPACT (Voor Vitale Parameters / ZIB Viewer) ---
  if (mode === 'compact') {
    // FIX 1: Verwijder 'const' als 'latest' al eerder in de scope is gedeclareerd, 
    // of gebruik een unieke naam voor deze block-scope.
    const latestEntry = history && history.length > 0 ? history[0] : null;
    
    // @ts-ignore
    const zibDef = ZIB_CONFIG[section.zib_mapping as keyof typeof ZIB_CONFIG];
    const defaultUnit = Array.isArray(zibDef) ? zibDef[0]?.unit : '';

    const getCompactValue = (obs: any) => {
      if (!obs) return '--';
      const data = obs.content || obs.value; 
      if (!data) return '--';
      
      const selectedFields = section.selected_fields || [];

      if (selectedFields.length > 0) {
        return selectedFields.map((field: string) => {
          const val = data[field] ?? data[field.toLowerCase()];
          if (val === undefined || val === null) return null;

          // FIX 2: ZIB_CONFIG is een array, we zoeken het veld in de definities
          let unit = '';
          if (Array.isArray(zibDef)) {
            const fieldDef = zibDef.find((f: any) => f.key === field || f.name === field);
            unit = fieldDef?.unit ? ` ${fieldDef.unit}` : '';
          }

          return `${val}${unit}`;
        })
        .filter(Boolean)
        .join(' / ');
      }

      return data.value || data.quantity || '--';
    };

    return (
      <div 
        onClick={() => onViewDetail?.(section.zib_mapping)}
        className="group cursor-pointer p-3 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all flex justify-between items-center"
      >
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
            {section.label}
          </span>
          <span className="text-sm font-black text-slate-800">
            {getCompactValue(latestEntry)}
            {/* Toon alleen de unit als er geen selected_fields zijn (die hebben hun eigen unit) */}
            {(!section.selected_fields || section.selected_fields.length === 0) && defaultUnit && (
              <span className="text-[10px] ml-1 text-slate-400 font-bold uppercase">{defaultUnit}</span>
            )}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-slate-300 font-bold">
            {latestEntry ? new Date(latestEntry.effective_at).toLocaleDateString('nl-NL', {day:'2-digit', month:'2-digit'}) : ''}
          </span>
          <ChevronRight size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>
    );
  }

  // --- WEERGAVE B: JOURNAL (Voor Consultvoering / Data Invoer) ---
  return (
    <div className="mb-12 group animate-in fade-in slide-in-from-bottom-2">
      {/* Header met vandaag-indicatie */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">{section.label}</h3>
        <div className="h-[1px] flex-1 bg-slate-100"></div>
        <div className="flex items-center gap-2 text-blue-500">
          <Calendar size={12} />
          <span className="text-[9px] font-black uppercase tracking-widest">
            {new Date().toLocaleDateString('nl-NL')} (Vandaag)
          </span>
        </div>
      </div>

      {/* Brede Invoerregel */}
      <div className="relative mb-0">
        <textarea 
          rows={1}
          className="w-full p-3 bg-white border border-slate-200 rounded-[2rem] text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition-all resize-none placeholder:text-slate-300"
          placeholder={section.placeholder || `Noteer hier de bevindingen voor ${section.label.toLowerCase()}...`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveEntry(); }}
        />
        <div className="absolute right-4 bottom-4">
           {inputValue.length > 0 && (
             <button 
               onClick={saveEntry}
               disabled={isSaving}
               className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10"
             >
               {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} 
               Vastleggen
             </button>
           )}
        </div>
      </div>

      {/* Rijke Historie Tijdlijn */}
      <div className="space-y-2 pl-6 border-l-2 border-slate-50 ml-2">
        {history.length > 0 ? (
          history.slice(0, showFullHistory ? 10 : 3).map((obs: any) => (
            <div key={obs.id} className="relative group/item">
              {/* In de loop van je historie tijdlijn (Journal mode) */}
<div className="space-y-2">
  <div className="flex justify-between items-start gap-4">
    <div className="flex-1 space-y-2"> {/* Container voor tekst + gestructureerde data */}
      
      {/* 1. De Vrije Tekst (het verhaal) */}
      <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
        {(() => {
          const val = obs.value || obs.content;
          if (!val) return "Geen inhoud";
          const text = val.value || val.narrative_text || val.anamnesis_text || val.progress_note || val.findings;
          return typeof text === 'string' ? text : (typeof val === 'string' ? val : null);
        })() || (history.length > 0 && !section.selected_fields?.length ? "Geen tekstnotitie" : "")}
      </p>

      {/* 2. DE SLIMME TOEVOEGING: Gestructureerde data uit de Architect */}
      {section.selected_fields && section.selected_fields.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {section.selected_fields.map((field: string) => {
            const val = obs.value?.[field] || obs.value?.[field.toLowerCase()];
            if (val === undefined || val === null) return null;
            
            return (
              <div key={field} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">
                  {field.replace('_', ' ')}:
                </span>
                <span className="text-[10px] font-bold text-slate-600">
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>

                  {/* SNEL-KOPIEER KNOP (Verschijnt bij hover) */}
                  <button
                    onClick={() => {
                      const val = obs.value || obs.content;
                      const text = val.value || val.narrative_text || val.anamnesis_text || val.progress_note || val.findings || (typeof val === 'string' ? val : '');
                      setInputValue(text);
                      // Scroll even naar boven naar het invoerveld
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="opacity-0 group-hover/item:opacity-100 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-1 text-[9px] font-black uppercase tracking-widest shrink-0"
                    title="Kopieer naar nieuwe notitie"
                  >
                    <Plus size={12} /> Overnemen
                  </button>
                </div>

                {/* Subgegevens (Datum, Auteur, ZIB) */}
                <div className="flex items-center gap-4 text-[9px] font-black uppercase text-slate-400 tracking-tight">
                  {/* ... je bestaande Calendar en User spans ... */}
                  <span className="flex items-center gap-1">
                    <Calendar size={10} className="text-slate-300" /> 
                    {new Date(obs.effective_at).toLocaleDateString('nl-NL')}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={10} className="text-slate-300" /> 
                    {(obs.value as any)?.author_name || 'Specialist'}
                  </span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-[8px] opacity-60">
                    {section.zib_mapping.split('.').pop()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[10px] italic text-slate-300 uppercase tracking-widest ml-2">
            Geen eerdere registraties gevonden
          </p>
        )}
        
        {history.length > 3 && !showFullHistory && (
          <button 
            onClick={() => setShowFullHistory(true)} 
            className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] pt-2 hover:text-blue-700 transition-colors ml-2"
          >
            + Toon volledige historie ({history.length - 3} meer)
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// SUB-COMPONENT: Legacy Viewer (Vangnet voor niet-geconfigureerde widgets)
// =============================================================================
function LegacyViewer({ widget, observations, onViewDetail }: any) {
    const configuration = widget.configuration || {};
    const targetZibs = (configuration?.zibs as string[]) || [];
    const display_title = widget.display_title || 'Informatie';

    return (
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Activity size={16} /></div>
             <h3 className="font-black text-sm text-slate-900 tracking-tight">{display_title}</h3>
          </div>
        </div>
        <div className="space-y-0.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {targetZibs.length > 0 ? targetZibs.map((zibKey: string) => {
            const zibDef = ZIB_CONFIG[zibKey as keyof typeof ZIB_CONFIG];
            const latestObs = observations
              .filter((o: any) => o.zib_id === zibKey || o.zib_id?.endsWith(`.${zibKey}`))
              .sort((a: any, b: any) => new Date(b.effective_at).getTime() - new Date(a.effective_at).getTime())[0];

            return (
              <div 
                key={zibKey} 
                onClick={() => onViewDetail && latestObs && onViewDetail(zibKey)} 
                className="flex justify-between items-center group cursor-pointer border-b border-slate-50 pb-2"
              >
                  <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-600 transition-colors">
                    {/* @ts-ignore */}
                    {zibDef?.[0]?.label || zibKey}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-800">
                      {latestObs?.value ? (latestObs.value.value || JSON.stringify(latestObs.value)) : '--'}
                    </span>
                    {/* @ts-ignore */}
                    <span className="text-[9px] text-slate-400 ml-1">{zibDef?.[0]?.unit}</span>
                  </div>
              </div>
            );
          }) : (
            <div className="flex flex-col items-center justify-center h-full opacity-20">
               <Activity size={32} />
               <p className="text-[10px] font-black uppercase mt-2">Geen data geselecteerd</p>
            </div>
          )}
        </div>
      </div>
    );
}
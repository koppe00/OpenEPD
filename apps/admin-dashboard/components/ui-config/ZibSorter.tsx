'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Save, Trash2, 
  Layout, Code2, Eye, List, Table as TableIcon, BarChart3,
  Loader2, Plus, Settings2, Info, Type
} from 'lucide-react';
import { ZIB_CONFIG } from '@openepd/clinical-core';

const ENGINE_OPTIONS = [
  { id: 'universal_zib_viewer', label: 'ZIB Viewer (Data tonen)' },
  { id: 'universal_zib_form', label: 'ZIB Formulier (Data invoer)' },
  { id: 'react_component', label: 'Custom React Component' },
  { id: 'ai_copilot', label: 'AI Copilot' },
  { id: 'admin_registration_form', label: 'Admin: Registratie' },
  { id: 'admin_referral_list', label: 'Admin: Verwijzingen' },
  { id: 'admin_scheduler', label: 'Admin: Agenda' },
];

export default function WidgetArchitect() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [widget, setWidget] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    
    const { data: w } = await supabase.from('widget_definitions').select('*').eq('id', id).single();
    const { data: s } = await supabase.from('widget_sections').select('*').eq('widget_definition_id', id).order('sort_order');
    
    setWidget(w);
    setSections(s || []);
    setLoading(false);
  }, [id, supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const addSection = async () => {
    const uniqueKey = `section_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const { data, error } = await supabase
      .from('widget_sections')
      .insert({
        widget_definition_id: id,
        section_key: uniqueKey,
        label: 'Nieuwe Sectie',
        ui_control_type: 'table',
        sort_order: sections.length,
        selected_fields: [],
        zib_mapping: null
      })
      .select()
      .single();

    if (error) alert(`Fout: ${error.message}`);
    else if (data) setSections([...sections, data]);
  };

  const toggleField = (sectionIdx: number, fieldName: string) => {
    const updatedSections = [...sections];
    const currentFields = updatedSections[sectionIdx].selected_fields || [];
    updatedSections[sectionIdx].selected_fields = currentFields.includes(fieldName)
      ? currentFields.filter((f: string) => f !== fieldName)
      : [...currentFields, fieldName];
    setSections(updatedSections);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update de Bron-definitie (De Master)
      const { error: defError } = await supabase.from('widget_definitions').update({ 
        name: widget.name,
        description: widget.description,
        engine_type: widget.engine_type,
        component_key: widget.component_key,
        default_icon: widget.default_icon
      }).eq('id', id);

      if (defError) throw defError;

      // 2. Update de Secties
      const updates = sections.map(section => 
        supabase.from('widget_sections').update({
          label: section.label,
          zib_mapping: section.zib_mapping,
          ui_control_type: section.ui_control_type,
          selected_fields: section.selected_fields,
          placeholder: section.placeholder,
          sort_order: section.sort_order
        }).eq('id', section.id)
      );
      
      await Promise.all(updates);
      alert("Blauwdruk succesvol gepubliceerd. Wijzigingen zijn direct live op alle dashboards.");
    } catch (err: any) {
      console.error(err);
      alert(`Fout bij opslaan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse uppercase text-xs tracking-widest text-slate-300">Architectuur laden...</div>;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{widget?.name}</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {id?.slice(0,8)}</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-blue-900/20">
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Blauwdruk Publiceren
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Kolom 1: De Editor */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* SECTIE: Identiteit & Engine */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <Settings2 size={16} className="text-blue-500" />
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Widget Identiteit (Source of Truth)</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Publieke Naam</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-black" value={widget.name} onChange={e => setWidget({...widget, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Engine Type</label>
                <select className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-black" value={widget.engine_type} onChange={e => setWidget({...widget, engine_type: e.target.value})}>
                  {ENGINE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Component Key (React)</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-mono text-blue-600" value={widget.component_key} onChange={e => setWidget({...widget, component_key: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Default Icon (Lucide)</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-black" value={widget.default_icon} onChange={e => setWidget({...widget, default_icon: e.target.value})} />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Omschrijving / Metadata</label>
                <textarea className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-medium h-20 resize-none" value={widget.description || ''} onChange={e => setWidget({...widget, description: e.target.value})} />
              </div>
            </div>
          </div>

          {/* SECTIE: Blueprint Opbouw */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Layout size={16} className="text-blue-500" />
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Sectie Architectuur</h3>
              </div>
              <button onClick={addSection} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2">
                <Plus size={14} /> Sectie Toevoegen
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="py-16 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Nog geen secties gedefinieerd</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section, idx) => (
                  <div key={section.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6 relative group">
                    <button onClick={async () => { if(confirm("Verwijderen?")) { await supabase.from('widget_sections').delete().eq('id', section.id); setSections(sections.filter(s => s.id !== section.id)); }}} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={18} />
                    </button>

                    <div className="flex gap-4">
                      <div className="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-blue-500 shadow-sm border border-blue-50">STAP {idx + 1}</div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Sectie Label</label>
                          <input className="w-full p-3 bg-white rounded-xl text-sm font-black border border-slate-100" value={section.label} onChange={e => { const s = [...sections]; s[idx].label = e.target.value; setSections(s); }} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">ZIB Mapping</label>
                          <select className="w-full p-3 bg-white rounded-xl text-sm font-black border border-slate-100" value={section.zib_mapping || ""} onChange={e => { const s = [...sections]; s[idx].zib_mapping = e.target.value; s[idx].selected_fields = []; setSections(s); }}>
                             <option value="">-- Geen --</option>
                             {Object.keys(ZIB_CONFIG).map(zib => <option key={zib} value={zib}>{zib}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">UI Control</label>
                          <select className="w-full p-3 bg-white rounded-xl text-sm font-black border border-slate-100" value={section.ui_control_type} onChange={e => { const s = [...sections]; s[idx].ui_control_type = e.target.value; setSections(s); }}>
                             <option value="table">Tabel (Historie)</option>
                             <option value="list">Lijst (Compact)</option>
                             <option value="text_area">Vrije Tekst</option>
                             <option value="chart">Grafiek</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Placeholder (Optioneel)</label>
                          <input className="w-full p-3 bg-white rounded-xl text-sm font-medium border border-slate-100" value={section.placeholder || ''} onChange={e => { const s = [...sections]; s[idx].placeholder = e.target.value; setSections(s); }} />
                        </div>
                      </div>
                    </div>

                    {section.zib_mapping && (
                       <div className="bg-white/50 p-6 rounded-2xl space-y-3">
                          <p className="text-[9px] font-black uppercase text-slate-400">ZIB Velden Filter</p>
                          <div className="grid grid-cols-4 gap-2">
                             {(ZIB_CONFIG as any)[section.zib_mapping]?.map((field: any) => {
                                const active = section.selected_fields?.includes(field.name);
                                return (
                                   <button key={field.name} onClick={() => toggleField(idx, field.name)} className={`p-2 rounded-lg border text-left transition-all ${active ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}`}>
                                      <p className="text-[8px] font-black uppercase truncate">{field.label}</p>
                                   </button>
                                );
                             })}
                          </div>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom 2: Info & Preview */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8 sticky top-8">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
                 <Info size={16} className="text-blue-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Architectuur Info</span>
              </div>
              <div className="space-y-4">
                 <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                    "Je bewerkt nu de centrale definitie. Elke widget-instantie op dashboards van zorgverleners haalt live deze secties en engine-configuratie op."
                 </p>
                 <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Engine Engine</p>
                    <code className="text-blue-400 text-xs font-mono">{widget.engine_type}</code>
                 </div>
              </div>
              
              <div className="space-y-4 pt-4">
                 <p className="text-[10px] font-black uppercase text-slate-500">Preview Structuur</p>
                 {sections.map(s => (
                    <div key={s.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                       <div className="p-2 bg-slate-800 rounded-lg"><ChevronRight size={14} className="text-slate-600" /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase">{s.label}</p>
                          <p className="text-[8px] text-slate-500">{s.zib_mapping || 'Geen ZIB'}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
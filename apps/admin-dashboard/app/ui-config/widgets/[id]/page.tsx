'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Plus, Trash2, 
  Settings2, Database, Layout, Type, 
  ChevronRight, Sparkles, Check
} from 'lucide-react';
import { ZIB_CONFIG } from '@openepd/clinical-core';

export default function WidgetArchitect({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [widget, setWidget] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: w } = await supabase.from('widget_definitions').select('*').eq('id', params.id).single();
    const { data: s } = await supabase.from('widget_sections').select('*').eq('widget_definition_id', params.id).order('sort_order');
    
    setWidget(w);
    setSections(s || []);
    setLoading(false);
  }, [params.id, supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleField = (sectionIdx: number, fieldName: string) => {
    const updatedSections = [...sections];
    const currentFields = updatedSections[sectionIdx].selected_fields || [];
    
    if (currentFields.includes(fieldName)) {
      updatedSections[sectionIdx].selected_fields = currentFields.filter((f: string) => f !== fieldName);
    } else {
      updatedSections[sectionIdx].selected_fields = [...currentFields, fieldName];
    }
    setSections(updatedSections);
  };

  const addSection = async () => {
    const newSection = {
      widget_definition_id: params.id,
      section_key: 'nieuwe_sectie',
      label: 'Nieuwe Sectie',
      ui_control_type: 'text_area',
      sort_order: sections.length,
      selected_fields: []
    };
    const { data, error } = await supabase.from('widget_sections').insert(newSection).select().single();
    if (data) setSections([...sections, data]);
  };

  const handleSave = async () => {
    setSaving(true);
    // We updaten alle secties parallel
    const updates = sections.map(section => 
      supabase.from('widget_sections').update({
        label: section.label,
        zib_mapping: section.zib_mapping,
        ui_control_type: section.ui_control_type,
        selected_fields: section.selected_fields // Zorg dat deze kolom in je DB bestaat
      }).eq('id', section.id)
    );
    
    await Promise.all(updates);
    setSaving(false);
    alert("Blueprint succesvol opgeslagen.");
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse uppercase text-xs">Blueprint laden...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-3 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all shadow-sm group">
            <ArrowLeft size={20} className="text-slate-400 group-hover:text-slate-900" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Architect</span>
               <ChevronRight size={12} className="text-slate-300" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{widget?.component_key}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic uppercase">{widget?.name}</h1>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-900 transition-all shadow-2xl">
          <Save size={18} /> {saving ? 'Verwerken...' : 'Blueprint Publiceren'}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-xl text-slate-900 tracking-tight flex items-center gap-3 italic underline decoration-blue-500 underline-offset-8">
                <Layout size={24} className="text-blue-500" /> WIDGET CONSTRUCTIE
              </h3>
              <button onClick={addSection} className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg">
                + Sectie Toevoegen
              </button>
            </div>

            <div className="space-y-6">
              {sections.map((section, idx) => (
                <div key={section.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6 relative group">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Label Input */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-2">UI Label</label>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 focus-within:border-blue-500 transition-all">
                        <Type size={16} className="text-slate-300" />
                        <input 
                          className="text-sm font-bold text-slate-700 outline-none w-full bg-transparent" 
                          value={section.label} 
                          onChange={e => {
                            const s = [...sections]; s[idx].label = e.target.value; setSections(s);
                          }}
                        />
                      </div>
                    </div>

                    {/* ZIB Select */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-2">ZIB Koppeling</label>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 focus-within:border-blue-500 transition-all">
                        <Database size={16} className="text-slate-300" />
                        <select 
                          className="text-sm font-bold text-slate-700 outline-none w-full appearance-none bg-transparent cursor-pointer"
                          value={section.zib_mapping || ""}
                          onChange={e => {
                            const s = [...sections]; 
                            s[idx].zib_mapping = e.target.value; 
                            s[idx].selected_fields = []; // Reset velden bij nieuwe ZIB
                            setSections(s);
                          }}
                        >
                          <option value="">-- Geen koppeling --</option>
                          {Object.keys(ZIB_CONFIG).map(zib => (
                            <option key={zib} value={zib}>{zib}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* DYNAMISCHE FIELD PICKER */}
                  {section.zib_mapping && ZIB_CONFIG[section.zib_mapping] && (
                    <div className="bg-white/60 p-6 rounded-[2rem] border border-blue-100 animate-in fade-in zoom-in-95">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={14} className="text-blue-500" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Beschikbare Datavelden</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {ZIB_CONFIG[section.zib_mapping].map((field) => {
                          const active = section.selected_fields?.includes(field.name);
                          return (
                            <button
                              key={field.name}
                              onClick={() => toggleField(idx, field.name)}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${active ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                            >
                              <div className="text-left">
                                <p className="text-[10px] font-black uppercase leading-tight">{field.label}</p>
                                <p className={`text-[8px] font-medium opacity-60 ${active ? 'text-blue-100' : 'text-slate-400'}`}>{field.type}</p>
                              </div>
                              {active && <Check size={14} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions Area */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-3">
                      <select 
                        className="text-[9px] font-black uppercase bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-500 outline-none hover:border-blue-500 transition-all"
                        value={section.ui_control_type}
                        onChange={e => {
                          const s = [...sections]; s[idx].ui_control_type = e.target.value; setSections(s);
                        }}
                      >
                        <option value="text_area">Vrije Tekst (AI-gestuurd)</option>
                        <option value="measurement_group">Metingen Dashboard</option>
                        <option value="checklist">Selectielijst</option>
                      </select>
                    </div>
                    <button 
                      onClick={async () => {
                        if(confirm("Sectie definitief verwijderen?")) {
                          await supabase.from('widget_sections').delete().eq('id', section.id);
                          setSections(sections.filter(s => s.id !== section.id));
                        }
                      }}
                      className="p-3 text-slate-300 hover:text-rose-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-span-12 lg:col-span-4">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl sticky top-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
                <Settings2 size={16} /> Blueprint Info
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Technische Key</p>
                  <code className="bg-white/10 px-3 py-1 rounded text-blue-300 text-xs">{widget?.component_key}</code>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Selecteer per sectie de gewenste ZIB-velden. Deze velden worden in de Provider App getoond voor gestructureerde data-entry.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
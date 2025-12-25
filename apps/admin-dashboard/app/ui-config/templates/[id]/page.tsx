'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
// 1. IMPORT DE SORTER
import { ZibSorter } from '@/components/ui-config/ZibSorter';
import { 
  ArrowLeft, Save, Trash2, Monitor, Brain, FileText 
} from 'lucide-react';

interface WidgetInstance {
  id?: string;
  widget_definition_id: string;
  region: 'left_sidebar' | 'main_content' | 'right_sidebar';
  sort_order: number;
  display_title: string;
  configuration: { zibs?: string[] };
  definition?: any;
}

export default function TemplateBuilder({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const router = useRouter();
  const [template, setTemplate] = useState<any>(null);
  const [widgets, setWidgets] = useState<WidgetInstance[]>([]);
  const [definitions, setDefinitions] = useState<any[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetRegion, setTargetRegion] = useState<string>('');

  const loadData = useCallback(async () => {
    const { data: t } = await supabase.from('ui_templates').select('*, ui_contexts(*)').eq('id', params.id).single();
    setTemplate(t);

    const { data: w } = await supabase
      .from('ui_widget_instances')
      .select('*, definition:widget_definitions(*)')
      .eq('template_id', params.id)
      .order('sort_order');
    
    const mappedWidgets = (w || []).map((item: any) => ({
        id: item.id,
        widget_definition_id: item.widget_definition_id,
        region: item.region,
        sort_order: item.sort_order,
        display_title: item.display_title,
        configuration: item.configuration || { zibs: [] },
        definition: item.definition
    }));
    setWidgets(mappedWidgets);

    const { data: d } = await supabase.from('widget_definitions').select('*');
    setDefinitions(d || []);

  }, [params.id, supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async () => {
    await supabase.from('ui_widget_instances').delete().eq('template_id', params.id);
    
    const payload = widgets.map(w => ({
        template_id: params.id,
        widget_definition_id: w.widget_definition_id,
        region: w.region,
        sort_order: w.sort_order,
        display_title: w.display_title,
        configuration: w.configuration
    }));
    
    const { error } = await supabase.from('ui_widget_instances').insert(payload);
    if (!error) alert("Template succesvol opgeslagen!");
    else alert("Fout bij opslaan: " + error.message);
  };

  const addWidget = (defId: string) => {
    const def = definitions.find(d => d.id === defId);
    const newWidget: WidgetInstance = {
        widget_definition_id: defId,
        region: targetRegion as any,
        sort_order: widgets.filter(w => w.region === targetRegion).length,
        display_title: def.name,
        configuration: { zibs: [] },
        definition: def
    };
    setWidgets([...widgets, newWidget]);
    setIsAddModalOpen(false);
  };
  
  // 2. NIEUWE UPDATE FUNCTIE VOOR ZIBSORTER
  const updateWidgetZibs = (index: number, newZibs: string[]) => {
      const newWidgets = [...widgets];
      newWidgets[index].configuration.zibs = newZibs;
      setWidgets(newWidgets);
  };

  const updateTitle = (widgetIndex: number, title: string) => {
     const newWidgets = [...widgets];
     newWidgets[widgetIndex].display_title = title;
     setWidgets(newWidgets);
  };

  const removeWidget = (index: number) => {
    const newWidgets = [...widgets];
    newWidgets.splice(index, 1);
    setWidgets(newWidgets);
  };

  const renderRegion = (regionName: string, title: string, colSpan: string) => {
    const regionWidgets = widgets
        .map((w, i) => ({ ...w, originalIndex: i }))
        .filter(w => w.region === regionName)
        .sort((a, b) => a.sort_order - b.sort_order);

    return (
        <div className={`${colSpan} flex flex-col gap-4`}>
            <div className="bg-slate-200/50 p-4 rounded-2xl text-center border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer" onClick={() => { setTargetRegion(regionName); setIsAddModalOpen(true); }}>
                <h3 className="text-xs font-black uppercase text-slate-400 mb-2">{title}</h3>
                <span className="text-[10px] font-bold text-blue-600">+ Widget Toevoegen</span>
            </div>

            {regionWidgets.map((w) => (
                <div key={w.originalIndex} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                {w.definition?.engine_type === 'universal_zib_form' && <FileText size={16} />}
                                {w.definition?.engine_type === 'universal_zib_viewer' && <Monitor size={16} />}
                                {w.definition?.engine_type === 'ai_copilot' && <Brain size={16} />}
                            </div>
                            <input 
                                className="font-bold text-sm text-slate-900 bg-transparent outline-none focus:bg-slate-50 px-1 rounded w-full"
                                value={w.display_title}
                                onChange={(e) => updateTitle(w.originalIndex, e.target.value)}
                            />
                        </div>
                        <button onClick={() => removeWidget(w.originalIndex)} className="text-slate-300 hover:text-rose-500 transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* 3. DE ZIB SORTER INTEGRATIE */}
                    {w.definition?.engine_type !== 'ai_copilot_disabled_for_now' && (
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-[9px] font-bold uppercase text-slate-400 mb-2">Configuratie & Volgorde:</p>
                            
                            <ZibSorter 
                                selectedZibs={w.configuration.zibs || []}
                                onChange={(newZibs) => updateWidgetZibs(w.originalIndex, newZibs)}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl"><ArrowLeft size={20} /></button>
            <div>
                <h1 className="text-xl font-black text-slate-900">{template?.name || 'Laden...'}</h1>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-wide">
                    {template?.ui_contexts?.specialty_code} • {template?.ui_contexts?.care_setting}
                </p>
            </div>
         </div>
         <button onClick={handleSave} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10">
            <Save size={16} /> Opslaan
         </button>
      </div>

      <div className="max-w-[1800px] mx-auto p-8">
         <div className="grid grid-cols-12 gap-8">
            {renderRegion('left_sidebar', 'Linker Balk', 'col-span-3')}
            {renderRegion('main_content', 'Hoofd Proces', 'col-span-6')}
            {renderRegion('right_sidebar', 'Rechter Balk', 'col-span-3')}
         </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="font-black text-xl mb-6">Kies Widget Type</h3>
                <div className="grid gap-4">
                    {definitions.map(def => (
                        <button 
                          key={def.id} 
                          onClick={() => addWidget(def.id)}
                          className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                        >
                            <div className="p-3 bg-white rounded-xl border border-slate-100 group-hover:border-blue-200 text-slate-400 group-hover:text-blue-600">
                                {def.engine_type === 'universal_zib_viewer' && <Monitor size={20} />}
                                {def.engine_type === 'universal_zib_form' && <FileText size={20} />}
                                {def.engine_type === 'ai_copilot' && <Brain size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{def.name}</h4>
                                <p className="text-xs text-slate-400 font-mono mt-1">{def.engine_type}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="mt-6 w-full py-3 text-slate-400 text-xs font-bold uppercase hover:text-slate-600">Annuleren</button>
            </div>
        </div>
      )}
    </div>
  );
}
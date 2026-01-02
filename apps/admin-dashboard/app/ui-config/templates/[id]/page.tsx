'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Trash2, Settings2, 
  LayoutTemplate, AlertTriangle, ExternalLink, Move
} from 'lucide-react';

interface WidgetInstance {
  id?: string;
  widget_definition_id: string;
  region: 'left_sidebar' | 'main_content' | 'right_sidebar';
  sort_order: number;
  display_title: string;
  definition?: any;
}

interface PageProps {
  params: { id: string };
}

export default function TemplateBuilder({ params }: PageProps) {
  const supabase = createClient();
  const router = useRouter();
  const templateId = params?.id;

  const [template, setTemplate] = useState<any>(null);
  const [widgets, setWidgets] = useState<WidgetInstance[]>([]);
  const [definitions, setDefinitions] = useState<any[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetRegion, setTargetRegion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!templateId) return;
    setLoading(true);

    try {
      const { data: t } = await supabase.from('ui_templates').select('*, ui_contexts(*)').eq('id', templateId).single();
      setTemplate(t);

      const { data: w } = await supabase
        .from('ui_widget_instances')
        .select('*, definition:widget_definitions(*)')
        .eq('template_id', templateId)
        .order('sort_order');
    
      setWidgets((w || []).map((item: any) => ({
          id: item.id,
          widget_definition_id: item.widget_definition_id,
          region: item.region,
          sort_order: item.sort_order,
          display_title: item.display_title || '',
          definition: item.definition
      })));

      const { data: d } = await supabase.from('widget_definitions').select('*').order('name');
      setDefinitions(d || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [templateId, supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async () => {
    setSaving(true);
    // 1. Verwijder oude koppelingen voor dit template
    await supabase.from('ui_widget_instances').delete().eq('template_id', templateId);
    
    // 2. Sla nieuwe plaatsingen op (zonder configuration!)
    const payload = widgets.map((w, index) => ({
        template_id: templateId,
        widget_definition_id: w.widget_definition_id,
        region: w.region,
        sort_order: index, // Simpele index-based sorting
        display_title: w.display_title
    }));
    
    const { error } = await supabase.from('ui_widget_instances').insert(payload);
    setSaving(false);
    if (!error) alert("Layout opgeslagen!");
  };

  const addWidget = (defId: string) => {
    const def = definitions.find(d => d.id === defId);
    const newWidget: WidgetInstance = {
        widget_definition_id: defId,
        region: targetRegion as any,
        sort_order: widgets.length,
        display_title: '', // Leeg laten = gebruik default uit definitie
        definition: def
    };
    setWidgets([...widgets, newWidget]);
    setIsAddModalOpen(false);
  };

  const removeWidget = (index: number) => {
    const newWidgets = [...widgets];
    newWidgets.splice(index, 1);
    setWidgets(newWidgets);
  };

  const renderRegion = (regionName: string, title: string, colSpan: string) => {
    const regionWidgets = widgets
        .map((w, i) => ({ ...w, originalIndex: i }))
        .filter(w => w.region === regionName);

    return (
        <div className={`${colSpan} space-y-4`}>
            <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{title}</h3>
                <button 
                    onClick={() => { setTargetRegion(regionName); setIsAddModalOpen(true); }}
                    className="text-[10px] font-black text-blue-600 hover:underline"
                >
                    + TOEVOEGEN
                </button>
            </div>

            <div className="bg-slate-100/50 p-4 rounded-[2.5rem] min-h-[200px] space-y-4 border-2 border-dashed border-slate-200">
                {regionWidgets.map((w) => (
                    <div key={w.originalIndex} className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <Move size={14} className="text-slate-300 cursor-move" />
                                <div>
                                    <input 
                                        className="font-black text-sm text-slate-900 bg-transparent outline-none focus:text-blue-600 placeholder:text-slate-300"
                                        placeholder={w.definition?.name}
                                        value={w.display_title}
                                        onChange={(e) => {
                                            const nw = [...widgets];
                                            nw[w.originalIndex].display_title = e.target.value;
                                            setWidgets(nw);
                                        }}
                                    />
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                                        Bron: {w.definition?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button 
                                    onClick={() => router.push(`/ui-config/widgets/${w.widget_definition_id}`)}
                                    className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                                    title="Open Architect"
                                >
                                    <Settings2 size={16} />
                                </button>
                                <button onClick={() => removeWidget(w.originalIndex)} className="p-2 text-slate-300 hover:text-rose-500 rounded-full">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Live Blauwdruk</span>
                             </div>
                             <button 
                                onClick={() => router.push(`/ui-config/widgets/${w.widget_definition_id}`)}
                                className="text-[9px] font-black text-blue-600 flex items-center gap-1 hover:underline"
                             >
                                CONFIG <ExternalLink size={10} />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">Layout laden...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center">
         <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100"><ArrowLeft size={20} /></button>
            <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{template?.name}</h1>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Template Designer</p>
            </div>
         </div>
         <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-900/20">
            {saving ? 'Bezig...' : 'Layout Opslaan'}
         </button>
      </div>

      <div className="max-w-[1600px] mx-auto p-12">
         <div className="grid grid-cols-12 gap-12">
            {renderRegion('left_sidebar', 'Left Sidebar', 'col-span-3')}
            {renderRegion('main_content', 'Main Content', 'col-span-6')}
            {renderRegion('right_sidebar', 'Right Sidebar', 'col-span-3')}
         </div>
      </div>

      {/* Add Widget Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl">
                <h3 className="font-black text-2xl tracking-tighter mb-8">Widget Bibliotheek</h3>
                <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                    {definitions.map(def => (
                        <button 
                          key={def.id} 
                          onClick={() => addWidget(def.id)}
                          className="flex flex-col gap-3 p-6 rounded-[2rem] border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left bg-slate-50/50"
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
                                    <LayoutTemplate size={20} />
                                </div>
                                <span className="text-[8px] font-black bg-slate-200 px-2 py-1 rounded text-slate-500 uppercase">{def.engine_type}</span>
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-sm">{def.name}</h4>
                                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{def.description || 'Geen omschrijving beschikbaar.'}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="mt-8 w-full py-4 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-slate-900 transition-colors">Sluiten</button>
            </div>
        </div>
      )}
    </div>
  );
}
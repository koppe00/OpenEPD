'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Plus, Layout, Code2, 
  ChevronRight, Loader2
} from 'lucide-react';

export default function WidgetList() {
  const router = useRouter();
  const supabase = createClient();
  const [widgets, setWidgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchWidgets = async () => {
      const { data } = await supabase
        .from('widget_definitions')
        .select('*')
        .order('name');
      setWidgets(data || []);
      setLoading(false);
    };
    fetchWidgets();
  }, [supabase]);

  const handleCreateWidget = async () => {
    const name = prompt("Geef een naam voor de nieuwe widget (bijv. Labuitslagen):");
    if (!name) return;

    setCreating(true);
    const componentKey = name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const { data, error } = await supabase
        .from('widget_definitions')
        .insert({
        name: name,
        component_key: componentKey,
        engine_type: 'generic_zib_v1', 
        description: `Configuratie voor ${name}`
        })
        .select()
        .single();

    if (error) {
        alert("Fout bij aanmaken: " + error.message);
        setCreating(false);
    } else {
        router.push(`/ui-config/widgets/${data.id}`);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse uppercase text-xs">Register laden...</div>;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-xl mb-6">
        <p className="text-yellow-800 font-bold text-sm">
          ⚠️ De widget builder is nog <span className="underline">under construction</span>.<br />
          Het <span className="font-mono">engine_type</span> veld moet voorlopig <span className="font-mono">handmatig</span> in de database worden aangepast voor correcte werking in de frontend.
        </p>
      </div>

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Widget Register</h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Beheer de blueprints van het OpenEPD ecosysteem</p>
        </div>
        <button 
            onClick={handleCreateWidget}
            disabled={creating}
            className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
        >
          {creating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          Nieuwe Widget
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => {
          const isAdmin = widget.engine_type?.startsWith('admin_');
          
          return (
            <button
              key={widget.id}
              onClick={() => router.push(`/ui-config/widgets/${widget.id}`)}
              className="group bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all text-left relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-2 h-full ${isAdmin ? 'bg-purple-500' : 'bg-blue-500'}`} />
              
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${isAdmin ? 'bg-purple-50' : 'bg-blue-50'}`}>
                  {isAdmin ? <Code2 className="text-purple-600" size={24} /> : <Layout className="text-blue-600" size={24} />}
                </div>
                <div className="bg-slate-50 px-3 py-1 rounded-full text-[8px] font-black uppercase text-slate-400 tracking-widest border border-slate-100">
                  {widget.engine_type}
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-blue-600 transition-colors">
                {widget.name}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 leading-relaxed">
                ID: {widget.component_key}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Architect openen</span>
                <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
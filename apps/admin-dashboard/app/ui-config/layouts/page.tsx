'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  LayoutTemplate, Save, Monitor, 
  GripVertical, Plus, Trash2, Activity, FileText, 
  Zap, Cpu, Edit3, Settings, ShieldAlert, Box
} from 'lucide-react';
import Link from 'next/link';

// DND Kit Imports
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const WIDGET_METADATA: Record<string, { name: string; icon: any; color: string }> = {
  VitalsWidget: { name: 'Vitale Parameters', icon: Activity, color: 'text-rose-500' },
  ResultsWidget: { name: 'Lab Uitslagen', icon: FileText, color: 'text-blue-500' },
  ActionWidget: { name: 'Quick Actions (GLM)', icon: Zap, color: 'text-amber-500' },
  AIAssistantCard: { name: 'AI Copilot', icon: Cpu, color: 'text-purple-500' },
  SmartTemplateEditor: { name: 'Consult Notitie', icon: Edit3, color: 'text-slate-700' },
};

// --- SORTABLE ITEM COMPONENT ---
function SortableWidget({ id, widgetKey, onRemove }: { id: string, widgetKey: string, onRemove: (key: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const meta = WIDGET_METADATA[widgetKey] || { name: widgetKey, icon: Box, color: 'text-slate-400' };
  const Icon = meta.icon;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group bg-slate-800/40 border ${isDragging ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-slate-700/50'} p-6 rounded-[2rem] flex items-center justify-between transition-colors`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div 
          {...attributes} 
          {...listeners} 
          className="p-3 bg-slate-700 rounded-2xl text-slate-400 cursor-grab active:cursor-grabbing hover:text-white transition-colors"
        >
          <GripVertical size={20} />
        </div>
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-slate-900/50 rounded-2xl ${meta.color}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-white">{meta.name}</p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest italic">Actieve Widget</p>
          </div>
        </div>
      </div>
      <button 
        onClick={() => onRemove(widgetKey)} 
        className="p-3 text-slate-600 hover:text-rose-500 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function LayoutManager() {
  const supabase = createClient();
  const [availableWidgets, setAvailableWidgets] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState('md_specialist');
  const [currentLayout, setCurrentLayout] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
console.log("DEBUG - URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchData = async () => {
    setLoading(true);
    const { data: w } = await supabase.from('widget_definitions').select('*').order('name');
    setAvailableWidgets(w || []);

    const { data: l } = await supabase.from('dashboard_layouts').select('*').eq('role_key', selectedRole).maybeSingle();
    setCurrentLayout(l?.layout_json?.widgets || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [selectedRole]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCurrentLayout((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveLayout = async () => {
    const { error } = await supabase.from('dashboard_layouts').upsert({
      role_key: selectedRole,
      workflow_mode: 'spreekuur',
      layout_json: { widgets: currentLayout }
    }, { onConflict: 'role_key' });

    if (!error) alert("Layout gepubliceerd!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Dashboard Designer</h1>
          <p className="text-slate-500 mt-3 font-medium text-sm">Beheer interface-architectuur en widget-volgorde.</p>
        </div>
        <button onClick={saveLayout} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-900 transition-all shadow-2xl">
          <Save size={18} /> Layout Publiceren
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* CATALOGUS */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-50 pb-4">Doelgroep</h3>
            <div className="space-y-2">
              {['md_specialist', 'nurse', 'assistant'].map(role => (
                <button key={role} onClick={() => setSelectedRole(role)} className={`w-full p-4 rounded-xl text-left text-xs font-black uppercase transition-all border ${selectedRole === role ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                  {role.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Catalogus</h3>
               <button onClick={() => setEditMode(!editMode)} className={`p-2 rounded-lg transition-all ${editMode ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                 <ShieldAlert size={16} />
               </button>
            </div>
            <div className="space-y-3">
              {availableWidgets.map(w => (
                <div key={w.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-xs font-black text-slate-700">{w.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{w.component_key}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/ui-config/widgets/${w.id}`} className="p-2 text-slate-300 hover:text-blue-600"><Settings size={16} /></Link>
                    <button 
                      disabled={currentLayout.includes(w.component_key)}
                      onClick={() => setCurrentLayout([...currentLayout, w.component_key])}
                      className="p-2 text-blue-500 disabled:opacity-20"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DRAG & DROP CANVAS */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-slate-900 p-12 rounded-[3.5rem] border-[12px] border-slate-800 shadow-2xl min-h-[700px]">
            <div className="flex items-center justify-between mb-10">
               <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
               </div>
               <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest flex items-center gap-2">
                 <Monitor size={14} /> Live Preview & Order
               </span>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={currentLayout} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {currentLayout.map((key) => (
                    <SortableWidget 
                      key={key} 
                      id={key} 
                      widgetKey={key} 
                      onRemove={(k) => setCurrentLayout(currentLayout.filter(i => i !== k))} 
                    />
                  ))}
                  {currentLayout.length === 0 && (
                    <div className="py-32 text-center border-4 border-dashed border-slate-800 rounded-[3rem]">
                       <p className="text-slate-700 font-black uppercase tracking-widest text-xs">Canvas is leeg</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}
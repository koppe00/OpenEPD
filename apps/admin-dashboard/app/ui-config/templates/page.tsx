'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Plus, Layout, Edit, Trash2, Save, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  work_context_id: string;
  work_context_code: string;
  work_context_name: string;
  specialty_id: string | null;
  specialty_code: string | null;
  specialty_name: string | null;
  theme_config: {
    primary: string;
    secondary: string;
    accent: string;
  };
  icon_name: string;
  is_active: boolean;
}

interface WorkContext {
  id: string;
  code: string;
  display_name: string;
  icon_name: string;
  theme_config: any;
}

interface Specialism {
  id: string;
  code: string;
  display_name: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [workContexts, setWorkContexts] = useState<WorkContext[]>([]);
  const [specialisms, setSpecialisms] = useState<Specialism[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    work_context_id: '',
    specialty_id: null as string | null
  });

  const supabase = createClient();

  const fetchTemplates = async () => {
    setLoading(true);
    
    // Fetch from enriched view with work_context and specialty data
    const { data, error } = await supabase
      .from('ui_templates_enriched')
      .select('*')
      .order('name', { ascending: true });

    if (data) setTemplates(data);
    setLoading(false);
  };

  const fetchWorkContexts = async () => {
    const { data } = await supabase
      .from('work_contexts')
      .select('id, code, display_name, icon_name, theme_config')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (data) setWorkContexts(data);
  };

  const fetchSpecialisms = async () => {
    const { data } = await supabase
      .from('specialisms')
      .select('id, code, display_name')
      .eq('is_active', true)
      .order('display_name', { ascending: true });
    
    if (data) setSpecialisms(data);
  };

  useEffect(() => {
    fetchTemplates();
    fetchWorkContexts();
    fetchSpecialisms();
  }, []);

  // --- ACTIES ---

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit template wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) return;

    const { error } = await supabase.from('ui_templates').delete().eq('id', id);
    
    if (error) {
        alert('Fout bij verwijderen: ' + error.message);
    } else {
        setTemplates(templates.filter(t => t.id !== id));
    }
  };

  const startEdit = (t: Template) => {
    setEditingId(t.id);
    setEditForm({ 
      name: t.name, 
      work_context_id: t.work_context_id,
      specialty_id: t.specialty_id
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;

    const { error } = await supabase
        .from('ui_templates')
        .update({ 
          name: editForm.name, 
          work_context_id: editForm.work_context_id,
          specialty_id: editForm.specialty_id
        })
        .eq('id', editingId);

    if (!error) {
        await fetchTemplates(); // Refresh to get updated enriched data
        setEditingId(null);
    } else {
        alert('Opslaan mislukt: ' + error.message);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Templates</h1>
          <p className="text-slate-500">Beheer de layouts en koppel ze aan Work Contexts en Specialismen.</p>
        </div>
        <button onClick={() => alert('Nieuw template wizard...')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> Nieuw Template
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Laden...</div>
      ) : (
        <div className="grid gap-4">
          {templates.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
              
              {/* EDIT MODE */}
              {editingId === t.id ? (
                  <div className="flex-1 grid gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Template Naam</label>
                        <input 
                            type="text" 
                            value={editForm.name} 
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full font-bold text-lg border p-2 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Work Context</label>
                        <select 
                          value={editForm.work_context_id}
                          onChange={(e) => setEditForm({...editForm, work_context_id: e.target.value})}
                          className="w-full border p-2 rounded text-sm"
                        >
                          {workContexts.map(wc => (
                            <option key={wc.id} value={wc.id}>
                              {wc.display_name} ({wc.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Specialisme (optioneel)</label>
                        <select 
                          value={editForm.specialty_id || ''}
                          onChange={(e) => setEditForm({...editForm, specialty_id: e.target.value || null})}
                          className="w-full border p-2 rounded text-sm"
                        >
                          <option value="">Geen specifiek specialisme</option>
                          {specialisms.map(sp => (
                            <option key={sp.id} value={sp.id}>
                              {sp.display_name} ({sp.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-2 mt-2">
                          <button onClick={saveEdit} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded font-bold flex items-center gap-1">
                            <Save size={12}/> Opslaan
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded font-bold flex items-center gap-1">
                            <X size={12}/> Annuleren
                          </button>
                      </div>
                  </div>
              ) : (
                  /* VIEW MODE */
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div 
                          className="p-3 rounded-lg text-white"
                          style={{ backgroundColor: t.theme_config?.primary || '#64748b' }}
                        >
                            <Layout size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{t.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <span 
                                  className="px-2 py-0.5 rounded uppercase font-bold tracking-wider"
                                  style={{ 
                                    backgroundColor: t.theme_config?.secondary || '#f1f5f9',
                                    color: t.theme_config?.primary || '#64748b'
                                  }}
                                >
                                    {t.work_context_name}
                                </span>
                                {t.specialty_name && (
                                  <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                      {t.specialty_name}
                                  </span>
                                )}
                                {!t.specialty_name && (
                                  <span className="text-slate-400 italic">
                                      Alle specialismen
                                  </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/ui-config/templates/${t.id}`} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200">
                            Builder Openen
                        </Link>
                        <div className="h-6 w-px bg-slate-200 mx-2"></div>
                        <button onClick={() => startEdit(t)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Bewerken">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Verwijderen">
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase'; // Of jouw path naar supabase client
import { Plus, Layout, Edit, Trash2, Save, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  description: string;
  context_id: string;
  is_active: boolean;
  ui_contexts?: {
      specialty_code: string;
      care_setting: string;
  };
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const supabase = createClient();

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ui_templates')
      .select('*, ui_contexts(specialty_code, care_setting)')
      .order('created_at', { ascending: false });

    if (data) setTemplates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
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
    setEditForm({ name: t.name, description: t.description || '' });
  };

  const saveEdit = async () => {
    if (!editingId) return;

    const { error } = await supabase
        .from('ui_templates')
        .update({ name: editForm.name, description: editForm.description })
        .eq('id', editingId);

    if (!error) {
        setTemplates(templates.map(t => t.id === editingId ? { ...t, ...editForm } : t));
        setEditingId(null);
    } else {
        alert('Opslaan mislukt');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Templates</h1>
          <p className="text-slate-500">Beheer de layouts voor Poli, Kliniek en Specialismen.</p>
        </div>
        <button onClick={() => alert('Nieuw template wizard...')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> Nieuw Template
        </button>
      </div>

      <div className="grid gap-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-blue-300 transition-colors">
            
            {/* EDIT MODE */}
            {editingId === t.id ? (
                <div className="flex-1 mr-8 grid gap-2">
                    <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="font-bold text-lg border p-1 rounded"
                    />
                    <input 
                        type="text" 
                        value={editForm.description} 
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="text-sm text-slate-500 border p-1 rounded w-full"
                    />
                    <div className="flex gap-2 mt-2">
                        <button onClick={saveEdit} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded font-bold flex items-center gap-1"><Save size={12}/> Opslaan</button>
                        <button onClick={() => setEditingId(null)} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded font-bold flex items-center gap-1"><X size={12}/> Annuleren</button>
                    </div>
                </div>
            ) : (
                /* VIEW MODE */
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-400">
                        <Layout size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{t.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                {t.ui_contexts?.specialty_code}
                            </span>
                            <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                {t.ui_contexts?.care_setting}
                            </span>
                            {t.description && <span>• {t.description}</span>}
                        </div>
                    </div>
                </div>
            )}

            {/* ACTIONS */}
            {editingId !== t.id && (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
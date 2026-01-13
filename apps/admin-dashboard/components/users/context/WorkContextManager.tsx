'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { MapPin, Plus, Edit3, Trash2, CheckCircle, X, Building2 } from 'lucide-react';

interface WorkContext {
  id: string;
  code: string;
  display_name: string;
  description: string | null;
  context_type: string;
  organization_id: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  organizations?: { name: string };
  theme_config: {
    primary: string;
    secondary: string;
    accent: string;
  } | null;
  icon_name: string | null;
  requires_patient: boolean;
}

interface Organization {
  id: string;
  name: string;
  code: string;
}

export function WorkContextManager() {
  const [contexts, setContexts] = useState<WorkContext[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContext, setSelectedContext] = useState<WorkContext | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchData = async () => {
    setLoading(true);
    const [contextsRes, orgsRes] = await Promise.all([
      supabase
        .from('work_contexts')
        .select('*, organizations(name)')
        .order('display_order', { ascending: true }),
      supabase.from('organizations').select('id, name').order('name')
    ]);
    
    if (!contextsRes.error && contextsRes.data) {
      setContexts(contextsRes.data);
    }
    if (!orgsRes.error && orgsRes.data) {
      setOrganizations(orgsRes.data.map(org => ({
        id: org.id,
        name: org.name,
        code: '' // Organizations doesn't have a code column
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (context: WorkContext) => {
    setSelectedContext(context);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedContext(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze werkcontext wilt verwijderen?')) return;
    
    const { error } = await supabase.from('work_contexts').delete().eq('id', id);
    if (!error) {
      await fetchData();
    } else {
      alert('Fout bij verwijderen: ' + error.message);
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('work_contexts')
      .update({ is_active: !currentState })
      .eq('id', id);
    
    if (!error) {
      await fetchData();
    }
  };

  const contextTypes = [
    { value: 'location', label: 'Locatie', icon: '📍', description: 'Fysieke locatie (bijv. polikliniek, ziekenhuis)' },
    { value: 'department', label: 'Afdeling', icon: '🏥', description: 'Organisatorische afdeling (bijv. Cardiologie)' },
    { value: 'shift', label: 'Dienst', icon: '🕐', description: 'Tijdgebonden dienst (bijv. dag, avond, nacht)' },
    { value: 'ward', label: 'Ward', icon: '🛏️', description: 'Verpleegafdeling of unit' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Werkcontexten
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Beheer locaties, afdelingen, diensten en wards
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
        >
          <Plus size={14} /> Nieuwe Context
        </button>
      </div>

      {/* Type Filter Chips */}
      <div className="flex gap-2 px-4">
        {contextTypes.map(type => (
          <button
            key={type.value}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            title={type.description}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-4 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 w-[100px]">Type</th>
              <th className="px-4 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 w-[140px]">Code</th>
              <th className="px-4 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Naam</th>
              <th className="px-4 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 w-[150px]">Organisatie</th>
              <th className="px-4 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center w-[100px]">Status</th>
              <th className="px-4 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right w-[100px]">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-black uppercase text-[10px]">
                  Werkcontexten laden...
                </td>
              </tr>
            ) : contexts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-slate-400">
                  <MapPin size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">Geen werkcontexten gevonden</p>
                  <p className="text-sm mt-1">Klik op "Nieuwe Context" om te beginnen</p>
                </td>
              </tr>
            ) : (
              contexts.map((context) => {
                const typeInfo = contextTypes.find(t => t.value === context.context_type);
                return (
                  <tr key={context.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5">
                        <span className="text-lg">{typeInfo?.icon || '📁'}</span>
                        <span className="text-[10px] font-bold text-slate-600 uppercase">{typeInfo?.label || context.context_type}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[11px] font-mono">
                        {context.code}
                      </code>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <span className="font-bold text-sm text-slate-900">{context.display_name}</span>
                          {context.description && (
                            <p className="text-[10px] text-slate-500 mt-0.5">{context.description}</p>
                          )}
                        </div>
                        {context.theme_config && (
                          <div className="flex gap-1 flex-shrink-0">
                            <div 
                              className="w-3 h-3 rounded-full border border-slate-200 shadow-sm"
                              style={{ backgroundColor: context.theme_config.primary }}
                              title={`Primary: ${context.theme_config.primary}`}
                            />
                            <div 
                              className="w-3 h-3 rounded-full border border-slate-200 shadow-sm"
                              style={{ backgroundColor: context.theme_config.secondary }}
                              title={`Secondary: ${context.theme_config.secondary}`}
                            />
                            <div 
                              className="w-3 h-3 rounded-full border border-slate-200 shadow-sm"
                              style={{ backgroundColor: context.theme_config.accent }}
                              title={`Accent: ${context.theme_config.accent}`}
                            />
                          </div>
                        )}
                        {context.requires_patient && (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[8px] font-black uppercase rounded border border-purple-200 flex-shrink-0">
                            Pat
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs text-slate-600 flex items-center gap-1">
                        {context.organizations ? (
                          <>
                            <Building2 size={10} className="text-slate-400" />
                            <span className="truncate">{context.organizations.name}</span>
                          </>
                        ) : (
                          <span className="italic text-slate-400 text-[10px]">Alle</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleActive(context.id, context.is_active)}
                        className={`px-2 py-1 rounded text-[8px] font-black uppercase border transition-colors ${
                          context.is_active
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {context.is_active ? '✓' : '○'}
                      </button>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(context)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Bewerken"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(context.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Verwijderen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <WorkContextModal
          context={selectedContext}
          organizations={organizations}
          contextTypes={contextTypes}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchData}
        />
      )}
    </div>
  );
}

function WorkContextModal({ context, organizations, contextTypes, isOpen, onClose, onSave }: {
  context: WorkContext | null;
  organizations: Organization[];
  contextTypes: any[];
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    code: '',
    display_name: '',
    description: '',
    context_type: 'location',
    organization_id: '',
    is_active: true,
    display_order: 0,
    theme_config: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#60a5fa'
    },
    icon_name: '',
    requires_patient: false
  });
  const [saving, setSaving] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (context) {
      setFormData({
        code: context.code,
        display_name: context.display_name,
        description: context.description || '',
        context_type: context.context_type,
        organization_id: context.organization_id || '',
        is_active: context.is_active,
        display_order: context.display_order,
        theme_config: context.theme_config || {
          primary: '#3b82f6',
          secondary: '#1e40af',
          accent: '#60a5fa'
        },
        icon_name: context.icon_name || '',
        requires_patient: context.requires_patient || false
      });
    }
  }, [context]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = {
        display_name: formData.display_name,
        description: formData.description || null,
        context_type: formData.context_type,
        organization_id: formData.organization_id || null,
        is_active: formData.is_active,
        display_order: formData.display_order,
        theme_config: formData.theme_config,
        icon_name: formData.icon_name || null,
        requires_patient: formData.requires_patient,
        updated_at: new Date().toISOString()
      };

      if (context) {
        const { error } = await supabase
          .from('work_contexts')
          .update(dataToSave)
          .eq('id', context.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('work_contexts')
          .insert({
            ...dataToSave,
            code: formData.code.toUpperCase().replace(/\s+/g, '_')
          });
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error: any) {
      alert('Fout bij opslaan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const selectedType = contextTypes.find(t => t.value === formData.context_type);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <MapPin size={24} className="text-blue-600" />
              {context ? 'Werkcontext Bewerken' : 'Nieuwe Werkcontext'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                Code * {context && <span className="text-slate-300">(niet wijzigbaar)</span>}
              </label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-mono text-sm uppercase disabled:opacity-50"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                disabled={!!context}
                required={!context}
                placeholder="POLI_A"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                Type *
              </label>
              <select
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm appearance-none"
                value={formData.context_type}
                onChange={e => setFormData({ ...formData, context_type: e.target.value })}
                required
              >
                {contextTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedType && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700">
              <strong>{selectedType.label}:</strong> {selectedType.description}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
              Weergavenaam *
            </label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm"
              value={formData.display_name}
              onChange={e => setFormData({ ...formData, display_name: e.target.value })}
              required
              placeholder="Polikliniek A"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
              Beschrijving
            </label>
            <textarea
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-medium text-sm resize-none"
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optionele beschrijving..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                Organisatie (Optioneel)
              </label>
              <select
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm appearance-none"
                value={formData.organization_id}
                onChange={e => setFormData({ ...formData, organization_id: e.target.value })}
              >
                <option value="">Alle organisaties</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                Sorteervolgorde
              </label>
              <input
                type="number"
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm"
                value={formData.display_order}
                onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
              Thema Kleuren
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[8px] font-bold uppercase text-slate-500 ml-2">Primary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-200"
                    value={formData.theme_config.primary}
                    onChange={e => setFormData({ 
                      ...formData, 
                      theme_config: { ...formData.theme_config, primary: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-slate-50 rounded-lg border-none font-mono text-xs uppercase"
                    value={formData.theme_config.primary}
                    onChange={e => setFormData({ 
                      ...formData, 
                      theme_config: { ...formData.theme_config, primary: e.target.value }
                    })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-bold uppercase text-slate-500 ml-2">Secondary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-200"
                    value={formData.theme_config.secondary}
                    onChange={e => setFormData({ 
                      ...formData, 
                      theme_config: { ...formData.theme_config, secondary: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-slate-50 rounded-lg border-none font-mono text-xs uppercase"
                    value={formData.theme_config.secondary}
                    onChange={e => setFormData({ 
                      ...formData, 
                      theme_config: { ...formData.theme_config, secondary: e.target.value }
                    })}
                    placeholder="#1e40af"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-bold uppercase text-slate-500 ml-2">Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-200"
                    value={formData.theme_config.accent}
                    onChange={e => setFormData({ 
                      ...formData, 
                      theme_config: { ...formData.theme_config, accent: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-slate-50 rounded-lg border-none font-mono text-xs uppercase"
                    value={formData.theme_config.accent}
                    onChange={e => setFormData({ 
                      ...formData, 
                      theme_config: { ...formData.theme_config, accent: e.target.value }
                    })}
                    placeholder="#60a5fa"
                  />
                </div>
              </div>
            </div>
            {/* Theme Preview */}
            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
              <div className="text-[8px] font-black uppercase text-slate-400 mb-3">Voorbeeld Thema</div>
              <div className="flex gap-2">
                <div 
                  className="flex-1 h-16 rounded-xl border-2 flex items-center justify-center text-white font-bold text-xs shadow-lg"
                  style={{ 
                    backgroundColor: formData.theme_config.primary,
                    borderColor: formData.theme_config.secondary 
                  }}
                >
                  Primary
                </div>
                <div 
                  className="flex-1 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg"
                  style={{ backgroundColor: formData.theme_config.secondary }}
                >
                  Secondary
                </div>
                <div 
                  className="flex-1 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg"
                  style={{ backgroundColor: formData.theme_config.accent }}
                >
                  Accent
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                Icoon Naam (Lucide React)
              </label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-mono text-sm"
                value={formData.icon_name}
                onChange={e => setFormData({ ...formData, icon_name: e.target.value })}
                placeholder="Stethoscope"
              />
              <div className="text-[10px] text-slate-400 ml-4 mt-1">
                Bijv: Stethoscope, Hospital, Activity, Ambulance
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                Patiënt Vereist
              </label>
              <label className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={formData.requires_patient}
                  onChange={e => setFormData({ ...formData, requires_patient: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="font-bold text-sm text-slate-900">
                  {formData.requires_patient ? '✓ Ja, patiënt vereist' : '○ Nee'}
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
              Status
            </label>
            <label className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="font-bold text-sm text-slate-900">
                {formData.is_active ? '✓ Actief' : '○ Inactief'}
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? 'Opslaan...' : (
                <>
                  <CheckCircle size={16} />
                  {context ? 'Wijzigingen Opslaan' : 'Context Toevoegen'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

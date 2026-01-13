'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Users, Plus, Edit3, Trash2, CheckCircle, X, Building2 } from 'lucide-react';

interface Group {
  id: string;
  code: string;
  display_name: string;
  description: string | null;
  group_type: string;
  parent_group_id: string | null;
  organization_id: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  organizations?: { name: string };
  parent_group?: { display_name: string };
}

interface Organization {
  id: string;
  name: string;
  code: string;
}

export function GroupManager() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchData = async () => {
    setLoading(true);
    const [groupsRes, orgsRes] = await Promise.all([
      supabase
        .from('groups')
        .select('*, organizations(name), parent_group:groups!parent_group_id(display_name)')
        .order('display_order', { ascending: true }),
      supabase.from('organizations').select('id, name, code').order('name')
    ]);
    
    if (!groupsRes.error && groupsRes.data) {
      setGroups(groupsRes.data);
    }
    if (!orgsRes.error && orgsRes.data) {
      setOrganizations(orgsRes.data.map(org => ({
        id: org.id,
        name: org.name,
        code: org.code || '' // Provide default empty string if code is missing
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedGroup(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze groep wilt verwijderen?')) return;
    
    const { error } = await supabase.from('groups').delete().eq('id', id);
    if (!error) {
      await fetchData();
    } else {
      alert('Fout bij verwijderen: ' + error.message);
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('groups')
      .update({ is_active: !currentState })
      .eq('id', id);
    
    if (!error) {
      await fetchData();
    }
  };

  const groupTypes = [
    { value: 'team', label: 'Team', icon: '👥' },
    { value: 'dienst', label: 'Dienst', icon: '🌙' },
    { value: 'project', label: 'Project', icon: '🎯' },
    { value: 'commissie', label: 'Commissie', icon: '📋' },
    { value: 'afdeling', label: 'Afdeling', icon: '🏢' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Teams & Groepen
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Beheer teams, diensten, projecten en commissies
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg"
        >
          <Plus size={14} /> Nieuwe Groep
        </button>
      </div>

      {/* Type Filter Chips */}
      <div className="flex gap-2 px-4">
        {groupTypes.map(type => (
          <button
            key={type.value}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-orange-300 hover:bg-orange-50 transition-colors"
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Type</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Naam</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Organisatie</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Parent</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-black uppercase text-[10px]">
                  Groepen laden...
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-slate-400">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">Geen groepen gevonden</p>
                  <p className="text-sm mt-1">Klik op "Nieuwe Groep" om te beginnen</p>
                </td>
              </tr>
            ) : (
              groups.map((group) => {
                const typeInfo = groupTypes.find(t => t.value === group.group_type);
                return (
                  <tr key={group.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <span className="flex items-center gap-2">
                        <span>{typeInfo?.icon || '📁'}</span>
                        <span className="text-xs font-bold text-slate-600 uppercase">{typeInfo?.label || group.group_type}</span>
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <span className="font-bold text-slate-900">{group.display_name}</span>
                        <code className="ml-2 bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-xs font-mono">
                          {group.code}
                        </code>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        {group.organizations ? (
                          <>
                            <Building2 size={12} className="text-slate-400" />
                            {group.organizations.name}
                          </>
                        ) : (
                          <span className="italic text-slate-400">Alle organisaties</span>
                        )}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {group.parent_group ? (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          ↳ {group.parent_group.display_name}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Top-level</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button
                        onClick={() => toggleActive(group.id, group.is_active)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border transition-colors ${
                          group.is_active
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {group.is_active ? '✓ Actief' : '○ Inactief'}
                      </button>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(group)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Bewerken"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(group.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Verwijderen"
                        >
                          <Trash2 size={18} />
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
        <GroupModal
          group={selectedGroup}
          groups={groups}
          organizations={organizations}
          groupTypes={groupTypes}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchData}
        />
      )}
    </div>
  );
}

function GroupModal({ group, groups, organizations, groupTypes, isOpen, onClose, onSave }: {
  group: Group | null;
  groups: Group[];
  organizations: Organization[];
  groupTypes: any[];
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    code: '',
    display_name: '',
    description: '',
    group_type: 'team',
    parent_group_id: '',
    organization_id: '',
    is_active: true,
    display_order: 0
  });
  const [saving, setSaving] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (group) {
      setFormData({
        code: group.code,
        display_name: group.display_name,
        description: group.description || '',
        group_type: group.group_type,
        parent_group_id: group.parent_group_id || '',
        organization_id: group.organization_id || '',
        is_active: group.is_active,
        display_order: group.display_order
      });
    }
  }, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = {
        display_name: formData.display_name,
        description: formData.description || null,
        group_type: formData.group_type,
        parent_group_id: formData.parent_group_id || null,
        organization_id: formData.organization_id || null,
        is_active: formData.is_active,
        display_order: formData.display_order,
        updated_at: new Date().toISOString()
      };

      if (group) {
        const { error } = await supabase
          .from('groups')
          .update(dataToSave)
          .eq('id', group.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('groups')
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

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-orange-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Users size={24} className="text-orange-600" />
              {group ? 'Groep Bewerken' : 'Nieuwe Groep'}
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
                Code * {group && <span className="text-slate-300">(niet wijzigbaar)</span>}
              </label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-mono text-sm uppercase disabled:opacity-50"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                disabled={!!group}
                required={!group}
                placeholder="MDL_TEAM"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                Type *
              </label>
              <select
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm appearance-none"
                value={formData.group_type}
                onChange={e => setFormData({ ...formData, group_type: e.target.value })}
                required
              >
                {groupTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
              placeholder="MDL Behandelteam"
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
                Parent Groep (Optioneel)
              </label>
              <select
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm appearance-none"
                value={formData.parent_group_id}
                onChange={e => setFormData({ ...formData, parent_group_id: e.target.value })}
              >
                <option value="">Geen parent (top-level)</option>
                {groups.filter(g => g.id !== group?.id).map(g => (
                  <option key={g.id} value={g.id}>{g.display_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
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
              className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? 'Opslaan...' : (
                <>
                  <CheckCircle size={16} />
                  {group ? 'Wijzigingen Opslaan' : 'Groep Toevoegen'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

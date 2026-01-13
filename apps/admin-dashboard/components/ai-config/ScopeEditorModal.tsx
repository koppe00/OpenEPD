'use client';

import React, { useState, useEffect } from 'react';
import { X, Layers, Info } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

type ScopeType = 'user' | 'group' | 'role' | 'specialisme' | 'werkcontext' | 'organization' | 'global';

interface AIConfigScope {
  id?: string;
  scope_type: ScopeType;
  scope_value: string;
  scope_label: string;
  priority: number;
  metadata?: any;
}

interface ScopeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scope: AIConfigScope | null;
  onSave: (scope: AIConfigScope) => Promise<void>;
}

const PRIORITY_MAP: Record<ScopeType, number> = {
  user: 10,
  group: 20,
  role: 30,
  specialisme: 40,
  werkcontext: 50,
  organization: 60,
  global: 100
};

const SCOPE_TYPES = [
  { 
    value: 'specialisme' as ScopeType, 
    label: 'Specialisme', 
    priority: 40,
    description: 'Voor medische specialismen (bijv. Cardiologie, Psychiatrie)',
    examples: 'Cardiologie, Interne Geneeskunde, Psychiatrie'
  },
  { 
    value: 'werkcontext' as ScopeType, 
    label: 'Werkcontext', 
    priority: 50,
    description: 'Voor specifieke werklocaties of settings',
    examples: 'Polikliniek, SEH, Dagbehandeling'
  },
  { 
    value: 'role' as ScopeType, 
    label: 'Rol', 
    priority: 30,
    description: 'Voor functierollen',
    examples: 'physician, nurse, admin'
  },
  { 
    value: 'user' as ScopeType, 
    label: 'Gebruiker', 
    priority: 10,
    description: 'Voor individuele gebruikers (hoogste prioriteit)',
    examples: 'user-uuid'
  },
  { 
    value: 'group' as ScopeType, 
    label: 'Groep', 
    priority: 20,
    description: 'Voor teams of afdelingen',
    examples: 'group-uuid'
  },
  { 
    value: 'organization' as ScopeType, 
    label: 'Organisatie', 
    priority: 60,
    description: 'Voor ziekenhuis of organisatie niveau',
    examples: 'org-uuid'
  },
  { 
    value: 'global' as ScopeType, 
    label: 'Globaal', 
    priority: 100,
    description: 'Standaard voor iedereen (laagste prioriteit)',
    examples: 'global, default'
  }
];

export function ScopeEditorModal({ isOpen, onClose, scope, onSave }: ScopeEditorModalProps) {
  const [formData, setFormData] = useState<AIConfigScope>({
    scope_type: 'specialisme',
    scope_value: '',
    scope_label: '',
    priority: 40,
    metadata: {}
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available options for dropdowns
  const [specialisms, setSpecialisms] = useState<Array<{ id: string; code: string; display_name: string }>>([]);
  const [groups, setGroups] = useState<Array<{ id: string; code: string; display_name: string }>>([]);
  const [workContexts, setWorkContexts] = useState<Array<{ id: string; code: string; display_name: string }>>([]);
  const [organizations, setOrganizations] = useState<Array<{ id: string; name: string }>>([]);
  const [roles, setRoles] = useState<Array<{ id: string; role_key: string; display_name: string }>>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Fetch dropdown options
    const fetchOptions = async () => {
      const [specsRes, groupsRes, wcsRes, orgsRes, rolesRes] = await Promise.all([
        supabase.from('specialisms').select('id, code, display_name').eq('is_active', true).order('display_order'),
        supabase.from('groups').select('id, code, display_name').eq('is_active', true).order('display_order'),
        supabase.from('work_contexts').select('id, code, display_name').eq('is_active', true).order('display_order'),
        supabase.from('organizations').select('id, name').order('name'),
        supabase.from('roles').select('id, role_key, display_name').order('display_name')
      ]);

      if (!specsRes.error && specsRes.data) setSpecialisms(specsRes.data);
      if (!groupsRes.error && groupsRes.data) setGroups(groupsRes.data);
      if (!wcsRes.error && wcsRes.data) setWorkContexts(wcsRes.data);
      if (!orgsRes.error && orgsRes.data) setOrganizations(orgsRes.data);
      if (!rolesRes.error && rolesRes.data) setRoles(rolesRes.data);
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scope) {
      setFormData(scope);
    } else {
      setFormData({
        scope_type: 'specialisme',
        scope_value: '',
        scope_label: '',
        priority: 40,
        metadata: {}
      });
    }
  }, [scope, isOpen]);

  const handleScopeTypeChange = (type: ScopeType) => {
    setFormData({
      ...formData,
      scope_type: type,
      priority: PRIORITY_MAP[type]
    });
  };

  const handleSave = async () => {
    if (!formData.scope_value || !formData.scope_label) {
      setError('Waarde en Label zijn verplicht');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const selectedType = SCOPE_TYPES.find(t => t.value === formData.scope_type);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {scope ? 'Scope Bewerken' : 'Nieuwe Scope'}
            </h2>
            <p className="text-sm text-slate-500">Definieer een configuratie scope - geen technische kennis nodig!</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Scope Type */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <label className="block text-sm font-bold text-purple-900 mb-3">
              1️⃣ Kies Type Scope
            </label>
            <select
              value={formData.scope_type}
              onChange={(e) => handleScopeTypeChange(e.target.value as ScopeType)}
              disabled={!!scope?.id}
              className={`w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base font-semibold disabled:bg-slate-100 disabled:cursor-not-allowed`}
            >
              {SCOPE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} (Prioriteit {type.priority})
                </option>
              ))}
            </select>
            
            {selectedType && (
              <div className="mt-3 p-3 bg-purple-100 rounded-lg">
                <p className="text-sm text-purple-900 font-semibold mb-1">
                  <Layers size={14} className="inline mr-1" />
                  {selectedType.description}
                </p>
                <p className="text-xs text-purple-700">
                  <strong>Voorbeelden:</strong> {selectedType.examples}
                </p>
              </div>
            )}
          </div>

          {/* Scope Value (Dropdown or Input based on type) */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <label className="block text-sm font-bold text-green-900 mb-2">
              3️⃣ {formData.scope_type === 'specialisme' || formData.scope_type === 'group' || formData.scope_type === 'werkcontext' || formData.scope_type === 'organization' || formData.scope_type === 'role' ? 'Selecteer' : 'Waarde (Technische ID)'} *
            </label>
            
            {/* Specialisme Dropdown */}
            {formData.scope_type === 'specialisme' && (
              <select
                value={formData.scope_value}
                onChange={(e) => {
                  const selected = specialisms.find(s => s.id === e.target.value);
                  setFormData({ 
                    ...formData, 
                    scope_value: e.target.value,
                    scope_label: selected?.display_name || ''
                  });
                }}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-semibold"
              >
                <option value="">-- Kies een specialisme --</option>
                {specialisms.map(spec => (
                  <option key={spec.id} value={spec.id}>{spec.display_name}</option>
                ))}
              </select>
            )}

            {/* Group Dropdown */}
            {formData.scope_type === 'group' && (
              <select
                value={formData.scope_value}
                onChange={(e) => {
                  const selected = groups.find(g => g.id === e.target.value);
                  setFormData({ 
                    ...formData, 
                    scope_value: e.target.value,
                    scope_label: selected?.display_name || ''
                  });
                }}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-semibold"
              >
                <option value="">-- Kies een groep --</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.display_name}</option>
                ))}
              </select>
            )}

            {/* Werkcontext Dropdown */}
            {formData.scope_type === 'werkcontext' && (
              <select
                value={formData.scope_value}
                onChange={(e) => {
                  const selected = workContexts.find(wc => wc.id === e.target.value);
                  setFormData({ 
                    ...formData, 
                    scope_value: e.target.value,
                    scope_label: selected?.display_name || ''
                  });
                }}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-semibold"
              >
                <option value="">-- Kies een werkcontext --</option>
                {workContexts.map(wc => (
                  <option key={wc.id} value={wc.id}>{wc.display_name}</option>
                ))}
              </select>
            )}

            {/* Organization Dropdown */}
            {formData.scope_type === 'organization' && (
              <select
                value={formData.scope_value}
                onChange={(e) => {
                  const selected = organizations.find(o => o.id === e.target.value);
                  setFormData({ 
                    ...formData, 
                    scope_value: e.target.value,
                    scope_label: selected?.name || ''
                  });
                }}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-semibold"
              >
                <option value="">-- Kies een organisatie --</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            )}

            {/* Role Dropdown */}
            {formData.scope_type === 'role' && (
              <select
                value={formData.scope_value}
                onChange={(e) => {
                  const selected = roles.find(r => r.id === e.target.value);
                  setFormData({ 
                    ...formData, 
                    scope_value: e.target.value,
                    scope_label: selected?.display_name || ''
                  });
                }}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-semibold"
              >
                <option value="">-- Kies een rol --</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.display_name}</option>
                ))}
              </select>
            )}

            {/* Free text for user/global */}
            {(formData.scope_type === 'user' || formData.scope_type === 'global') && (
              <input
                type="text"
                value={formData.scope_value}
                onChange={(e) => setFormData({ ...formData, scope_value: e.target.value })}
                placeholder={
                  formData.scope_type === 'user' ? 'user-uuid' :
                  'global'
                }
                className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-mono"
              />
            )}
            
            <p className="text-xs text-green-700 mt-2">
              {formData.scope_type === 'specialisme' || formData.scope_type === 'group' || formData.scope_type === 'werkcontext' || formData.scope_type === 'organization' || formData.scope_type === 'role'
                ? 'Selecteer uit de lijst - het label wordt automatisch ingevuld'
                : formData.scope_type === 'user'
                ? 'Gebruik de UUID van de gebruiker'
                : 'Technische identifier die in het systeem gebruikt wordt'
              }
            </p>
          </div>

          {/* Scope Label - Auto-filled for dropdowns, editable for others */}
          {(formData.scope_type === 'user' || formData.scope_type === 'global') && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <label className="block text-sm font-bold text-blue-900 mb-2">
                2️⃣ Label (Weergavenaam) *
              </label>
              <input
                type="text"
                value={formData.scope_label}
                onChange={(e) => setFormData({ ...formData, scope_label: e.target.value })}
                placeholder="Vriendelijke naam"
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-semibold"
              />
              <p className="text-xs text-blue-700 mt-2">
                Dit is de naam die je ziet in de interface
              </p>
            </div>
          )}

          {/* Priority Display */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                  Prioriteit
                </label>
                <p className="text-xs text-slate-600">
                  Automatisch ingesteld op basis van type
                </p>
              </div>
              <div className="text-3xl font-black text-slate-900">
                {formData.priority}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">💡 Hoe werkt prioriteit?</p>
              <p className="mb-2">Lagere nummers = hogere voorrang:</p>
              <ul className="text-xs space-y-1 ml-4">
                <li>• Gebruiker (10) - Hoogste prioriteit</li>
                <li>• Specialisme (40) - Meest gebruikt voor configuratie</li>
                <li>• Global (100) - Standaard fallback</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Annuleren
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !formData.scope_value || !formData.scope_label}
            className="px-6 py-3 text-sm font-semibold bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Opslaan...' : '✅ Opslaan'}
          </button>
        </div>
      </div>
    </div>
  );
}

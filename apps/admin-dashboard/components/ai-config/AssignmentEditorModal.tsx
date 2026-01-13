'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Square } from 'lucide-react';

interface AIConfigAssignment {
  id?: string;
  feature_id: string;
  scope_id: string;
  config: any;
  override_mode?: 'merge' | 'replace';
  is_active?: boolean;
}

interface AssignmentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: AIConfigAssignment | null;
  features: any[];
  scopes: any[];
  onSave: (assignment: AIConfigAssignment) => Promise<void>;
}

// Voorgedefinieerde ZIB categorieën met checkboxes
const ZIB_CATEGORIES = {
  'Vitale Parameters': [
    { id: 'nl.zorg.Bloeddruk', label: 'Bloeddruk' },
    { id: 'nl.zorg.Hartfrequentie', label: 'Hartfrequentie' },
    { id: 'nl.zorg.O2Saturatie', label: 'O2 Saturatie' },
    { id: 'nl.zorg.Lichaamstemperatuur', label: 'Lichaamstemperatuur' },
    { id: 'nl.zorg.Lichaamsgewicht', label: 'Lichaamsgewicht' },
    { id: 'nl.zorg.Lichaamslengte', label: 'Lichaamslengte' },
    { id: 'nl.zorg.Ademhaling', label: 'Ademhalingsfrequentie' },
  ],
  'Consultatie': [
    { id: 'nl.zorg.Anamnese', label: 'Anamnese' },
    { id: 'nl.zorg.LichamelijkOnderzoek', label: 'Lichamelijk Onderzoek' },
    { id: 'nl.zorg.Evaluatie', label: 'Evaluatie/Conclusie' },
    { id: 'nl.zorg.Beleid', label: 'Beleid/Behandelplan' },
    { id: 'nl.zorg.PoliklinischConsult', label: 'Poliklinisch Consult (volledig)' },
  ],
  'Klinische Data': [
    { id: 'nl.zorg.AandoeningOfGesteldheid', label: 'Aandoening/Gesteldheid' },
    { id: 'nl.zorg.Diagnose', label: 'Diagnose' },
    { id: 'nl.zorg.Medicatieafspraak', label: 'Medicatie' },
    { id: 'nl.zorg.OvergevoeligheidIntolerantie', label: 'Allergieën/Intolerantie' },
    { id: 'nl.zorg.TabakGebruik', label: 'Tabak Gebruik' },
    { id: 'nl.zorg.LaboratoriumUitslag', label: 'Laboratorium Uitslagen' },
  ],
  'Cardiologie Specifiek': [
    { id: 'nl.zorg.ECG', label: 'ECG' },
    { id: 'nl.zorg.Hartritme', label: 'Hartritme' },
  ],
  'Administratief': [
    { id: 'nl.zorg.DBCDeclaratie', label: 'DBC Declaratie' },
  ]
};

export function AssignmentEditorModal({ isOpen, onClose, assignment, features, scopes, onSave }: AssignmentEditorModalProps) {
  const [formData, setFormData] = useState<AIConfigAssignment>({
    feature_id: '',
    scope_id: '',
    config: {},
    override_mode: 'merge',
    is_active: true
  });

  // Helper functie om te detecteren of een feature ZIB extraction ondersteunt
  const supportsZibExtraction = (featureId: string): boolean => {
    const feature = features.find(f => f.feature_id === featureId);
    if (!feature) return false;
    
    // Check of config_schema enabled_zibs bevat
    const schema = feature.config_schema;
    return schema?.properties?.enabled_zibs !== undefined;
  };

  const [selectedZibs, setSelectedZibs] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assignment) {
      setFormData(assignment);
      const zibs = assignment.config?.enabled_zibs || [];
      setSelectedZibs(zibs);
      setCustomPrompt(assignment.config?.custom_prompt || '');
    } else {
      setFormData({
        feature_id: '',
        scope_id: '',
        config: {},
        override_mode: 'merge',
        is_active: true
      });
      setSelectedZibs([]);
      setCustomPrompt('');
    }
  }, [assignment, isOpen]);

  const toggleZib = (zibId: string) => {
    setSelectedZibs(prev => 
      prev.includes(zibId) 
        ? prev.filter(id => id !== zibId)
        : [...prev, zibId]
    );
  };

  const toggleCategory = (category: string) => {
    const categoryZibs = ZIB_CATEGORIES[category as keyof typeof ZIB_CATEGORIES].map(z => z.id);
    const allSelected = categoryZibs.every(id => selectedZibs.includes(id));
    
    if (allSelected) {
      setSelectedZibs(prev => prev.filter(id => !categoryZibs.includes(id)));
    } else {
      setSelectedZibs(prev => Array.from(new Set([...prev, ...categoryZibs])));
    }
  };

  const handleSave = async () => {
    if (!formData.feature_id || !formData.scope_id) {
      setError('Feature en Scope zijn verplicht');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const config: any = {};
      
      // Als de feature ZIB extraction ondersteunt, sla de ZIB config op
      if (supportsZibExtraction(formData.feature_id)) {
        config.enabled_zibs = selectedZibs;
        if (customPrompt.trim()) {
          config.custom_prompt = customPrompt.trim();
        }
      }

      await onSave({
        ...formData,
        config
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {assignment ? 'Configuratie Bewerken' : 'Nieuwe Configuratie'}
            </h2>
            <p className="text-sm text-slate-500">Selecteer ZIBs met checkboxes - geen code nodig!</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Feature Selection */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <label className="block text-sm font-bold text-blue-900 mb-2">
              1️⃣ Kies AI Feature
            </label>
            <select
              value={formData.feature_id}
              onChange={(e) => setFormData({ ...formData, feature_id: e.target.value })}
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-semibold"
            >
              <option value="">-- Selecteer een feature --</option>
              {features.map((feature) => (
                <option key={feature.feature_id} value={feature.feature_id}>
                  {feature.name} ({feature.category})
                </option>
              ))}
            </select>
          </div>

          {/* Scope Selection */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <label className="block text-sm font-bold text-purple-900 mb-2">
              2️⃣ Kies Scope (Waar geldt deze configuratie?)
            </label>
            <select
              value={formData.scope_id}
              onChange={(e) => setFormData({ ...formData, scope_id: e.target.value })}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base font-semibold"
            >
              <option value="">-- Selecteer een scope --</option>
              {scopes.map((scope) => (
                <option key={scope.id} value={scope.id}>
                  {scope.scope_label} ({scope.scope_type})
                </option>
              ))}
            </select>
          </div>

          {/* ZIB Selection */}
          {supportsZibExtraction(formData.feature_id) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-bold text-green-900">
                    3️⃣ Selecteer ZIBs (checkboxes)
                  </label>
                  <p className="text-xs text-green-700 mt-1">
                    {selectedZibs.length} ZIBs geselecteerd
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(ZIB_CATEGORIES).map(([category, zibs]) => {
                  const allSelected = zibs.every(z => selectedZibs.includes(z.id));
                  const someSelected = zibs.some(z => selectedZibs.includes(z.id));
                  
                  return (
                    <div key={category} className="bg-white rounded-lg border border-green-200 overflow-hidden">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full px-4 py-3 bg-green-100 hover:bg-green-200 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {allSelected ? (
                            <CheckSquare size={20} className="text-green-700" />
                          ) : someSelected ? (
                            <div className="w-5 h-5 border-2 border-green-700 rounded flex items-center justify-center">
                              <div className="w-3 h-3 bg-green-700 rounded-sm" />
                            </div>
                          ) : (
                            <Square size={20} className="text-green-700" />
                          )}
                          <span className="font-bold text-green-900">{category}</span>
                        </div>
                        <span className="text-xs text-green-700">
                          {zibs.filter(z => selectedZibs.includes(z.id)).length}/{zibs.length}
                        </span>
                      </button>

                      <div className="p-3 space-y-2">
                        {zibs.map((zib) => (
                          <label
                            key={zib.id}
                            className="flex items-center gap-3 p-2 hover:bg-green-50 rounded cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedZibs.includes(zib.id)}
                              onChange={() => toggleZib(zib.id)}
                              className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-slate-700">{zib.label}</span>
                            <code className="text-xs text-slate-500 ml-auto">{zib.id}</code>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Prompt */}
              <div className="mt-4">
                <label className="block text-sm font-bold text-green-900 mb-2">
                  Custom AI Instructies (optioneel)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Bijvoorbeeld: Focus extra op cardiovasculaire symptomen..."
                  className="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Override Mode */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <label className="block text-sm font-bold text-orange-900 mb-3">
              4️⃣ Hoe moet deze configuratie worden toegepast?
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 bg-white border-2 border-orange-200 rounded-lg cursor-pointer hover:border-orange-400 transition-colors">
                <input
                  type="radio"
                  name="override_mode"
                  value="merge"
                  checked={formData.override_mode === 'merge'}
                  onChange={(e) => setFormData({ ...formData, override_mode: e.target.value as 'merge' })}
                  className="mt-1 w-5 h-5 text-orange-600"
                />
                <div>
                  <p className="font-bold text-slate-900">Samenvoegen (Merge)</p>
                  <p className="text-sm text-slate-600">Voeg deze ZIBs toe aan de standaard set</p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 p-3 bg-white border-2 border-orange-200 rounded-lg cursor-pointer hover:border-orange-400 transition-colors">
                <input
                  type="radio"
                  name="override_mode"
                  value="replace"
                  checked={formData.override_mode === 'replace'}
                  onChange={(e) => setFormData({ ...formData, override_mode: e.target.value as 'replace' })}
                  className="mt-1 w-5 h-5 text-orange-600"
                />
                <div>
                  <p className="font-bold text-slate-900">Vervangen (Replace)</p>
                  <p className="text-sm text-slate-600">Gebruik alleen deze ZIBs</p>
                </div>
              </label>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="font-semibold text-slate-900">
              Configuratie is actief
            </label>
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
            disabled={saving || !formData.feature_id || !formData.scope_id}
            className="px-6 py-3 text-sm font-semibold bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Opslaan...' : '✅ Opslaan'}
          </button>
        </div>
      </div>
    </div>
  );
}

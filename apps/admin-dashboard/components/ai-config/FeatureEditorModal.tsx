'use client';

import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

interface AIFeature {
  id?: string;
  feature_id: string;
  name: string;
  description: string;
  category: string;
  is_active?: boolean;
  is_beta?: boolean;
  config_schema?: any;
  default_config?: any;
}

interface FeatureEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: AIFeature | null;
  onSave: (feature: AIFeature) => Promise<void>;
}

const CATEGORIES = [
  { value: 'Clinical', label: 'Clinical (Klinische AI features)' },
  { value: 'Administrative', label: 'Administrative (Administratief)' },
  { value: 'Analytics', label: 'Analytics (Analyse & Rapportage)' },
  { value: 'Support', label: 'Support (Ondersteuning)' }
];

export function FeatureEditorModal({ isOpen, onClose, feature, onSave }: FeatureEditorModalProps) {
  const [formData, setFormData] = useState<AIFeature>({
    feature_id: '',
    name: '',
    description: '',
    category: 'Clinical',
    is_active: true,
    is_beta: false
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (feature) {
      setFormData(feature);
    } else {
      setFormData({
        feature_id: '',
        name: '',
        description: '',
        category: 'Clinical',
        is_active: true,
        is_beta: false
      });
    }
  }, [feature, isOpen]);

  const handleSave = async () => {
    if (!formData.feature_id || !formData.name) {
      setError('Feature ID en Naam zijn verplicht');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Voeg automatisch standaard config_schema en default_config toe als deze niet bestaan
      const featureToSave = {
        ...formData,
        config_schema: formData.config_schema || {
          type: 'object',
          properties: {
            enabled_zibs: { type: 'array', items: { type: 'string' } },
            custom_prompt: { type: 'string' },
            model: { type: 'string' }
          },
          required: ['enabled_zibs']
        },
        default_config: formData.default_config || {
          enabled_zibs: [],
          model: 'gemini-2.5-flash',
          temperature: 0.3
        }
      };
      
      await onSave(featureToSave);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!feature?.id;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {isEditing ? 'Feature Bewerken' : 'Nieuwe AI Feature'}
            </h2>
            <p className="text-sm text-slate-500">Configureer een AI functionaliteit</p>
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

          {/* Feature ID */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <label className="block text-sm font-bold text-blue-900 mb-2">
              Feature ID *
            </label>
            <input
              type="text"
              value={formData.feature_id}
              onChange={(e) => setFormData({ ...formData, feature_id: e.target.value })}
              disabled={isEditing}
              placeholder="bijv: zib_extraction, clinical_summarization"
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed text-base font-semibold"
            />
            <p className="text-xs text-blue-700 mt-2">
              Unieke identifier (alleen kleine letters, cijfers en underscores)
            </p>
          </div>

          {/* Name */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <label className="block text-sm font-bold text-purple-900 mb-2">
              Feature Naam *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="bijv: ZIB Extraction, Clinical Summarization"
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base font-semibold"
            />
            <p className="text-xs text-purple-700 mt-2">
              Leesbare naam die in de interface getoond wordt
            </p>
          </div>

          {/* Description */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <label className="block text-sm font-bold text-green-900 mb-2">
              Beschrijving
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Beschrijf wat deze feature doet en wanneer deze gebruikt wordt..."
              className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <label className="block text-sm font-bold text-orange-900 mb-2">
              Categorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base font-semibold"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Toggles */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <label htmlFor="is_active" className="flex-1">
                <div className="font-bold text-slate-900">Feature is Actief</div>
                <p className="text-xs text-slate-600">Schakel uit om deze feature te deactiveren voor alle gebruikers</p>
              </label>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                type="checkbox"
                id="is_beta"
                checked={formData.is_beta}
                onChange={(e) => setFormData({ ...formData, is_beta: e.target.checked })}
                className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
              />
              <label htmlFor="is_beta" className="flex-1">
                <div className="font-bold text-slate-900">Beta Feature</div>
                <p className="text-xs text-slate-600">Markeer als beta om te tonen dat deze feature in ontwikkeling is</p>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">✅ Automatisch ingesteld:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>config_schema:</strong> Validatie schema voor ZIB configuraties</li>
                <li>• <strong>default_config:</strong> Standaard instellingen (lege ZIB lijst, Gemini model)</li>
                <li>• Je configureert de daadwerkelijke ZIB's later bij "Configuraties"</li>
              </ul>
              <p className="mt-2 text-xs italic">
                Dit zorgt ervoor dat de feature direct bruikbaar is zonder technische kennis!
              </p>
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
            disabled={saving || !formData.feature_id || !formData.name}
            className="px-6 py-3 text-sm font-semibold bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Opslaan...' : '✅ Opslaan'}
          </button>
        </div>
      </div>
    </div>
  );
}

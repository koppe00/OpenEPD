'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Stethoscope, Plus, Edit3, Trash2, CheckCircle, X } from 'lucide-react';

interface Specialism {
  id: string;
  code: string;
  display_name: string;
  agb_code?: string | null;
  dhd_code?: string | null;
  nictiz_code?: string | null;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export function SpecialismManager() {
  const [specialisms, setSpecialisms] = useState<Specialism[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecialism, setSelectedSpecialism] = useState<Specialism | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchSpecialisms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('specialisms')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (!error && data) {
      setSpecialisms(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpecialisms();
  }, []);

  const handleEdit = (specialism: Specialism) => {
    setSelectedSpecialism(specialism);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSpecialism(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit specialisme wilt verwijderen?')) return;
    
    const { error } = await supabase.from('specialisms').delete().eq('id', id);
    if (!error) {
      await fetchSpecialisms();
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('specialisms')
      .update({ is_active: !currentState })
      .eq('id', id);
    
    if (!error) {
      await fetchSpecialisms();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Medische Specialismen
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Beheer de lijst van specialismen die toegewezen kunnen worden aan gebruikers
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg"
        >
          <Plus size={14} /> Nieuw Specialisme
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Code</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Naam</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">AGB</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">DHD</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Nictiz</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Beschrijving</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Volgorde</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-8 py-20 text-center text-slate-400 font-black uppercase text-[10px]">
                  Specialismen laden...
                </td>
              </tr>
            ) : specialisms.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-8 py-20 text-center text-slate-400">
                  <Stethoscope size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">Geen specialismen gevonden</p>
                  <p className="text-sm mt-1">Klik op "Nieuw Specialisme" om te beginnen</p>
                </td>
              </tr>
            ) : (
              specialisms.map((specialism) => (
                <tr key={specialism.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <code className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-mono font-bold">
                      {specialism.code}
                    </code>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-900">{specialism.display_name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono">
                      {specialism.agb_code || '-'}
                    </code>
                  </td>
                  <td className="px-8 py-5">
                    <code className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-mono">
                      {specialism.dhd_code || '-'}
                    </code>
                  </td>
                  <td className="px-8 py-5">
                    <code className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-mono">
                      {specialism.nictiz_code || '-'}
                    </code>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-slate-600">
                      {specialism.description || <span className="italic text-slate-400">Geen beschrijving</span>}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button
                      onClick={() => toggleActive(specialism.id, specialism.is_active)}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border transition-colors ${
                        specialism.is_active
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {specialism.is_active ? '✓ Actief' : '○ Inactief'}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-mono text-slate-600">{specialism.display_order}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(specialism)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Bewerken"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(specialism.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Verwijderen"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SpecialismModal
          specialism={selectedSpecialism}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchSpecialisms}
        />
      )}
    </div>
  );
}

function SpecialismModal({ specialism, isOpen, onClose, onSave }: {
  specialism: Specialism | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    code: '',
    display_name: '',
    agb_code: '',
    dhd_code: '',
    nictiz_code: '',
    description: '',
    is_active: true,
    display_order: 0
  });
  const [saving, setSaving] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (specialism) {
      setFormData({
        code: specialism.code,
        display_name: specialism.display_name,
        agb_code: specialism.agb_code || '',
        dhd_code: specialism.dhd_code || '',
        nictiz_code: specialism.nictiz_code || '',
        description: specialism.description || '',
        is_active: specialism.is_active,
        display_order: specialism.display_order
      });
    } else {
      setFormData({
        code: '',
        display_name: '',
        agb_code: '',
        dhd_code: '',
        nictiz_code: '',
        description: '',
        is_active: true,
        display_order: 0
      });
    }
  }, [specialism]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (specialism) {
        // Update
        const { error } = await supabase
          .from('specialisms')
          .update({
            display_name: formData.display_name,
            agb_code: formData.agb_code || null,
            dhd_code: formData.dhd_code || null,
            nictiz_code: formData.nictiz_code || null,
            description: formData.description || null,
            is_active: formData.is_active,
            display_order: formData.display_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', specialism.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('specialisms')
          .insert({
            code: formData.code.toUpperCase().replace(/\s+/g, '_'),
            display_name: formData.display_name,
            agb_code: formData.agb_code || null,
            dhd_code: formData.dhd_code || null,
            nictiz_code: formData.nictiz_code || null,
            description: formData.description || null,
            is_active: formData.is_active,
            display_order: formData.display_order
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
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-purple-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Stethoscope size={24} className="text-purple-600" />
              {specialism ? 'Specialisme Bewerken' : 'Nieuw Specialisme'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Medisch specialisme beheren
            </p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                Code * {specialism && <span className="text-slate-300">(niet wijzigbaar)</span>}
              </label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-mono text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                disabled={!!specialism}
                required={!specialism}
                placeholder="CARDIO"
              />
              {!specialism && (
                <p className="text-xs text-slate-500 ml-4 mt-1">
                  Gebruik hoofdletters en underscores (bijv. INTERNE_GENEESKUNDE)
                </p>
              )}
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
                placeholder="Cardiologie"
              />
            </div>
          </div>

          {/* Officiële Codes */}
          <div>
            <h4 className="text-[9px] font-black uppercase text-slate-400 ml-4 mb-3">
              Officiële NL Zorgcodes
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-blue-600 ml-4">
                  AGB Code (Vektis)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-blue-50 rounded-xl border border-blue-100 font-mono text-sm"
                  value={formData.agb_code}
                  onChange={e => setFormData({ ...formData, agb_code: e.target.value })}
                  placeholder="0320"
                  maxLength={10}
                />
                <p className="text-[10px] text-blue-600 ml-4">Voor facturatie/identificatie</p>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-emerald-600 ml-4">
                  DHD Code
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100 font-mono text-sm"
                  value={formData.dhd_code}
                  onChange={e => setFormData({ ...formData, dhd_code: e.target.value })}
                  placeholder="03"
                  maxLength={10}
                />
                <p className="text-[10px] text-emerald-600 ml-4">Voor ziekenhuisregistratie/DBC</p>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-orange-600 ml-4">
                  Nictiz Code
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-orange-50 rounded-xl border border-orange-100 font-mono text-sm"
                  value={formData.nictiz_code}
                  onChange={e => setFormData({ ...formData, nictiz_code: e.target.value })}
                  placeholder="0320"
                  maxLength={10}
                />
                <p className="text-[10px] text-orange-600 ml-4">Voor ZIB uitwisseling</p>
              </div>
            </div>
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
              placeholder="Optionele beschrijving van dit specialisme..."
            />
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
              <p className="text-xs text-slate-500 ml-4 mt-1">
                Lagere nummers verschijnen eerst in lijsten
              </p>
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

          {/* Actions */}
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
              className="flex-1 bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>Opslaan...</>
              ) : (
                <>
                  <CheckCircle size={16} />
                  {specialism ? 'Wijzigingen Opslaan' : 'Specialisme Toevoegen'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

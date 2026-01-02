'use client';

import React, { useState } from 'react';
import { XCircle, ShieldPlus, Info } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function RoleModal({ isOpen, onClose, onSave }: RoleModalProps) {
  const [formData, setFormData] = useState({
    role_key: '',
    display_name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('roles').insert([
      { 
        ...formData, 
        role_key: formData.role_key.toLowerCase().replace(/\s+/g, '_'),
        is_system_role: false 
      }
    ]);

    if (!error) {
      onSave();
      onClose();
      setFormData({ role_key: '', display_name: '', description: '' });
    } else {
      alert("Fout bij aanmaken rol: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <form className="p-10" onSubmit={handleSubmit}>
          <header className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Nieuwe Systeemrol</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Definieer een nieuwe bevoegdheidsgroep</p>
            </div>
            <button type="button" onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
              <XCircle size={24} />
            </button>
          </header>

          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Weergavenaam (bijv. Apotheker)</label>
              <input 
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold" 
                value={formData.display_name} 
                onChange={e => setFormData({...formData, display_name: e.target.value})} 
                placeholder="Bijv. Physician Assistant"
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Systeem-ID (automatisch gegenereerd)</label>
              <input 
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-mono text-xs text-slate-400" 
                value={formData.display_name.toLowerCase().replace(/\s+/g, '_')} 
                disabled 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Beschrijving</label>
              <textarea 
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-medium text-sm min-h-[100px]" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Wat is het doel van deze rol?"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <Info className="text-blue-600 shrink-0" size={18} />
              <p className="text-[10px] text-blue-700 leading-relaxed font-bold italic">
                Nieuwe rollen verschijnen direct in de Rechten Matrix. Vergeet niet daar de lees- en schrijfrechten in te stellen na het aanmaken.
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-10 bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
             <ShieldPlus size={18} /> {loading ? 'Rol vastleggen...' : 'Rol Toevoegen'}
          </button>
        </form>
      </div>
    </div>
  );
}
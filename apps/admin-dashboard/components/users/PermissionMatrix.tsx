'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Shield, Lock, Unlock, Save, RotateCcw, Check, AlertCircle } from 'lucide-react';

export function PermissionMatrix() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchPermissions = async () => {
    setLoading(true);
    const { data } = await supabase.from('admin_permissions').select('*').order('module_key');
    setPermissions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPermissions(); }, []);

  const handleToggle = (id: string, field: 'can_read' | 'can_write') => {
    setPermissions(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: !p[field] } : p
    ));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('admin_permissions').upsert(permissions);
    
    if (!error) {
      // NEN 7513 Logging
      await supabase.from('nen7513_logs').insert({
        action: "Autorisatiematrix bijgewerkt door beheerder",
        timestamp: new Date().toISOString()
      });
      setHasChanges(false);
      alert("Rechten succesvol opgeslagen.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center font-black uppercase text-slate-400 animate-pulse">Rechtenstructuur laden...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              <th className="px-10 py-6 text-blue-600 font-black italic">Module / Systeemdeel</th>
              <th className="px-10 py-6">Gebruikersrol</th>
              <th className="px-10 py-6 text-center">Lezen (R)</th>
              <th className="px-10 py-6 text-center">Schrijven (W)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {permissions.map((perm) => (
              <tr key={perm.id} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-10 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">
                      <Shield size={16} className="text-slate-400" />
                    </div>
                    <span className="font-bold text-slate-800">{perm.module_key}</span>
                  </div>
                </td>
                <td className="px-10 py-5">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase border border-slate-200">
                    {perm.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-10 py-5 text-center">
                  <PermissionSwitch 
                    active={perm.can_read} 
                    onClick={() => handleToggle(perm.id, 'can_read')} 
                    color="blue" 
                  />
                </td>
                <td className="px-10 py-5 text-center">
                  <PermissionSwitch 
                    active={perm.can_write} 
                    onClick={() => handleToggle(perm.id, 'can_write')} 
                    color="emerald" 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actiebalk onderaan */}
      {hasChanges && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-12 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-3 border-r border-slate-700 pr-10">
            <AlertCircle className="text-amber-400" size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Onopgeslagen wijzigingen</p>
          </div>
          <div className="flex gap-4">
            <button onClick={fetchPermissions} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              Herstellen
            </button>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-blue-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2"
            >
              {saving ? 'Bezig...' : <><Save size={14} /> Matrix Opslaan</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PermissionSwitch({ active, onClick, color }: { active: boolean, onClick: () => void, color: 'blue' | 'emerald' }) {
  const activeColor = color === 'blue' ? 'bg-blue-600 shadow-blue-600/30' : 'bg-emerald-600 shadow-emerald-600/30';
  return (
    <button 
      onClick={onClick}
      className={`w-14 h-7 rounded-full transition-all relative ${active ? `${activeColor} shadow-lg` : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm flex items-center justify-center ${active ? 'left-8' : 'left-1'}`}>
        {active ? <Check size={10} className={color === 'blue' ? 'text-blue-600' : 'text-emerald-600'} /> : <Lock size={10} className="text-slate-300" />}
      </div>
    </button>
  );
}
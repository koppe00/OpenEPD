'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ShieldPlus, Trash2, Edit3, Lock } from 'lucide-react';
import { RoleModal } from './RoleModal'; // <-- CRUCIAAL: Voeg deze import toe

export function RoleManager() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchRoles = async () => {
    setLoading(true);
    const { data } = await supabase.from('roles').select('*').order('display_name');
    setRoles(data || []);
    setLoading(false);
  };

  useEffect(() => { 
    fetchRoles(); 
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header sectie met knop */}
      <div className="flex justify-between items-center px-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Gedefinieerde Systeemrollen
        </p>
        <button 
          onClick={() => setIsRoleModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10"
        >
          <ShieldPlus size={14} /> Nieuwe Rol Toevoegen
        </button>
      </div>

      {/* Grid met rollen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center font-black text-[10px] uppercase text-slate-300 animate-pulse">
            Rollen register laden...
          </div>
        ) : (
          roles.map((role) => (
            <div key={role.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-blue-100 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${role.is_system_role ? 'bg-slate-50 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                  {role.is_system_role ? <Lock size={20} /> : <ShieldPlus size={20} />}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                    <Edit3 size={16} />
                  </button>
                  {!role.is_system_role && (
                    <button className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">{role.display_name}</h4>
              <p className="text-[10px] font-mono text-slate-400 mt-1">{role.role_key}</p>
              {role.description && (
                <p className="text-[10px] text-slate-500 mt-4 leading-relaxed line-clamp-2">
                  {role.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* De Modal (nu buiten de flex-header geplaatst voor betere rendering) */}
      <RoleModal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
        onSave={fetchRoles} 
      />
    </div>
  );
}
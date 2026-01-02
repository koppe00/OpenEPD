import React from 'react';
import { Mail, Edit3, Trash2, RefreshCw, UserX } from 'lucide-react';

export function UserTable({ users, onEdit, onDelete, onReactivate, loading }: any) {
  if (loading) return <div className="p-20 text-center font-black uppercase text-slate-400">Registers synchroniseren...</div>;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden border-separate">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Zorgverlener</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Organisatie</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Rol</th>
            <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Identiteit</th>
            <th className="px-8 py-5 text-right">Status Beheer</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map((user: any) => {
            const isInactive = user.is_active === false;

            return (
              <tr 
                key={user.id} 
                className={`transition-all group border-b border-slate-50 ${
                  isInactive ? 'bg-slate-100/60' : 'hover:bg-slate-50/30'
                }`}
              >
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isInactive ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>
                        {user.full_name}
                      </span>
                      {isInactive && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-tight">
                          Uit Dienst
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Mail size={10} /> {user.email}
                    </span>
                  </div>
                </td>
                <td className={`px-8 py-5 text-xs font-bold ${isInactive ? 'text-slate-400' : 'text-slate-600'}`}>
                  {user.staff_memberships?.[0]?.organizations?.name || '---'}
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${
                    isInactive 
                      ? 'bg-slate-100 text-slate-400 border-slate-200' 
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {user.app_role?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className={`flex flex-col text-[10px] font-bold ${isInactive ? 'text-slate-300' : 'text-slate-400'}`}>
                    <span>UZI: {user.uzi_number || '---'}</span>
                    <span>BIG: {user.big_registration_number || '---'}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    
                    {!isInactive ? (
                      /* ACTIES VOOR ACTIEVE GEBRUIKERS */
                      <>
                        <button 
                          onClick={() => onEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Profiel Bewerken"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete(user.id)} 
                          className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
                          title="Zet op 'Inactief' (Geen toegang meer)"
                        >
                          <UserX size={18} />
                        </button>
                      </>
                    ) : (
                      /* ACTIES VOOR INACTIEVE GEBRUIKERS */
                      <button 
                        onClick={() => onReactivate(user.id)} 
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all flex items-center gap-2"
                        title="Herstel toegang (Heractiveren)"
                      >
                        <RefreshCw size={18} />
                        <span className="text-[10px] font-bold uppercase mr-1">Herstellen</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
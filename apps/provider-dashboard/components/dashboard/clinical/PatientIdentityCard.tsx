import { ShieldCheck } from 'lucide-react';
export const PatientIdentityCard = ({ patient }: any) => (
  <div className="flex items-center gap-6">
    <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.2rem] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-100">{patient?.full_name[0]}</div>
    <div>
      <div className="flex items-center gap-3">
        <h2 className="font-black text-2xl tracking-tighter text-slate-900 leading-none">{patient?.full_name}</h2>
        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-100 flex items-center gap-1">
          <ShieldCheck size={10} /> Vault_Synced
        </span>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">BSN: {patient?.bsn_number} • Geb: {new Date(patient?.date_of_birth).toLocaleDateString('nl-NL')}</p>
    </div>
  </div>
);

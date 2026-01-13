import { ShieldCheck } from 'lucide-react';
export const PatientIdentityCard = ({ patient }: any) => (
  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-600 rounded flex items-center justify-center text-white text-sm sm:text-base font-black shrink-0">{patient?.full_name[0]}</div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <h2 className="font-extrabold text-sm sm:text-base lg:text-lg text-slate-900 leading-tight truncate">{patient?.full_name}</h2>
        <span className="hidden sm:flex px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[7px] font-extrabold uppercase tracking-wide rounded border border-emerald-200 items-center gap-1 shrink-0">
          <ShieldCheck size={10} /> <span className="hidden lg:inline">Vault_Synced</span>
        </span>
      </div>
      <p className="text-[8px] sm:text-[9px] font-extrabold text-slate-500 uppercase tracking-wide mt-0.5 truncate">BSN: {patient?.bsn_number} • {new Date(patient?.date_of_birth).toLocaleDateString('nl-NL')}</p>
    </div>
  </div>
);

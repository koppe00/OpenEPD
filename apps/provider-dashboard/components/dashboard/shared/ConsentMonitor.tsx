import { ShieldCheck, ShieldAlert } from 'lucide-react';
export const ConsentMonitor = ({ hasConsent = true }: { hasConsent?: boolean }) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all border ${hasConsent ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
    {hasConsent ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
    <span className="text-[9px] font-black uppercase tracking-widest leading-none">
      {hasConsent ? 'FHIR Consent: Verified' : 'No Consent'}
    </span>
  </div>
);

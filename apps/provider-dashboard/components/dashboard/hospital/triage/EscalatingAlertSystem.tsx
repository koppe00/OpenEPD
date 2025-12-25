import { AlertCircle, BellRing } from 'lucide-react';
export const EscalatingAlertSystem = ({ level = 'low' }: { level?: 'low' | 'high' }) => (
  <div className={`p-4 rounded-2xl border flex items-center gap-4 animate-pulse ${level === 'high' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
    <BellRing size={20} className={level === 'high' ? 'animate-bounce' : ''} />
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest">Kritieke Alert</p>
      <p className="text-xs font-bold italic">Afwijkende MEWS score gedetecteerd - Directe actie vereist.</p>
    </div>
  </div>
);

import { CheckCircle2 } from 'lucide-react';
export const InterventionTasklist = () => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Openstaande Interventies</h4>
    <div className="space-y-3">
      {['Lab CVRM aanvragen', 'Medicatieoverzicht verifiëren', 'Patiëntportaal instructie'].map((task, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <CheckCircle2 size={14} className="text-slate-300" />
          <span className="text-[11px] font-bold text-slate-600">{task}</span>
        </div>
      ))}
    </div>
  </div>
);

import { Plus } from 'lucide-react';
export const ActionRibbon = ({ onNewMeasurement }: any) => (
  <div className="flex gap-4">
    <button onClick={onNewMeasurement} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl">
      <Plus size={16} /> Meting
    </button>
  </div>
);

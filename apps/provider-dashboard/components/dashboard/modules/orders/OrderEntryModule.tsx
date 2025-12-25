import { ClipboardList, Plus } from 'lucide-react';
export const OrderEntryModule = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <h3 className="text-lg font-black tracking-tighter uppercase italic">Orders & Aanvragen</h3>
    <div className="grid grid-cols-2 gap-4">
      <button className="p-6 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-blue-500 transition-all group">
        <Plus className="mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
        <p className="font-black text-xs uppercase">Nieuw Labonderzoek</p>
        <p className="text-[10px] text-slate-400 mt-1">Standaard pakket CVRM / Nierfunctie</p>
      </button>
      <button className="p-6 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-blue-500 transition-all group">
        <Plus className="mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
        <p className="font-black text-xs uppercase">Radiologie (X-Thorax)</p>
        <p className="text-[10px] text-slate-400 mt-1">Aanvraag inclusief AI-detectie</p>
      </button>
    </div>
  </div>
);

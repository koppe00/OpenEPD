import { Pill, AlertTriangle, Barcode } from 'lucide-react';
export const MedicationModule = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-black tracking-tighter uppercase italic">Medicatie Beheer</h3>
      <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
        <Barcode size={14} /> Scan Barcode
      </button>
    </div>
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl mb-4">
        <AlertTriangle className="text-rose-500" size={18} />
        <p className="text-xs font-bold text-rose-700 italic">Red Flag: Interactie gedetecteerd tussen Metformine en NSAID.</p>
      </div>
      <table className="w-full text-left text-xs">
        <thead><tr className="text-slate-400 uppercase text-[9px] font-black tracking-widest border-b border-slate-50"><th className="pb-3">Medicament</th><th className="pb-3">Dosering</th><th className="pb-3">Status</th></tr></thead>
        <tbody className="font-bold text-slate-600">
          <tr><td className="py-4">Metformine 500mg</td><td>2dd1</td><td><span className="text-emerald-500 text-[10px]">Actief</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

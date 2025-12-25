import { FileText } from 'lucide-react';
export const NoteEditor = () => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
      <FileText size={14} /> Klinische Notitie (SOAP)
    </div>
    <textarea className="w-full h-40 bg-slate-50 rounded-2xl p-4 text-sm outline-none border border-transparent focus:border-blue-200" placeholder="S: Patiënt klaagt over... O: Bloeddruk 140/90... A: ... P: ..."></textarea>
  </div>
);

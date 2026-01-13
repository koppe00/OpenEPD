import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface Props {
  isExporting: boolean;
  onClick: () => void;
}

export function AIExportWidget({ isExporting, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={isExporting}
      className={`flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all ${isExporting ? 'opacity-70 pointer-events-none' : ''} w-full sm:w-auto`}
    >
      {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
      <span className="ml-2">{isExporting ? 'Exporteren...' : 'Exporteer naar Dossier'}</span>
    </button>
  );
}

export default AIExportWidget;

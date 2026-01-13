'use client';

import React from 'react';
import { X, History, Plus, Database } from 'lucide-react';
import { ZibHistoryTable } from './ZibHistoryTable';
import { ClinicalObservation } from '../../hooks/useClinicalData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  zibId: string | null;
  history: ClinicalObservation[];
  onAddEntry: () => void;
}

export const ZibDetailPanel = ({ isOpen, onClose, zibId, history, onAddEntry }: Props) => {
  if (!zibId) return null;
  const displayName = zibId.split('.').pop() || zibId;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[110] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:max-w-xl lg:max-w-2xl bg-white shadow-2xl z-[120] transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-slate-900 rounded-xl sm:rounded-2xl text-white shadow-lg shrink-0">
              <History size={16} className="sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tighter uppercase italic truncate">{displayName}</h2>
              <div className="flex items-center gap-2">
                <Database size={10} className="text-blue-500" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 italic truncate">Geverifieerde Vault Data</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 sm:p-3 hover:bg-white rounded-full transition-all text-slate-300 shrink-0">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-4">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Klinische Tijdlijn</p>
            <button 
              onClick={onAddEntry}
              className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 sm:px-4 py-2 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all w-full sm:w-auto"
            >
              <Plus size={12} className="sm:w-3.5 sm:h-3.5" /> Nieuwe Meting
            </button>
          </div>
          
          <ZibHistoryTable zibId={zibId} history={history} />
        </div>
      </div>
    </>
  );
};
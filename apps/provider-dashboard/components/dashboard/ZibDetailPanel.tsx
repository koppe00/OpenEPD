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
      <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-[120] transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase italic">{displayName}</h2>
              <div className="flex items-center gap-2">
                <Database size={10} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Geverifieerde Vault Data</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all text-slate-300">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="flex justify-between items-end mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Klinische Tijdlijn</p>
            <button 
              onClick={onAddEntry}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
            >
              <Plus size={14} /> Nieuwe Meting
            </button>
          </div>
          
          <ZibHistoryTable zibId={zibId} history={history} />
        </div>
      </div>
    </>
  );
};
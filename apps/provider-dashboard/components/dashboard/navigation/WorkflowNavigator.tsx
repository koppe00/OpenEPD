'use client';

import React from 'react';
import { 
  Users, 
  ChevronRight, 
  Search 
} from 'lucide-react';
import { PatientProfile } from '../../../types';
import { WorkflowMode, WORKFLOW_THEMES } from '@openepd/clinical-core';

interface Props {
  patients: PatientProfile[];
  viewMode: WorkflowMode;
  selectedId?: string;
  onSelect: (patient: PatientProfile) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const WorkflowNavigator = ({ 
  patients, 
  viewMode, 
  selectedId, 
  onSelect,
  searchTerm,
  onSearchChange
}: Props) => {
  
  const theme = WORKFLOW_THEMES[viewMode];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={viewMode === 'spreekuur' ? "Zoek in agenda..." : "Zoek op afdeling..."}
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="flex items-center justify-between px-2">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
            {viewMode === 'spreekuur' ? 'Wachtrij' : 'Beddenoverzicht'}
          </span>
          {viewMode === 'kliniek' && (
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Real-time</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 custom-scrollbar">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => onSelect(patient)}
              className={`w-full text-left p-4 rounded-[1.5rem] transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                selectedId === patient.id 
                  ? `${theme.primary} text-white shadow-xl translate-x-1` 
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-2 rounded-xl transition-colors ${
                  selectedId === patient.id ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                  <Users size={18} className={selectedId === patient.id ? 'text-white' : 'text-slate-400'} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tight truncate max-w-[140px]">
                    {patient.full_name}
                  </p>
                  <p className={`text-[9px] font-bold opacity-60 ${
                    selectedId === patient.id ? 'text-white' : 'text-slate-400'
                  }`}>
                    {viewMode === 'spreekuur' ? `Consult: 14:00` : `Bed: K3-12`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 relative z-10">
                {viewMode === 'kliniek' && (
                  <div className={`w-2 h-2 rounded-full ${
                    patient.id.includes('1') ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'
                  }`} />
                )}
                <ChevronRight 
                  size={14} 
                  className={`transition-transform group-hover:translate-x-1 ${
                    selectedId === patient.id ? 'text-white' : 'text-slate-300'
                  }`} 
                />
              </div>

              {selectedId === patient.id && (
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              )}
            </button>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-slate-300 opacity-50">
            <Search size={24} className="mb-2" />
            <p className="text-[9px] font-black uppercase tracking-widest">Geen resultaten</p>
          </div>
        )}
      </div>
    </div>
  );
};
'use client';

import React from 'react';
import { Search, Clock, UserCheck, History, Calendar } from 'lucide-react';
import { PatientProfile } from '../../../types';

interface Props {
  patients: PatientProfile[];
  viewMode: string;
  selectedId?: string;
  onSelect: (p: PatientProfile) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export function WorkflowNavigator({ 
  patients, 
  viewMode, 
  selectedId, 
  onSelect, 
  searchTerm, 
  onSearchChange 
}: Props) {
  
  // 1. Filteren op de zoekterm die uit de props komt
  const filtered = patients.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Splitsen in 'Recent Bekeken' en 'Dagprogramma'
  const recentPatients = filtered.filter(p => p.isRecent);
  const worklistPatients = filtered.filter(p => !p.isRecent);

  // Helper functie om de kaartjes te renderen
  const renderPatientCard = (patient: PatientProfile) => {
    // We casten naar any voor de velden die mogelijk nog niet 100% matchen met de basis interface
    const p = patient as any; 
    const isPresent = p.status === 'present';
    const isSelected = selectedId === p.id;

    return (
      <button 
        key={p.id}
        onClick={() => onSelect(patient)}
        className={`w-full p-4 flex items-center gap-4 border-b border-slate-50 transition-all text-left group ${
          isSelected 
            ? 'bg-blue-50 border-r-4 border-r-blue-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]' 
            : 'hover:bg-slate-50'
        }`}
      >
        <div className="relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[10px] uppercase transition-colors ${
              isSelected ? 'bg-blue-600 text-white' : (isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400')
          }`}>
            {p.initials || p.first_name?.[0] || '?'}
          </div>
          
          {/* Status indicator stip */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            isPresent ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-300'
          }`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
              <p className={`text-[11px] font-black uppercase tracking-tight truncate transition-colors ${
                  isSelected ? 'text-blue-700' : 'text-slate-800'
              }`}>
                  {p.full_name}
              </p>
              {isPresent && <UserCheck size={12} className="text-emerald-500 shrink-0" />}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                {p.date_of_birth || 'GEEN GEBOORTEDATUM'}
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Zoekbalk sectie */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text"
            placeholder="Lijst doorzoeken..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-[11px] font-bold text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* SECTIE 1: RECENT BEKEKEN (MPI) */}
        {recentPatients.length > 0 && (
            <div className="bg-slate-50/30">
                <div className="px-6 py-3 flex items-center gap-2 text-blue-500/70">
                    <History size={11} className="stroke-[3px]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Recent Bekeken</span>
                </div>
                {recentPatients.map(renderPatientCard)}
            </div>
        )}

        {/* SECTIE 2: STANDAARD WERKLIJST */}
        <div className="px-6 py-3 flex items-center gap-2 text-slate-400 mt-2">
            <Calendar size={11} className="stroke-[3px]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                {viewMode === 'kliniek' ? 'Afdelingsoverzicht' : 'Poli Programma'}
            </span>
        </div>
        
        {worklistPatients.length > 0 ? (
            worklistPatients.map(renderPatientCard)
        ) : (
            <div className="p-10 text-center space-y-2">
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest italic">
                    Geen geplande dossiers
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
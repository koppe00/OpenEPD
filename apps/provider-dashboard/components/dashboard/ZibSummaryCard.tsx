'use client';

import React from 'react';
import { Activity, Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

// Type voor de ZIB content om 'any' te voorkomen en compatibiliteit met de Vault te garanderen
type ZibContent = Record<string, string | number | boolean | undefined>;

interface ZibSummaryProps {
  zibId: string;
  data: ZibContent;
  effectiveAt: string;
  status?: 'normal' | 'warning' | 'critical';
  onClick?: () => void;
}

export const ZibSummaryCard = ({ zibId, data, effectiveAt, status = 'normal', onClick }: ZibSummaryProps) => {
  // Haal de laatste naam van de ZIB (bijv. 'Bloeddruk') voor de weergave
  const displayName = zibId.split('.').pop() || zibId;

  // Formatteer de waarde op basis van het type ZIB
  const renderValue = () => {
    if (!data) return 'Geen data';

    switch (zibId) {
      case 'nl.zorg.Bloeddruk':
        return `${data.systolic}/${data.diastolic} mmHg`;
      case 'nl.zorg.Lichaamsgewicht':
        return `${data.weight_value} kg`;
      case 'nl.zorg.Lichaamstemperatuur':
        return `${data.temperature_value} °C`;
      case 'nl.zorg.Saturatie':
        return `${data.oxygen_saturation}% SpO2`;
      case 'nl.zorg.Pijnscore':
        return `Pijn: ${data.pain_score}/10`;
      default:
        // Fallback: Zoek naar de eerste numerieke waarde in de JSON
        const firstValue = Object.values(data).find(v => typeof v === 'number');
        return firstValue !== undefined ? String(firstValue) : 'Details';
    }
  };

  const statusColors = {
    normal: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    critical: 'bg-rose-50 text-rose-700 border-rose-100'
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer active:scale-[0.98]"
    > 
      {/* Live Sync Indicator (Rechtsboven) */}
      <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 bg-emerald-500/5 rounded-full border border-emerald-500/10 z-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-600">Sync Live</span>
      </div>

      {/* Kaart Header */}
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-[1.2rem] ${statusColors[status]} border transition-colors`}>
          <Activity size={22} />
        </div>
        
        {/* Tijd-badge (gepositioneerd om overlap met Sync indicator te voorkomen) */}
        <div className="flex flex-col items-end mr-16">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100/50">
            <Clock size={12} className="text-blue-500" />
            {formatDistanceToNow(new Date(effectiveAt), { addSuffix: true, locale: nl })}
          </div>
        </div>
      </div>

      {/* Medische Waarde */}
      <div className="space-y-1">
        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">
          {displayName}
        </h4>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase">
            {renderValue()}
          </span>
        </div>
      </div>

      {/* Kaart Footer */}
      <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Vault Secured
          </span>
        </div>
        
        {/* Visuele Action Button (niet functioneel als button omdat hele card klikbaar is) */}
        <div className="bg-slate-900 text-white p-2.5 rounded-full group-hover:bg-blue-600 transition-all shadow-lg group-hover:scale-110">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
};
'use client';

import { AlertTriangle } from 'lucide-react';

export const TriageMonitor = () => (
  <div className="p-4 bg-rose-50 border-y border-rose-100 flex items-center gap-3">
    <div className="bg-rose-500 p-1.5 rounded-lg text-white animate-pulse">
      <AlertTriangle size={14} />
    </div>
    <div>
      <p className="text-[10px] font-black text-rose-700 uppercase leading-none">Kritieke Triage</p>
      {/* Gebruik {' > '} om JSX niet in de war te brengen */}
      <p className="text-[9px] text-rose-600 font-medium">2 patiënten met MEWS {'>'} 5</p>
    </div>
  </div>
);
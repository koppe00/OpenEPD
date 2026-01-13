'use client';

import React from 'react';
import { ClinicalObservation } from '@/hooks/useClinicalData';
import { FileText, Calendar } from 'lucide-react';

interface Props {
  zibId: string;
  history: ClinicalObservation[];
}

export function ZibHistoryTable({ zibId, history }: Props) {
  if (!history || history.length === 0) {
    return <div className="p-8 text-center text-slate-400 italic text-xs">Geen historie beschikbaar.</div>;
  }

  // FIX: We gebruiken nu 'value' in plaats van 'content'
  // We checken ook of value bestaat en een object is
  const firstItem = history[0];
  const columns = (firstItem.value && typeof firstItem.value === 'object') 
    ? Object.keys(firstItem.value) 
    : ['waarde'];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="p-4 w-32">Datum</th>
              {columns.map(col => (
                <th key={col} className="p-4">{col.replace(/_/g, ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {history.map((item) => {
               // Veilige toegang tot value object
               const val = item.value as Record<string, unknown> || {};
               
               return (
                <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={12} className="text-slate-300" />
                      <span className="text-xs font-bold font-mono">
                        {new Date(item.effective_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-300 pl-5">
                        {new Date(item.effective_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </td>
                  
                  {columns.map(col => {
                    const cellValue = val[col];
                    // Render logica: is het tekst of een getal?
                    const isLongText = typeof cellValue === 'string' && cellValue.length > 20;
                    
                    return (
                      <td key={`${item.id}-${col}`} className="p-4 text-xs font-medium text-slate-700">
                        {isLongText ? (
                            <div className="flex items-start gap-2 max-w-[300px]">
                                <FileText size={12} className="mt-0.5 text-blue-400 shrink-0" />
                                <span className="line-clamp-2" title={String(cellValue)}>
                                    {String(cellValue)}
                                </span>
                            </div>
                        ) : (
                            <span>{cellValue !== undefined && cellValue !== null ? String(cellValue) : '-'}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
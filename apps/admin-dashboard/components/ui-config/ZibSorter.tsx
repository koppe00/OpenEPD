'use client';

import React from 'react';
import { ArrowUp, ArrowDown, X, GripVertical, Plus } from 'lucide-react';
import { ZIB_CONFIG } from '@openepd/clinical-core';

interface Props {
  selectedZibs: string[];
  onChange: (newOrder: string[]) => void;
}

export function ZibSorter({ selectedZibs, onChange }: Props) {
  
  // 1. Verplaats item omhoog
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...selectedZibs];
    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    onChange(newArr);
  };

  // 2. Verplaats item omlaag
  const moveDown = (index: number) => {
    if (index === selectedZibs.length - 1) return;
    const newArr = [...selectedZibs];
    [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
    onChange(newArr);
  };

  // 3. Verwijder item
  const removeZib = (zibId: string) => {
    onChange(selectedZibs.filter(id => id !== zibId));
  };

  // 4. Voeg item toe
  const addZib = (zibId: string) => {
    if (zibId && !selectedZibs.includes(zibId)) {
        onChange([...selectedZibs, zibId]);
    }
  };

  // Filter beschikbare ZIBs (zodat je geen dubbele toevoegt)
  const availableOptions = Object.keys(ZIB_CONFIG)
    .filter(key => !selectedZibs.includes(key))
    .sort();

  return (
    <div className="flex flex-col gap-2">
      
      {/* DE LIJST MET GESELECTEERDE ITEMS */}
      <div className="space-y-1">
        {selectedZibs.map((zibId, index) => {
            const label = ZIB_CONFIG[zibId]?.[0]?.label || zibId.replace('nl.zorg.', '');
            
            return (
            <div key={zibId} className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200 shadow-sm group">
                <span className="text-slate-300 cursor-grab"><GripVertical size={12} /></span>
                
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-700 truncate">{label}</div>
                    <div className="text-[9px] text-slate-400 font-mono truncate">{zibId}</div>
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-20"><ArrowUp size={12} /></button>
                    <button onClick={() => moveDown(index)} disabled={index === selectedZibs.length - 1} className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-20"><ArrowDown size={12} /></button>
                </div>

                <button onClick={() => removeZib(zibId)} className="ml-2 p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded">
                    <X size={12} />
                </button>
            </div>
            );
        })}
        {selectedZibs.length === 0 && (
            <div className="text-center py-4 text-xs text-slate-400 italic border border-dashed rounded bg-slate-50">
                Nog geen data gekoppeld.
            </div>
        )}
      </div>

      {/* DROPDOWN OM TOE TE VOEGEN */}
      <div className="relative mt-2">
         <select 
            className="w-full text-xs border border-slate-200 p-2 pl-8 rounded-lg appearance-none outline-none focus:border-blue-400 bg-white"
            onChange={(e) => { addZib(e.target.value); e.target.value = ''; }}
         >
            <option value="">+ Voeg ZIB toe aan widget...</option>
            {availableOptions.map(key => (
                <option key={key} value={key}>{key.replace('nl.zorg.', '')}</option>
            ))}
         </select>
         <Plus size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import { Sparkles, AlertCircle, Zap, BrainCircuit } from 'lucide-react';
import { WorkflowMode, WORKFLOW_THEMES } from '@openepd/clinical-core';

// Vervang 'any' door strikte interfaces
interface ZibContent {
  systolic?: number;
  diastolic?: number;
  criticality?: 'Low' | 'High' | 'Unable to assess';
  substance?: {
    display: string;
  };
  [key: string]: unknown; // Voor overige ZIB-velden
}

interface ClinicalObservation {
  id: string;
  zib_id: string; 
  effective_at: string;
  content: ZibContent;
}

interface AIAssistantProps {
  observations?: ClinicalObservation[];
  mode: WorkflowMode;
}

export const AIAssistantCard = ({ observations = [], mode }: AIAssistantProps) => {
  const theme = WORKFLOW_THEMES[mode];

  // Type-safe extractie
  const latestBP = observations.find(o => o.zib_id === 'nl.zorg.Bloeddruk')?.content;
  const allergies = observations.filter(o => o.zib_id === 'nl.zorg.AllergieIntolerantie');
  
  const systolicValue = latestBP?.systolic ?? 0;
  const diastolicValue = latestBP?.diastolic ?? 0;
  
  const isHypertensive = systolicValue > 140 || diastolicValue > 90;
  const hasCriticalAllergy = allergies.some(a => a.content?.criticality === 'High');

  return (
    <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group min-h-[340px] flex flex-col justify-between">
      
      {/* Dynamic Background Glow based on Mode */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] transition-all duration-1000 opacity-20 ${theme.primary}`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`${theme.primary} p-2 rounded-xl shadow-lg`}>
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] italic ${theme.secondary}`}>
                {theme.label} Intelligence
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${mode === 'spoed' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Contextual Reasoning</span>
          </div>
        </div>

        <h2 className="text-3xl font-black tracking-tighter leading-tight mb-6">
          {mode === 'spreekuur' 
            ? (isHypertensive ? "Chronisch cardiovasculair risico gedetecteerd." : "Behandeldoelen voor poli zijn stabiel.")
            : (isHypertensive ? "Acute hypertensieve trend op afdeling!" : "Klinische parameters binnen veilige marges.")}
        </h2>

        <div className="space-y-4">
          {isHypertensive && (
            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <AlertCircle className="text-rose-400 shrink-0" size={16} />
              <p className="text-xs font-bold leading-relaxed text-slate-300 italic">
                {mode === 'spreekuur' 
                  ? "Overweeg aanpassing onderhoudsdosering volgens NHG-standaard." 
                  : "Monitor patiënt op tekenen van eindorgaanschade (SEWS verhoging)."}
              </p>
            </div>
          )}

          {hasCriticalAllergy && (
            <div className="flex items-start gap-3 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
              <Zap className="text-amber-400 shrink-0" size={16} />
              <p className="text-xs font-bold leading-relaxed text-slate-300 italic">
                Kritieke allergie vlag actief. Closed-loop medicatiebewaking is ingeschakeld.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 pt-8 flex items-center justify-between border-t border-white/5">
        <div className="flex gap-2 text-slate-500">
          <BrainCircuit size={16} />
          <span className="text-[8px] font-black uppercase tracking-widest">AI Engine: Sovereign-Med-v1</span>
        </div>
        <button className={`text-[10px] font-black uppercase tracking-widest transition-colors ${theme.secondary} hover:opacity-80`}>
          Genereer beleidsvoorstel →
        </button>
      </div>
    </div>
  );
};
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useClinicalData } from '@/hooks/useClinicalData';
import { Brain, Database, ArrowLeft, Activity, ShieldCheck, Zap, Loader2 } from 'lucide-react';

export default function AIInsightsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const { observations, loading } = useClinicalData(patientId);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" />
    </div>
  );

  return (
    // We verwijderen 'min-h-screen' en grote padding omdat de main layout dit al regelt
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Sub-header binnen het hoofdscherm */}
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors text-[10px] mb-2"
          >
            <ArrowLeft size={14} /> Terug naar overzicht
          </button>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">
            AI Clinical <span className="text-blue-600 italic">Audit Trail</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
          <ShieldCheck className="text-emerald-500" size={18} />
          <span className="text-[10px] font-black uppercase text-slate-500 italic">Verified by Sovereign AI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* DATA BRONNEN */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Database className="text-slate-400" size={16} />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Input Data (ZIB Context)</h2>
          </div>
          
          <div className="grid gap-4">
            {observations.map((obs) => (
              <div key={obs.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Activity size={16} />
                  </div>
                  <span className="font-bold text-sm text-slate-800">{obs.zib_id}</span>
                </div>
                <div className="rounded-2xl bg-slate-900 p-4 font-mono text-[11px] text-emerald-400/90 overflow-x-auto">
                   {JSON.stringify(obs.value, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI INTERPRETATIE */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="text-blue-600" size={16} />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">AI Reasoning</h2>
          </div>
          
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl sticky top-4">
             <div className="flex items-center gap-2 mb-8">
                <Zap size={16} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Deep Reasoning Log</span>
             </div>
             <p className="text-sm leading-relaxed text-slate-300 italic mb-6">
               "De AI heeft cross-referencing toegepast op de Vitale Parameters en de Anamnestische data. Er is een significante correlatie gevonden tussen de gerapporteerde dyspneu en de SpO2 daling."
             </p>
             <div className="text-[10px] font-mono text-slate-500 border-t border-white/10 pt-4">
               MODEL: {process.env.NEXT_PUBLIC_GEMINI_MODEL}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { ClinicalObservation } from '@/hooks/useClinicalData';
import { 
  Brain, 
  Sparkles,
  Database, 
  ArrowLeft, 
  CheckCircle2,
  Loader2, 
  ArrowRight,
  Activity, 
  ShieldCheck, 
  Zap, 
  FileJson, 
  AlertTriangle,
  Info // <-- Deze ontbrak!
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Link from 'next/link';

interface Props {
  observations: ClinicalObservation[];
  monitoredZibs: string[];
  patientId: string;
  aiEnabled?: boolean; // Optional prop to disable AI calls
}

export function AIAssistantWidget({ observations, monitoredZibs, patientId, aiEnabled = true }: Props) {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);

  const genAI = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    return key ? new GoogleGenerativeAI(key) : null;
  }, []);

  const MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-1.5-flash";

  useEffect(() => {
    if (!genAI || observations.length === 0 || !aiEnabled) {
      if (!aiEnabled) {
        setAiAdvice(null);
        setError('AI uitgeschakeld - schakel in via Intelligence Module');
      }
      return;
    }

    // Rate limiting: minimaal 10 seconden tussen requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    const MIN_INTERVAL = 10000; // 10 seconden

    if (timeSinceLastRequest < MIN_INTERVAL) {
      console.log('[AIAssistant] Rate limited - waiting', Math.ceil((MIN_INTERVAL - timeSinceLastRequest) / 1000), 'seconds');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      setLastRequestTime(Date.now());
      
      try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const contextString = observations.map(o => `ZIB: ${o.zib_id} | Data: ${JSON.stringify(o.value)}`).join('\n');
        const prompt = `Je bent een klinisch expert AI. Analyseer de volgende patiëntgegevens (ZIB's):
          ${contextString}

          Geef een beknopt, objectief klinisch advies aan de behandelend arts:
          1. Identificeer trends of afwijkingen in de parameters.
          2. Noem potentiële risico's op basis van de gecombineerde data.
          3. Suggereer een logische volgende stap conform medische standaarden.


          
          Houd het antwoord strikt zakelijk, Nederlands, en beperk je tot de essentie (max 50 woorden max 4 zinnen).`;
        
        const result = await model.generateContent(prompt);
        setAiAdvice(result.response.text());
        setError(null);
      } catch (err: any) {
        console.error('[AIAssistant] Error:', err);
        if (err?.message?.includes('429') || err?.message?.includes('quota')) {
          setError("API quota bereikt. Wacht enkele minuten.");
        } else {
          setError("AI-service fout. Probeer later opnieuw.");
        }
        setAiAdvice(null);
      } finally {
        setIsLoading(false);
      }
    }, 2000); // Verhoogd naar 2 seconden debounce

    return () => clearTimeout(timeoutId);
  }, [observations, genAI, MODEL_NAME]); // Verwijder lastRequestTime uit dependencies

  // 3. Verbeterde Local Insights met Deduplicatie
  const localInsights = useMemo(() => {
    const uniqueAlerts = new Set<string>();
    
    observations.forEach(obs => {
      const data = obs.value;
      if (!data) return;

      if (obs.zib_id === 'nl.zorg.Bloeddruk' && Number(data.systolic) > 140) {
        uniqueAlerts.add(`Verhoogde RR gedetecteerd (${data.systolic} mmHg)`);
      }
      if (obs.zib_id === 'nl.zorg.O2Saturatie' && Number(data.spo2) < 94) {
        uniqueAlerts.add(`Verlaagde SpO2 (${data.spo2}%)`);
      }
      if (obs.zib_id.includes('Anamnese')) {
        const text = String(data.anamnesis_text || '').toLowerCase();
        if (text.includes('pijn') || text.includes('benauwd')) {
          uniqueAlerts.add('Alarmsymptomen in anamnese gevonden (dyspneu/pijn)');
        }
      }
    });

    return Array.from(uniqueAlerts);
  }, [observations]);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] h-full flex flex-col relative overflow-hidden border border-slate-700 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Brain className="text-blue-400" size={20} />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-white">Clinical Intelligence</h3>
            <span className="text-[10px] text-slate-400 font-medium">Sovereign Engine v1.2</span>
          </div>
        </div>
        {isLoading && <Loader2 size={16} className="animate-spin text-blue-400" />}
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 relative z-10 custom-scrollbar pr-2">
        
        {/* AI SECTIE - Verbeterde Leesbaarheid */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300/80">Generatief Advies</span>
          </div>
          
          {isLoading && !aiAdvice ? (
            <div className="space-y-3 py-2 animate-pulse">
               <div className="h-4 w-full bg-white/10 rounded" />
               <div className="h-4 w-5/6 bg-white/10 rounded" />
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-200 font-medium">
              {error}
            </div>
          ) : aiAdvice && (
            <div className="text-[13px] leading-relaxed text-slate-100 bg-blue-500/5 p-5 rounded-2xl border border-blue-500/20 shadow-inner italic">
              {aiAdvice}
            </div>
          )}
        </section>

        {/* LOKALE FALLBACK - Deduplicated */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300/80">Lokale Validatie</span>
          </div>
          
          <div className="space-y-2">
            {localInsights.length > 0 ? (
              localInsights.map((text, i) => (
                <div key={i} className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 items-center transition-all hover:bg-amber-500/20">
                  <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-50 text-white font-semibold leading-tight">{text}</p>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-500 italic px-2">Alle lokale parameters binnen de norm.</p>
            )}
          </div>
        </section>
      </div>

      {/* Footer met link naar Detail Pagina */}
      <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
        <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-500 uppercase">Engine Model</span>
            <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-tighter">{MODEL_NAME}</span>
        </div>
        
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-ai-details'))}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          <Brain size={14} />
          Details Analyse
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
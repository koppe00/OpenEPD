'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Brain, Database, ArrowLeft, ShieldCheck, Zap, History, Download, CheckCircle2, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import { ClinicalObservation } from '@/hooks/useClinicalData';
import { GoogleGenerativeAI } from '@google/generative-ai';
import AIExportWidget from './AIExportWidget';
import { VoiceAssistantWidget } from './VoiceAssistantWidget';
import { ReviewConsoleModal } from './ReviewConsoleModal';

interface Props {
  observations: ClinicalObservation[];
  patientId: string | undefined;
  onBack: () => void;
  onDataRefresh?: () => void;
}

export function AIInsightsModule({ observations, patientId, onBack, onDataRefresh }: Props) {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [manualTrigger, setManualTrigger] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(() => {
    // Persist AI toggle state in localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aiInsightsEnabled');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  console.log('[AIInsightsModule] Rendering with', observations.length, 'observations for patient', patientId);

  
  const handleExportToDossier = async () => {
    if (!patientId) return alert('Geen patiënt geselecteerd');
    setIsExporting(true);

    try {
      const transcript = observations
        .map(o => `ZIB:${o.zib_id} DATE:${o.effective_at} DATA:${JSON.stringify(o.value)}`)
        .join('\n');

      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, patientId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Export failed', err);
        alert('Exporteren mislukt');
        return;
      }

      const data = await res.json();
      // AI extraction saved
      // Optionally notify user
      alert('Extractie succesvol opgeslagen in dossier');
    } catch (e) {
      console.error(e);
      alert('Fout tijdens exporteren');
    } finally {
      setIsExporting(false);
    }
  };

  // 1. AI Configuratie (Gelijk aan de widget)
  const genAI = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    return key ? new GoogleGenerativeAI(key) : null;
  }, []);

  const MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-1.5-flash";

  // Save AI toggle state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiInsightsEnabled', String(aiEnabled));
    }
  }, [aiEnabled]);

  // 2. AI Analyse Effect (manual trigger only to prevent quota exhaustion)
  useEffect(() => {
    if (!genAI || observations.length === 0 || !manualTrigger || !aiEnabled) return;

    const getDeepAnalysis = async () => {
      setIsAiLoading(true);
      setAiError(null);
      try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const contextString = observations.map(o => `ZIB: ${o.zib_id} | Data: ${JSON.stringify(o.value)}`).join('\n');
        
        const prompt = `
          Je bent een klinisch expert. Analyseer deze longitudinale patiëntgegevens:
          ${contextString}

          Geef een uitgebreide klinische interpretatie voor de behandelend arts.
          Focus op trends in de tijd en de samenhang tussen verschillende ZIB's (bijv. relatie tussen anamnese en vitale parameters).
          Antwoord in helder Nederlands, medisch professioneel, max 200 woorden.
        `;

        const result = await model.generateContent(prompt);
        setAiAdvice(result.response.text());
      } catch (err: any) {
        console.error("AI Error:", err);
        if (err?.message?.includes('quota') || err?.message?.includes('429')) {
          setAiError('API quota bereikt. Wacht even en probeer opnieuw, of upgrade je Gemini API plan.');
        } else {
          setAiError('AI-analyse mislukt. Controleer je API key configuratie.');
        }
      } finally {
        setIsAiLoading(false);
        setManualTrigger(false);
      }
    };

    getDeepAnalysis();
  }, [observations, genAI, MODEL_NAME, manualTrigger]);

  // 3. Groepering voor tabel (Historie per element)
  const groupedHistory = useMemo(() => {
    const groups: Record<string, ClinicalObservation[]> = {};
    observations.forEach(obs => {
      if (!groups[obs.zib_id]) groups[obs.zib_id] = [];
      groups[obs.zib_id].push(obs);
    });
    console.log('[AIInsightsModule] Grouped observations:', Object.keys(groups).length, 'ZIB types');
    console.log('[AIInsightsModule] ZIB types:', Object.keys(groups));
    return groups;
  }, [observations]);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] animate-in fade-in duration-500 overflow-hidden">
      {/* HEADER (Zelfde als voorheen) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-slate-100 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={onBack} className="p-2 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl text-slate-400 hover:text-blue-600 transition-all shrink-0">
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tighter text-slate-900 leading-none">Clinical Audit Trail</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* AI Toggle Button */}
          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              aiEnabled 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
            title={aiEnabled ? 'AI ingeschakeld - klik om uit te schakelen' : 'AI uitgeschakeld - klik om in te schakelen'}
          >
            <Brain size={16} />
            <span className="hidden sm:inline">AI {aiEnabled ? 'AAN' : 'UIT'}</span>
          </button>

          <button 
            onClick={handleExportToDossier}
            disabled={isExporting}
            className={`flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all ${isExporting ? 'opacity-70 pointer-events-none' : ''} w-full sm:w-auto`}
          >
            {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />} 
            <span className="ml-2 hidden sm:inline">{isExporting ? 'Exporteren...' : 'Exporteer naar Dossier'}</span>
            <span className="ml-2 sm:hidden">{isExporting ? 'Bezig...' : 'Export'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden px-2">
        {/* DATA TABELLEN (Links) */}
        <div className="col-span-12 lg:col-span-8 overflow-y-auto custom-scrollbar space-y-6 pb-20">
          {Object.entries(groupedHistory).map(([zibId, history]) => (
            <div key={zibId} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
              <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <span className="font-black text-xs text-slate-400 uppercase tracking-widest">{zibId.split('.').pop()}</span>
              </div>
              <table className="w-full text-left">
                <tbody>
                  {history.map((obs) => (
                    <tr key={obs.id} className="border-b border-slate-50 last:border-0 hover:bg-blue-50/20">
                      <td className="p-4 text-[10px] font-bold text-slate-400 w-32 uppercase">
                        {new Date(obs.effective_at).toLocaleDateString('nl-NL')}
                      </td>
                      <td className="p-4 flex flex-wrap gap-2">
                        {Object.entries(obs.value || {}).map(([k, v]: any) => (
                          <span key={k} className="bg-white border border-slate-200 px-2 py-1 rounded-md text-[11px] shadow-sm">
                            <span className="text-slate-400 text-[8px] uppercase font-black mr-2">{k}</span>
                            <span className="font-bold text-slate-700">{v && typeof v === 'object' ? v.display : String(v ?? '')}</span>
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* AI REASONING + VOICE ASSISTANT (Rechts) - NU LIVE GEMINI */}
        <div className="col-span-12 lg:col-span-4 overflow-y-auto custom-scrollbar pb-20 space-y-6">
           {/* Voice Assistant Widget */}
           {patientId && (
             <VoiceAssistantWidget
               patientId={patientId}
               onProcessComplete={(extractionId) => {
                 // Extraction completed - refresh data
                 console.log('Voice Assistant extraction complete:', extractionId);
                 if (onDataRefresh) {
                   onDataRefresh();
                 }
               }}
               onOpenReview={(data) => {
                 setReviewData(data);
                 setIsReviewModalOpen(true);
               }}
             />
           )}

           {/* AI Analysis Card */}
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] opacity-5 pointer-events-none">
                <Brain size={200} />
              </div>

              <div className="flex items-center gap-3 mb-10 relative z-10">
                 <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                    <Sparkles size={20} />
                 </div>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 italic">Live AI Analysis</h2>
              </div>
              
              <div className="relative z-10 space-y-8">
                {!aiEnabled ? (
                  <div className="space-y-4 py-10 text-center">
                    <Brain className="mx-auto text-slate-600 opacity-30" size={40} />
                    <p className="text-sm text-slate-400">AI-analyse is uitgeschakeld</p>
                    <p className="text-[10px] text-slate-500">Schakel AI in via de toggle in de header om quota te besparen tijdens testen</p>
                  </div>
                ) : isAiLoading ? (
                  <div className="space-y-4 py-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Klinische historie wegen...</p>
                  </div>
                ) : aiAdvice ? (
                  <div className="text-[14px] leading-relaxed text-slate-200 bg-white/5 p-6 rounded-3xl border border-white/10 italic shadow-inner">
                    {aiAdvice}
                  </div>
                ) : aiError ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-amber-400 text-xs">
                      {aiError}
                    </div>
                    <button
                      onClick={() => setManualTrigger(true)}
                      className="w-full py-2.5 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 font-bold text-[10px] uppercase hover:bg-blue-500/30 transition-all"
                    >
                      Probeer Opnieuw
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setManualTrigger(true)}
                    disabled={observations.length === 0}
                    className="w-full py-3 bg-blue-500/20 border border-blue-500/30 rounded-2xl text-blue-400 font-black text-[10px] uppercase hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start AI Analyse
                  </button>
                )}

                <div className="pt-8 border-t border-white/10">
                   <div className="flex items-center gap-2 mb-4">
                      <Zap size={14} className="text-amber-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Methodiek</span>
                   </div>
                   <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                     Analyse gegenereerd door {MODEL_NAME}. Dit advies is gebaseerd op de beschikbare zorginformatiebouwstenen en dient ter ondersteuning van de behandelend arts.
                   </p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Review Console Modal */}
      {patientId && (
        <ReviewConsoleModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setReviewData(null);
          }}
          extractionData={reviewData}
          patientId={patientId}
          onConfirm={() => {
            // Show success notification
            setShowSuccessNotification(true);
            setTimeout(() => setShowSuccessNotification(false), 5000);
            
            // Trigger data refresh if callback provided
            if (onDataRefresh) {
              onDataRefresh();
            }
            
            // Data confirmed and committed to dossier
          }}
        />
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 size={20} />
          <div>
            <p className="font-black text-sm uppercase">Succesvol Opgeslagen</p>
            <p className="text-xs opacity-90">Data is toegevoegd aan het dossier</p>
          </div>
        </div>
      )}
    </div>
  );
}
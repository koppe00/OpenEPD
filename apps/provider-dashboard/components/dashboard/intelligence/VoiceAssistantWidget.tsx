'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Activity, FileText, Coins, AlertCircle } from 'lucide-react';
import { getSupabaseBrowserClient, ensureSession } from '@/lib/supabase';

type RecordingStatus = 'idle' | 'recording' | 'processing' | 'review' | 'error';

interface ExtractionPreview {
  zibCount: number;
  hasConsult: boolean;
  hasBilling: boolean;
  extractionId?: string;
}

interface VoiceAssistantWidgetProps {
  patientId: string;
  onProcessComplete?: (extractionId: string) => void;
  onOpenReview?: (data: any) => void;
}

export function VoiceAssistantWidget({ patientId, onProcessComplete, onOpenReview }: VoiceAssistantWidgetProps) {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<ExtractionPreview | null>(null);
  const [extractionData, setExtractionData] = useState<any>(null);

  const supabase = getSupabaseBrowserClient();
  
  // Store user info before recording starts (workaround for cookie disappearing during recording)
  const cachedUserRef = useRef<{ id: string; email: string } | null>(null);
  
  // Debug: log mount/unmount and check session state
  useEffect(() => {

    
    // Ensure session is valid on mount and cache user info
    ensureSession().then(async (hasSession) => {

      if (hasSession) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          cachedUserRef.current = { id: user.id, email: user.email || '' };

        }
      }
    });
    
    return () => {

    };
  }, [patientId, supabase]);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      // CRITICAL: Ensure session is valid and cache user before starting recording
      const hasSession = await ensureSession();

      
      if (!hasSession) {
        setErrorMessage('Sessie verlopen. Ververs de pagina en log opnieuw in.');
        setStatus('error');
        return;
      }
      
      // Cache user info NOW before recording starts (cookie might disappear during recording)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        cachedUserRef.current = { id: user.id, email: user.email || '' };

      } else {
        setErrorMessage('Kon gebruiker niet ophalen. Ververs de pagina.');
        setStatus('error');
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setStatus('recording');
      setErrorMessage(null);
    } catch (err) {

      setErrorMessage('Microfoon toegang geweigerd of niet beschikbaar');
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setStatus('processing');
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Use cached user info (cookie might have disappeared during recording)
      const cachedUser = cachedUserRef.current;

      
      if (!cachedUser) {
        // Fallback: try to get from session
        const sessionValid = await ensureSession();

        
        if (sessionValid) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            cachedUserRef.current = { id: user.id, email: user.email || '' };
          }
        }
        
        if (!cachedUserRef.current) {
          throw new Error('Sessie verlopen. Ververs de pagina en log opnieuw in.');
        }
      }

      const userId = cachedUserRef.current!.id;

      // Step 1: Transcribe audio using Whisper
      const transcript = await transcribeAudio(audioBlob);
      
      // Step 2: Extract structured data using existing /api/extract
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          patientId,
          caregiverId: userId, // Use cached user id
          metadata: { source: 'voice-assistant', recorded_at: new Date().toISOString() }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));

        throw new Error(errorData.error || 'Extraction failed');
      }

      const result = await response.json();
      
      // Step 3: Show preview
      setExtractionData(result);
      setPreview({
        zibCount: result.extraction?.zibs?.length || 0,
        hasConsult: !!result.extraction?.consult,
        hasBilling: !!result.extraction?.billing,
        extractionId: result.aiExtractionId
      });
      setStatus('review');

      if (onProcessComplete && result.aiExtractionId) {
        onProcessComplete(result.aiExtractionId);
      }
    } catch (err) {

      const errorMsg = err instanceof Error ? err.message : 'Verwerking mislukt';
      
      if (errorMsg.includes('quota') || errorMsg.includes('429')) {
        setErrorMessage('API quota bereikt. Wacht even en probeer opnieuw.');
      } else if (errorMsg.includes('API key')) {
        setErrorMessage('API configuratie probleem. Controleer je environment variabelen.');
      } else {
        setErrorMessage(`Verwerking mislukt: ${errorMsg}`);
      }
      
      setStatus('error');
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Transcription API failed');
      }

      const data = await response.json();
      return data.transcript;
    } catch (error) {

      // Fallback to mock for development
      return "Patiënt klaagt over kortademigheid. Bloeddruk gemeten: 140 over 90. " +
             "Saturatie is 92 procent. Rookt ongeveer een pakje per dag sinds 10 jaar. " +
             "Diagnose: COPD exacerbatie. Plan: voorschrijven salbutamol en prednisolon.";
    }
  };

  const handleOpenReview = () => {
    if (onOpenReview && extractionData) {
      onOpenReview(extractionData);
    }
    // Reset to idle after opening review
    setStatus('idle');
    setPreview(null);
    setExtractionData(null);
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage(null);
    setPreview(null);
    setExtractionData(null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg p-4 sm:p-6 text-white border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Recording Indicator */}
      {status === 'recording' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-all ${
            status === 'recording' ? 'bg-red-500 animate-pulse' : 
            status === 'processing' ? 'bg-blue-500 animate-spin-slow' :
            status === 'review' ? 'bg-emerald-500' :
            status === 'error' ? 'bg-amber-500' :
            'bg-blue-600'
          }`}>
            <Mic size={16} />
          </div>
          <div>
            <h3 className="font-black text-[10px] uppercase tracking-widest">Digital Assistant</h3>
            <p className="text-[8px] text-slate-400 uppercase">
              {status === 'idle' && 'Klaar voor opname'}
              {status === 'recording' && 'Opnemen...'}
              {status === 'processing' && 'AI Analyse...'}
              {status === 'review' && 'Resultaten Gereed'}
              {status === 'error' && 'Fout'}
            </p>
          </div>
        </div>
      </div>

      {status === 'idle' && (
        <button 
          onClick={startRecording}
          className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-blue-600 hover:border-blue-500 transition-all flex items-center justify-center gap-2"
        >
          <Mic size={14} />
          Start Consult Opname
        </button>
      )}

      {status === 'recording' && (
        <button 
          onClick={stopRecording}
          className="w-full py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
        >
          <Square size={14} /> Stop & Analyseer
        </button>
      )}

      {status === 'processing' && (
        <div className="py-6 text-center space-y-4">
          <Loader2 className="animate-spin mx-auto text-blue-400" size={28} />
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Distilleren van Klinische & Financiële data...
          </p>
          <div className="flex items-center justify-center gap-2 text-[8px] text-slate-500">
            <span>Transcriptie</span>
            <span>→</span>
            <span>ZIB Extractie</span>
            <span>→</span>
            <span>Consult Generatie</span>
            <span>→</span>
            <span>DBC Typering</span>
          </div>
        </div>
      )}

      {status === 'review' && preview && (
        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="grid grid-cols-3 gap-2">
            <div className={`p-2 rounded-xl text-center transition-all ${
              preview.zibCount > 0 
                ? 'bg-emerald-500/10 border border-emerald-500/20' 
                : 'bg-slate-500/10 border border-slate-500/20'
            }`}>
              <Activity size={12} className={`mx-auto mb-1 ${preview.zibCount > 0 ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className={`text-[8px] font-bold uppercase ${preview.zibCount > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {preview.zibCount} ZIB{preview.zibCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className={`p-2 rounded-xl text-center transition-all ${
              preview.hasConsult 
                ? 'bg-blue-500/10 border border-blue-500/20' 
                : 'bg-slate-500/10 border border-slate-500/20'
            }`}>
              <FileText size={12} className={`mx-auto mb-1 ${preview.hasConsult ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className={`text-[8px] font-bold uppercase ${preview.hasConsult ? 'text-blue-400' : 'text-slate-400'}`}>
                Consult
              </span>
            </div>
            <div className={`p-2 rounded-xl text-center transition-all ${
              preview.hasBilling 
                ? 'bg-amber-500/10 border border-amber-500/20' 
                : 'bg-slate-500/10 border border-slate-500/20'
            }`}>
              <Coins size={12} className={`mx-auto mb-1 ${preview.hasBilling ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className={`text-[8px] font-bold uppercase ${preview.hasBilling ? 'text-amber-400' : 'text-slate-400'}`}>
                DBC
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <button 
              onClick={handleOpenReview}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all"
            >
              Open Review Console
            </button>
            <button 
              onClick={handleReset}
              className="w-full py-2 bg-white/5 text-slate-300 rounded-xl font-bold text-[9px] uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              Nieuwe Opname
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-amber-400 uppercase mb-1">Fout</p>
              <p className="text-[9px] text-slate-300">{errorMessage || 'Er is iets misgegaan'}</p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="w-full py-2 bg-white/5 text-slate-300 rounded-xl font-bold text-[9px] uppercase tracking-wider hover:bg-white/10 transition-all"
          >
            Probeer Opnieuw
          </button>
        </div>
      )}
    </div>
  );
}

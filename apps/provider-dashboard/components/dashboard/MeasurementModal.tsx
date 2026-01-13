'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { X, ShieldCheck, Search, ChevronRight, Activity, ChevronDown, FileText, FormInput } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

// Imports uit je Core Library
import { 
  ZibValidationService, 
  ZIB_CONFIG, 
  ZibField,      
} from '@openepd/clinical-core';

type ZibValue = string | number | boolean | undefined;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onSaveSuccess: () => void;
  initialZibId?: string;
}

const ALL_ZIB_IDS = ZibValidationService.getSupportedZibs();

type InputMode = 'structured' | 'freeText';

export const MeasurementModal = ({ isOpen, onClose, patientId, onSaveSuccess, initialZibId }: Props) => {
  const [inputMode, setInputMode] = useState<InputMode>('structured');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZibId, setSelectedZibId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, ZibValue>>({});
  const [freeTextInput, setFreeTextInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseBrowserClient();

  // Parse free text input using AI extraction engine
  const parseFreeText = useCallback(async (text: string) => {
    if (!text.trim()) {
      setFormData({});
      setSelectedZibId(null);
      return;
    }

    setIsParsing(true);
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: text,
          patientId,
          context: {
            specialisme: 'algemeen', // Could be made dynamic based on user context
            werkcontext: 'poli'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Parsing failed');
      }

      const result = await response.json();
      
      // Find the most relevant ZIB from the extraction results
      if (result.extraction?.zibs?.length > 0) {
        const extractedZib = result.extraction.zibs[0];
        setSelectedZibId(extractedZib.zib_id);
        setFormData(extractedZib.values || {});
        setError(null); // Clear any previous errors
      } else {
        setSelectedZibId(null);
        setFormData({});
        setError("Geen ZIB herkend in de tekst. Probeer specifieker te zijn, bijvoorbeeld: 'bloeddruk 140/85 mmHg'");
      }
    } catch (err) {
      console.error('Free text parsing error:', err);
      setError("Fout bij het analyseren van tekst. Controleer je internetverbinding en probeer opnieuw.");
    } finally {
      setIsParsing(false);
    }
  }, [patientId]);

  // Debounced parsing for free text input
  useEffect(() => {
    if (inputMode === 'freeText' && freeTextInput.trim()) {
      const timeoutId = setTimeout(() => {
        parseFreeText(freeTextInput);
      }, 1000); // Wait 1 second after user stops typing

      return () => clearTimeout(timeoutId);
    }
  }, [freeTextInput, inputMode, parseFreeText]);

  // Set initial ZIB when modal opens
  useEffect(() => {
    if (isOpen && initialZibId) {
      setSelectedZibId(initialZibId);
    }
  }, [isOpen, initialZibId]);

  // Configuratie ophalen (UI Config > Service Fallback)
  const currentFields = useMemo<ZibField[]>(() => {
    if (!selectedZibId) return [];
    
    if (ZIB_CONFIG[selectedZibId]) {
      return ZIB_CONFIG[selectedZibId];
    }

    return ZibValidationService.getFieldsForZib(selectedZibId) as unknown as ZibField[];
  }, [selectedZibId]);

  // Reset form data when switching input modes or ZIB selection
  useEffect(() => {
    if (selectedZibId) {
      const initialData: Record<string, ZibValue> = {};
      currentFields.forEach(field => {
        if (field.type === 'select' && field.options && field.options.length > 0) {
          initialData[field.name] = field.options[0].value;
        } else if (field.type === 'boolean') {
          initialData[field.name] = false;
        } else {
          initialData[field.name] = '';
        }
      });
      // Only reset if we're in structured mode or if no data exists yet
      if (inputMode === 'structured' || Object.keys(formData).length === 0) {
        setFormData(initialData);
      }
      setError(null);
    }
  }, [selectedZibId, currentFields, inputMode]);

  // Reset when switching modes
  useEffect(() => {
    if (inputMode === 'freeText') {
      setSelectedZibId(null);
      setFormData({});
      setFreeTextInput('');
    }
  }, [inputMode]);

  const filteredZibs = useMemo(() => {
    return ALL_ZIB_IDS.filter(id => 
      id.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort();
  }, [searchTerm]);

  const handleSave = async () => {
    const zibIdToUse = selectedZibId;
    if (!zibIdToUse) {
      setError("Selecteer eerst een ZIB of typ vrije tekst om automatisch een ZIB te laten herkennen.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Haal de huidige arts/gebruiker op voor de 'caregiver_id'
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Geen actieve sessie gevonden. Log opnieuw in.");
      }

      // 2. Bereid data voor via de service (die voegt versies, status en IDs toe)
      const finalZibObject = ZibValidationService.prepareForStorage(
        patientId,
        user.id, // Dit lost de 'caregiver_id' null constraint op
        zibIdToUse,
        formData
      );

      // 3. Insert in de database
      const { error: dbError } = await supabase
        .from('zib_compositions')
        .insert(finalZibObject);

      if (dbError) {
        console.error("Database Error:", dbError);
        throw new Error(`Opslaan mislukt: ${dbError.message}`);
      }

      onSaveSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Er is een onbekende fout opgetreden.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSafeValue = (val: ZibValue): string | number => {
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    return val ?? '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-0 sm:p-6 backdrop-blur-xl bg-slate-900/40">
      <div className="bg-white w-full h-full sm:h-[85vh] sm:max-h-[85vh] sm:max-w-5xl rounded-none sm:rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 sm:p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">ZIB 2024 Registry</span>
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Sovereign Data Entry</h2>
          </div>
          <button onClick={onClose} className="p-4 sm:p-4 hover:bg-white rounded-full transition-all text-slate-300 touch-manipulation">
            <X size={24} />
          </button>
        </div>

        {/* Input Mode Tabs */}
        <div className="px-6 sm:px-10 py-4 border-b border-slate-50 bg-white">
          <div className="flex gap-1">
            <button
              onClick={() => setInputMode('structured')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                inputMode === 'structured' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FormInput size={16} />
              Structured
            </button>
            <button
              onClick={() => setInputMode('freeText')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                inputMode === 'freeText' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText size={16} />
              Free Text
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {inputMode === 'structured' ? (
            <>
              {/* LINKERKANT - Structured Mode */}
              <div className="w-2/5 border-r border-slate-50 flex flex-col p-8 bg-white">
                <div className="relative mb-6">
                  <Search className="absolute left-6 top-5 text-slate-300" size={20} />
                  <input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Zoek in 120+ ZIB's..."
                    className="w-full bg-slate-50 rounded-3xl py-5 pl-14 pr-6 text-sm font-bold outline-none ring-blue-500/10 focus:ring-4 transition-all"
                  />
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {filteredZibs.map(id => (
                    <button
                      key={id}
                      onClick={() => setSelectedZibId(id)}
                      className={`w-full text-left p-5 rounded-2xl flex justify-between items-center transition-all ${
                        selectedZibId === id ? 'bg-slate-900 text-white shadow-lg translate-x-2' : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{id.replace('nl.zorg.', '')}</span>
                      <ChevronRight size={16} className={selectedZibId === id ? 'text-blue-400' : 'text-slate-200'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* RECHTERKANT - Structured Mode */}
              <div className="w-3/5 p-10 bg-slate-50/30 flex flex-col overflow-y-auto">
                {selectedZibId ? (
                  <div className="space-y-8 animate-in slide-in-from-right duration-500">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="p-3 bg-blue-500 rounded-2xl text-white">
                         <Activity size={24} />
                       </div>
                       <h3 className="text-2xl font-black italic uppercase tracking-tighter">
                         {selectedZibId.split('.').pop()}
                       </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      {currentFields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                            {field.label} {field.unit && `(${field.unit})`}
                          </label>

                          {field.type === 'select' && field.options ? (
                            <div className="relative group">
                              <select
                                value={getSafeValue(formData[field.name])}
                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                className="w-full bg-slate-50 border-2 border-transparent rounded-3xl px-8 py-5 text-sm font-bold shadow-sm outline-none focus:bg-white focus:border-blue-500/20 focus:ring-4 ring-blue-500/5 transition-all appearance-none cursor-pointer"
                              >
                                <option value="" disabled>Selecteer optie...</option>
                                {field.options.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown size={18} />
                              </div>
                            </div>
                          ) : field.type === 'boolean' ? (
                             <button
                                type="button"
                                onClick={() => setFormData({...formData, [field.name]: !formData[field.name]})}
                                className={`w-full py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] transition-all shadow-sm ${
                                  formData[field.name] ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'
                                }`}
                              >
                                {formData[field.name] ? 'JA' : 'NEE'}
                              </button>
                          ) : (
                           <input
                              // We mappen onze ZIB-types naar de juiste HTML5 input types
                              type={
                                field.type === 'datetime' ? 'datetime-local' : 
                                field.type === 'number' ? 'number' : 
                                field.type === 'date' ? 'date' : 'text'
                              }
                              value={getSafeValue(formData[field.name])}
                              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                              placeholder={`Voer ${field.label.toLowerCase()} in...`}
                              className="w-full bg-slate-50 border-2 border-transparent rounded-3xl px-8 py-5 text-sm font-bold shadow-sm outline-none focus:bg-white focus:border-blue-500/20 focus:ring-4 ring-blue-500/5 transition-all"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {error && (
                      <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                        ⚠️ {error}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <Activity size={64} strokeWidth={1} className="mb-6 opacity-10 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Selecteer bouwsteen</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* LINKERKANT - Free Text Mode */}
              <div className="w-2/5 border-r border-slate-50 flex flex-col p-8 bg-white">
                <div className="mb-6">
                  <h3 className="text-lg font-black uppercase tracking-tighter mb-2">Vrije Tekst Invoer</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Beschrijf de meting in natuurlijke taal. Het systeem herkent automatisch de juiste ZIB en vult de velden in.
                  </p>
                </div>
                
                <div className="flex-1">
                  <textarea
                    value={freeTextInput}
                    onChange={(e) => setFreeTextInput(e.target.value)}
                    placeholder="Bijvoorbeeld: 'Patiënt heeft een bloeddruk van 140/85 mmHg, hartslag 72 slagen per minuut, temperatuur 36.8 graden Celsius...'"
                    className="w-full h-full bg-slate-50 border-2 border-transparent rounded-3xl p-6 text-sm font-bold outline-none focus:bg-white focus:border-blue-500/20 focus:ring-4 ring-blue-500/5 transition-all resize-none"
                  />
                </div>

                {isParsing && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Activity size={16} className="animate-spin" />
                      <span className="text-sm font-bold">Bezig met analyseren...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* RECHTERKANT - Free Text Mode */}
              <div className="w-3/5 p-10 bg-slate-50/30 flex flex-col overflow-y-auto">
                {selectedZibId ? (
                  <div className="space-y-8 animate-in slide-in-from-right duration-500">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="p-3 bg-green-500 rounded-2xl text-white">
                         <Activity size={24} />
                       </div>
                       <div>
                         <h3 className="text-2xl font-black italic uppercase tracking-tighter">
                           {selectedZibId.split('.').pop()}
                         </h3>
                         <p className="text-sm text-slate-600 mt-1">Automatisch herkend uit tekst</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      {currentFields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                            {field.label} {field.unit && `(${field.unit})`}
                          </label>

                          {field.type === 'select' && field.options ? (
                            <div className="relative group">
                              <select
                                value={getSafeValue(formData[field.name])}
                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                className="w-full bg-slate-50 border-2 border-transparent rounded-3xl px-8 py-5 text-sm font-bold shadow-sm outline-none focus:bg-white focus:border-blue-500/20 focus:ring-4 ring-blue-500/5 transition-all appearance-none cursor-pointer"
                              >
                                <option value="" disabled>Selecteer optie...</option>
                                {field.options.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown size={18} />
                              </div>
                            </div>
                          ) : field.type === 'boolean' ? (
                             <button
                                type="button"
                                onClick={() => setFormData({...formData, [field.name]: !formData[field.name]})}
                                className={`w-full py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] transition-all shadow-sm ${
                                  formData[field.name] ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'
                                }`}
                              >
                                {formData[field.name] ? 'JA' : 'NEE'}
                              </button>
                          ) : (
                           <input
                              type={
                                field.type === 'datetime' ? 'datetime-local' : 
                                field.type === 'number' ? 'number' : 
                                field.type === 'date' ? 'date' : 'text'
                              }
                              value={getSafeValue(formData[field.name])}
                              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                              placeholder={`Voer ${field.label.toLowerCase()} in...`}
                              className="w-full bg-slate-50 border-2 border-transparent rounded-3xl px-8 py-5 text-sm font-bold shadow-sm outline-none focus:bg-white focus:border-blue-500/20 focus:ring-4 ring-blue-500/5 transition-all"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {error && (
                      <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                        ⚠️ {error}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <FileText size={64} strokeWidth={1} className="mb-6 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Typ vrije tekst om te beginnen</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-10 bg-slate-50 border-t border-slate-100">
           <button 
             disabled={(!selectedZibId && inputMode === 'structured') || (!selectedZibId && inputMode === 'freeText' && !freeTextInput.trim()) || isSubmitting}
             onClick={handleSave}
             className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-20 hover:-translate-y-1 active:translate-y-0"
           >
             {isSubmitting ? 'Verifiëren & Encrypten...' : 'Commit to Sovereign Vault'}
           </button>
        </div>
      </div>
    </div>
  );
};
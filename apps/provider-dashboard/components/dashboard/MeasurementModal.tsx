'use client';

import { useState, useMemo, useEffect } from 'react';
import { X, ShieldCheck, Search, ChevronRight, Activity, ChevronDown } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

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
}

const ALL_ZIB_IDS = ZibValidationService.getSupportedZibs();

export const MeasurementModal = ({ isOpen, onClose, patientId, onSaveSuccess }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZibId, setSelectedZibId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, ZibValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Configuratie ophalen (UI Config > Service Fallback)
  const currentFields = useMemo<ZibField[]>(() => {
    if (!selectedZibId) return [];
    
    if (ZIB_CONFIG[selectedZibId]) {
      return ZIB_CONFIG[selectedZibId];
    }

    return ZibValidationService.getFieldsForZib(selectedZibId) as unknown as ZibField[];
  }, [selectedZibId]);

  // Default waarden instellen bij wissel van ZIB
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
      setFormData(initialData);
      setError(null);
    }
  }, [selectedZibId, currentFields]);

  const filteredZibs = useMemo(() => {
    return ALL_ZIB_IDS.filter(id => 
      id.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort();
  }, [searchTerm]);

  const handleSave = async () => {
    if (!selectedZibId) return;
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
        selectedZibId,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
      <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">ZIB 2024 Registry</span>
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Sovereign Data Entry</h2>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white rounded-full transition-all text-slate-300">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LINKERKANT */}
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

          {/* RECHTERKANT */}
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
        </div>

        {/* Footer */}
        <div className="p-10 bg-slate-50 border-t border-slate-100">
           <button 
             disabled={!selectedZibId || isSubmitting}
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
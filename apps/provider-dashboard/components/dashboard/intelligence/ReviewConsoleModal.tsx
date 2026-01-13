'use client';

import React, { useState } from 'react';
import { X, Check, AlertTriangle, Activity, FileText, Coins, ChevronRight } from 'lucide-react';

interface ReviewConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  extractionData: any;
  patientId: string;
  onConfirm?: () => void;
}

export function ReviewConsoleModal({ isOpen, onClose, extractionData, patientId, onConfirm }: ReviewConsoleModalProps) {
  const [selectedZibs, setSelectedZibs] = useState<Set<number>>(new Set());
  const [consultApproved, setConsultApproved] = useState(false);
  const [billingApproved, setBillingApproved] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitError, setCommitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const extraction = extractionData?.extraction || {};
  const allZibs = extraction.zibs || [];
  
  // Separate clinical ZIBs from consult and billing ZIBs
  const clinicalZibs = allZibs.filter((z: any) => 
    z.zib_id !== 'nl.zorg.PoliklinischConsult' && z.zib_id !== 'nl.zorg.DBCDeclaratie'
  );
  const consultZib = allZibs.find((z: any) => z.zib_id === 'nl.zorg.PoliklinischConsult');
  const billingZib = allZibs.find((z: any) => z.zib_id === 'nl.zorg.DBCDeclaratie');
  
  // Extract values for backward compatibility
  const zibs = clinicalZibs;
  const consult = consultZib?.values || null;
  const billing = billingZib?.values || null;

  const toggleZib = (index: number) => {
    const newSet = new Set(selectedZibs);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedZibs(newSet);
  };

  const handleConfirmAll = async () => {
    setIsCommitting(true);
    setCommitError(null);

    try {
      // The data is already saved in the database by the /api/extract call
      // We just trigger the parent refresh

      // Small delay to show confirmation
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('[ReviewConsole] Confirming data, triggering refresh...');
      if (onConfirm) {
        onConfirm();
      }
      
      onClose();
    } catch (error) {
      console.error('Commit error:', error);
      setCommitError('Fout bij opslaan. Probeer opnieuw.');
    } finally {
      setIsCommitting(false);
    }
  };

  const allApproved = selectedZibs.size === zibs.length && consultApproved && billingApproved;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight">Review Console</h2>
              <p className="text-[10px] text-slate-300 uppercase tracking-widest">Valideer AI Extractie</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            
            {/* Column 1: Klinische Data (ZIBs) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-emerald-50 border-b-2 border-emerald-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500 rounded text-white">
                    <Activity size={14} />
                  </div>
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-900">
                    Klinische Data ({zibs.length})
                  </h3>
                </div>
                <span className="text-[8px] font-bold text-emerald-600 uppercase">
                  {selectedZibs.size}/{zibs.length} Goedgekeurd
                </span>
              </div>

              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {zibs.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-8">
                    Geen ZIB data geëxtraheerd
                  </p>
                )}
                {zibs.map((zib: any, index: number) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedZibs.has(index)
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-emerald-300 bg-white'
                    }`}
                    onClick={() => toggleZib(index)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-700">
                          {zib.zib_id || 'Unknown ZIB'}
                        </p>
                      </div>
                      <div className={`p-1 rounded ${selectedZibs.has(index) ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        <Check size={10} className={selectedZibs.has(index) ? 'text-white' : 'text-slate-400'} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(zib.values || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-[8px] text-slate-500 uppercase font-bold">{key}:</span>
                          <span className="text-[9px] text-slate-900 font-semibold">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Narratieve Verslaglegging (2e Lijns Consult) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-blue-50 border-b-2 border-blue-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500 rounded text-white">
                    <FileText size={14} />
                  </div>
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-blue-900">
                    Consult Verslag
                  </h3>
                </div>
                <button
                  onClick={() => setConsultApproved(!consultApproved)}
                  className={`p-1 rounded ${consultApproved ? 'bg-blue-500' : 'bg-slate-200'}`}
                >
                  <Check size={10} className={consultApproved ? 'text-white' : 'text-slate-400'} />
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                {!consult && (
                  <p className="text-xs text-slate-400 italic text-center py-8">
                    Geen consult verslag gegenereerd
                  </p>
                )}
                {consult && (
                  <>
                    <div className="mb-3 pb-3 border-b border-slate-200 flex items-center gap-2">
                      {consult.specialisme && (
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-[9px] font-bold uppercase">
                          {consult.specialisme}
                        </span>
                      )}
                      {consult.contact_type && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-[9px] font-bold">
                          {consult.contact_type}
                        </span>
                      )}
                    </div>
                    {consult.anamnese && (
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black uppercase tracking-wide text-blue-600">Anamnese</h4>
                        <p className="text-[10px] text-slate-700 leading-relaxed">{consult.anamnese}</p>
                      </div>
                    )}
                    {consult.lichamelijk_onderzoek && (
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black uppercase tracking-wide text-blue-600">Lichamelijk Onderzoek</h4>
                        <p className="text-[10px] text-slate-700 leading-relaxed">{consult.lichamelijk_onderzoek}</p>
                      </div>
                    )}
                    {consult.aanvullend_onderzoek && (
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black uppercase tracking-wide text-blue-600">Aanvullend Onderzoek</h4>
                        <p className="text-[10px] text-slate-700 leading-relaxed">{consult.aanvullend_onderzoek}</p>
                      </div>
                    )}
                    {consult.conclusie && (
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black uppercase tracking-wide text-blue-600">Conclusie</h4>
                        <p className="text-[10px] text-slate-700 leading-relaxed">{consult.conclusie}</p>
                      </div>
                    )}
                    {consult.beleid && (
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black uppercase tracking-wide text-blue-600">Beleid</h4>
                        <p className="text-[10px] text-slate-700 leading-relaxed">{consult.beleid}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Column 3: Financiële Data (DBC/ICD-10) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-amber-50 border-b-2 border-amber-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500 rounded text-white">
                    <Coins size={14} />
                  </div>
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-amber-900">
                    Financiële Codering
                  </h3>
                </div>
                <button
                  onClick={() => setBillingApproved(!billingApproved)}
                  className={`p-1 rounded ${billingApproved ? 'bg-amber-500' : 'bg-slate-200'}`}
                >
                  <Check size={10} className={billingApproved ? 'text-white' : 'text-slate-400'} />
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                {!billing && (
                  <p className="text-xs text-slate-400 italic text-center py-8">
                    Geen billing data geëxtraheerd
                  </p>
                )}
                {billing && (
                  <>
                    {billing.icd10_codes && billing.icd10_codes.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[9px] font-black uppercase tracking-wide text-amber-700">ICD-10 Codes</h4>
                        <div className="space-y-1">
                          {billing.icd10_codes.map((code: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-amber-50 rounded border border-amber-200">
                              <ChevronRight size={10} className="text-amber-500" />
                              <span className="text-[10px] font-bold text-amber-900">{code}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {billing.procedures && billing.procedures.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[9px] font-black uppercase tracking-wide text-amber-700">Verrichtingen</h4>
                        <div className="space-y-1">
                          {billing.procedures.map((proc: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-amber-50 rounded border border-amber-200">
                              <ChevronRight size={10} className="text-amber-500" />
                              <span className="text-[10px] font-semibold text-amber-900">{proc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {billing.dbc_code && (
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black uppercase tracking-wide text-amber-700">DBC Code</h4>
                        <div className="p-2 bg-amber-100 rounded border border-amber-300">
                          <span className="text-[11px] font-black text-amber-900">{billing.dbc_code}</span>
                        </div>
                      </div>
                    )}

                    {billing.care_type && (
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black uppercase tracking-wide text-amber-700">Zorgtype</h4>
                        <div className="p-2 bg-amber-50 rounded border border-amber-200">
                          <span className="text-[10px] font-semibold text-amber-900">{billing.care_type}</span>
                        </div>
                      </div>
                    )}

                    {(!billing.icd10 || billing.icd10.length === 0) && 
                     (!billing.procedures || billing.procedures.length === 0) && 
                     !billing.dbc_code && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2">
                        <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[9px] text-amber-800">
                          Geen specifieke financiële codes herkend. Handmatige review aanbevolen.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 p-6 flex flex-col gap-4">
          {commitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle size={16} />
              <span>{commitError}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {allApproved ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <Check size={16} />
                  <span className="text-xs font-bold uppercase">Alles goedgekeurd</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle size={16} />
                  <span className="text-xs font-bold uppercase">Review nog niet compleet</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={isCommitting}
                className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold text-xs uppercase hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuleren
              </button>
              <button
                onClick={handleConfirmAll}
                disabled={!allApproved || isCommitting}
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase transition-all flex items-center gap-2 ${
                  allApproved && !isCommitting
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isCommitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Bezig...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Bevestig & Commit naar Dossier</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

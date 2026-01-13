'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Shield, Briefcase, Building2, Users, MapPin, Star, X } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface AvailableContexts {
  roles: Array<{ id: string; display_name: string }>;
  specialisms: Array<{ id: string; display_name: string }>;
  organizations: Array<{ id: string; name: string }>;
  groups: Array<{ id: string; display_name: string }>;
  work_contexts: Array<{ id: string; display_name: string }>;
}

interface ContextSelectionModalProps {
  isOpen: boolean;
  userId: string;
  onComplete: () => void;
  onSkip?: () => void;
}

export function ContextSelectionModal({ isOpen, userId, onComplete, onSkip }: ContextSelectionModalProps) {
  const [loading, setLoading] = useState(true);
  const [contexts, setContexts] = useState<AvailableContexts | null>(null);
  const [selectedContext, setSelectedContext] = useState({
    role_id: '',
    specialism_id: '',
    organization_id: '',
    group_id: '',
    work_context_id: ''
  });
  const [rememberChoice, setRememberChoice] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (isOpen && userId) {
      fetchAvailableContexts();
    }
  }, [isOpen, userId]);

  const fetchAvailableContexts = async () => {
    setLoading(true);
    
    try {
      // Call the database function
      const { data, error } = await supabase.rpc('get_user_available_contexts', {
        p_user_id: userId
      });

      if (error) throw error;

      if (data) {
        setContexts(data);
        
        // Auto-select if only one option per context type
        const autoSelection: any = {};
        if (data.roles?.length === 1) autoSelection.role_id = data.roles[0].id;
        if (data.specialisms?.length === 1) autoSelection.specialism_id = data.specialisms[0].id;
        if (data.organizations?.length === 1) autoSelection.organization_id = data.organizations[0].id;
        if (data.groups?.length === 1) autoSelection.group_id = data.groups[0].id;
        if (data.work_contexts?.length === 1) autoSelection.work_context_id = data.work_contexts[0].id;
        
        setSelectedContext(prev => ({ ...prev, ...autoSelection }));

        // If everything is auto-selected and there's only 1 combo, auto-submit
        const totalOptions = 
          (data.roles?.length || 0) +
          (data.specialisms?.length || 0) +
          (data.organizations?.length || 0) +
          (data.groups?.length || 0) +
          (data.work_contexts?.length || 0);
        
        if (totalOptions === 5 && Object.keys(autoSelection).length === 5) {
          // Everything is single-choice, auto-save and close
          await saveSelection(autoSelection);
          onComplete();
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching contexts:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSelection = async (selection: any = selectedContext) => {
    try {
      // Delete existing active context
      await supabase
        .from('user_active_contexts')
        .delete()
        .eq('user_id', userId);

      // Insert new active context
      const { error } = await supabase
        .from('user_active_contexts')
        .insert({
          user_id: userId,
          active_role_id: selection.role_id || null,
          active_specialism_id: selection.specialism_id || null,
          active_organization_id: selection.organization_id || null,
          active_group_id: selection.group_id || null,
          active_work_context_id: selection.work_context_id || null,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;

      // Store in session/localStorage if remember is checked
      if (rememberChoice) {
        localStorage.setItem('preferred_context', JSON.stringify(selection));
      }
    } catch (error) {
      console.error('Error saving context:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      await saveSelection();
      onComplete();
    } catch (error: any) {
      alert('Fout bij opslaan context: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <Shield size={28} className="text-blue-600" />
                Selecteer je Werkcontext
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Kies de context waarin je wilt werken voor deze sessie
              </p>
            </div>
            {onSkip && (
              <button 
                onClick={onSkip}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Overslaan"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-10 space-y-6">
          {loading ? (
            <div className="text-center py-20 text-slate-400 font-bold">
              Beschikbare contexten laden...
            </div>
          ) : !contexts ? (
            <div className="text-center py-20 text-red-500 font-bold">
              Geen contexten gevonden. Neem contact op met je beheerder.
            </div>
          ) : (
            <>
              {/* Rol */}
              {contexts.roles && contexts.roles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-purple-600" />
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Systeemrol *
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {contexts.roles.map(role => (
                      <label
                        key={role.id}
                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                          selectedContext.role_id === role.id
                            ? 'bg-purple-50 border-purple-400 shadow-lg'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.id}
                          checked={selectedContext.role_id === role.id}
                          onChange={() => setSelectedContext({ ...selectedContext, role_id: role.id })}
                          className="w-5 h-5"
                        />
                        <span className="font-bold text-sm">{role.display_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialisme */}
              {contexts.specialisms && contexts.specialisms.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-600" />
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Specialisme *
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {contexts.specialisms.map(spec => (
                      <label
                        key={spec.id}
                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                          selectedContext.specialism_id === spec.id
                            ? 'bg-blue-50 border-blue-400 shadow-lg'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="specialism"
                          value={spec.id}
                          checked={selectedContext.specialism_id === spec.id}
                          onChange={() => setSelectedContext({ ...selectedContext, specialism_id: spec.id })}
                          className="w-5 h-5"
                        />
                        <span className="font-bold text-sm">{spec.display_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Organisatie */}
              {contexts.organizations && contexts.organizations.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-orange-600" />
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Organisatie *
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {contexts.organizations.map(org => (
                      <label
                        key={org.id}
                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                          selectedContext.organization_id === org.id
                            ? 'bg-orange-50 border-orange-400 shadow-lg'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="organization"
                          value={org.id}
                          checked={selectedContext.organization_id === org.id}
                          onChange={() => setSelectedContext({ ...selectedContext, organization_id: org.id })}
                          className="w-5 h-5"
                        />
                        <span className="font-bold text-sm">{org.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Groep (optioneel) */}
              {contexts.groups && contexts.groups.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-green-600" />
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Team/Groep (optioneel)
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        !selectedContext.group_id
                          ? 'bg-slate-100 border-slate-300 shadow-lg'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="group"
                        value=""
                        checked={!selectedContext.group_id}
                        onChange={() => setSelectedContext({ ...selectedContext, group_id: '' })}
                        className="w-5 h-5"
                      />
                      <span className="font-bold text-sm italic text-slate-600">Geen groep</span>
                    </label>
                    {contexts.groups.map(group => (
                      <label
                        key={group.id}
                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                          selectedContext.group_id === group.id
                            ? 'bg-green-50 border-green-400 shadow-lg'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="group"
                          value={group.id}
                          checked={selectedContext.group_id === group.id}
                          onChange={() => setSelectedContext({ ...selectedContext, group_id: group.id })}
                          className="w-5 h-5"
                        />
                        <span className="font-bold text-sm">{group.display_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Werkcontext (optioneel) */}
              {contexts.work_contexts && contexts.work_contexts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-cyan-600" />
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Werkcontext (optioneel)
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        !selectedContext.work_context_id
                          ? 'bg-slate-100 border-slate-300 shadow-lg'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="work_context"
                        value=""
                        checked={!selectedContext.work_context_id}
                        onChange={() => setSelectedContext({ ...selectedContext, work_context_id: '' })}
                        className="w-5 h-5"
                      />
                      <span className="font-bold text-sm italic text-slate-600">Geen werkcontext</span>
                    </label>
                    {contexts.work_contexts.map(wc => (
                      <label
                        key={wc.id}
                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                          selectedContext.work_context_id === wc.id
                            ? 'bg-cyan-50 border-cyan-400 shadow-lg'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="work_context"
                          value={wc.id}
                          checked={selectedContext.work_context_id === wc.id}
                          onChange={() => setSelectedContext({ ...selectedContext, work_context_id: wc.id })}
                          className="w-5 h-5"
                        />
                        <span className="font-bold text-sm">{wc.display_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Remember choice */}
              <div className="bg-slate-50 p-5 rounded-2xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberChoice}
                    onChange={e => setRememberChoice(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-bold text-slate-700">
                    <Star size={14} className="inline mr-1 text-yellow-500" />
                    Onthoud mijn keuze voor volgende keer
                  </span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedContext.role_id || !selectedContext.specialism_id || !selectedContext.organization_id}
            className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
          >
            <CheckCircle size={20} />
            Bevestigen en Doorgaan
          </button>
        </div>
      </div>
    </div>
  );
}

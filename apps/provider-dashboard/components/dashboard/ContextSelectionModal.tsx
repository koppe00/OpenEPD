'use client';

import React, { useState, useEffect } from 'react';
import { X, Shield, Briefcase, Building2, Users, MapPin, Check, RefreshCw } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

interface AvailableContexts {
  roles: Array<{ id: string; code: string; display_name: string; is_primary: boolean }>;
  specialisms: Array<{ id: string; code: string; display_name: string; is_primary: boolean }>;
  organizations: Array<{ id: string; name: string; is_primary: boolean }>;
  groups: Array<{ id: string; code: string; display_name: string; is_primary: boolean }>;
  work_contexts: Array<{ id: string; code: string; display_name: string; is_primary: boolean }>;
}

interface SelectedContext {
  role_id: string | null;
  specialism_id: string | null;
  organization_id: string | null;
  group_id: string | null;
  work_context_id: string | null;
}

interface ContextSelectionModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onContextChanged: () => void;
}

export function ContextSelectionModal({ userId, isOpen, onClose, onContextChanged }: ContextSelectionModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableContexts, setAvailableContexts] = useState<AvailableContexts | null>(null);
  const [selectedContext, setSelectedContext] = useState<SelectedContext>({
    role_id: null,
    specialism_id: null,
    organization_id: null,
    group_id: null,
    work_context_id: null
  });

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (isOpen) {
      fetchAvailableContexts();
    }
  }, [isOpen, userId]);

  const fetchAvailableContexts = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('get_user_available_contexts', {
        p_user_id: userId
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const contexts = data[0];
        setAvailableContexts({
          roles: contexts.roles || [],
          specialisms: contexts.specialisms || [],
          organizations: contexts.organizations || [],
          groups: contexts.groups || [],
          work_contexts: contexts.work_contexts || []
        });

        // Set primary contexts as default selection
        setSelectedContext({
          role_id: contexts.roles?.find((r: any) => r.is_primary)?.id || contexts.roles?.[0]?.id || null,
          specialism_id: contexts.specialisms?.find((s: any) => s.is_primary)?.id || contexts.specialisms?.[0]?.id || null,
          organization_id: contexts.organizations?.find((o: any) => o.is_primary)?.id || contexts.organizations?.[0]?.id || null,
          group_id: contexts.groups?.find((g: any) => g.is_primary)?.id || null,
          work_context_id: contexts.work_contexts?.find((w: any) => w.is_primary)?.id || null
        });
      }
    } catch (error) {
      console.error('Error fetching available contexts:', error);
      alert('Fout bij ophalen beschikbare contexten');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Update or insert active context
      const { error } = await supabase
        .from('user_active_contexts')
        .upsert({
          user_id: userId,
          active_role_id: selectedContext.role_id,
          active_specialism_id: selectedContext.specialism_id,
          active_organization_id: selectedContext.organization_id,
          active_group_id: selectedContext.group_id,
          active_work_context_id: selectedContext.work_context_id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      alert('Context succesvol gewijzigd!');
      onContextChanged();
      onClose();
    } catch (error: any) {
      console.error('Error saving active context:', error);
      alert('Fout bij opslaan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <RefreshCw className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-black text-slate-900">Wissel van Werkcontext</h2>
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Selecteer je actieve context
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="animate-spin text-slate-400" size={32} />
            </div>
          ) : !availableContexts ? (
            <p className="text-center text-slate-500 py-12">Geen contexten beschikbaar</p>
          ) : (
            <div className="space-y-6">
              {/* Roles */}
              {availableContexts.roles.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600 mb-3">
                    <Shield size={14} />
                    Systeemrol
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableContexts.roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedContext({ ...selectedContext, role_id: role.id })}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedContext.role_id === role.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 bg-white hover:border-purple-300'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-bold text-slate-900">{role.display_name}</p>
                          <p className="text-xs text-slate-500">{role.code}</p>
                          {role.is_primary && (
                            <span className="text-[8px] font-black uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded mt-1 inline-block">
                              Primair
                            </span>
                          )}
                        </div>
                        {selectedContext.role_id === role.id && (
                          <Check size={20} className="text-purple-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialisms */}
              {availableContexts.specialisms.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">
                    <Briefcase size={14} />
                    Specialisme
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableContexts.specialisms.map((spec) => (
                      <button
                        key={spec.id}
                        onClick={() => setSelectedContext({ ...selectedContext, specialism_id: spec.id })}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedContext.specialism_id === spec.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-bold text-slate-900">{spec.display_name}</p>
                          <p className="text-xs text-slate-500">{spec.code}</p>
                          {spec.is_primary && (
                            <span className="text-[8px] font-black uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block">
                              Primair
                            </span>
                          )}
                        </div>
                        {selectedContext.specialism_id === spec.id && (
                          <Check size={20} className="text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizations */}
              {availableContexts.organizations.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-600 mb-3">
                    <Building2 size={14} />
                    Organisatie
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableContexts.organizations.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => setSelectedContext({ ...selectedContext, organization_id: org.id })}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedContext.organization_id === org.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-bold text-slate-900">{org.name}</p>
                          {org.is_primary && (
                            <span className="text-[8px] font-black uppercase bg-orange-100 text-orange-700 px-2 py-0.5 rounded mt-1 inline-block">
                              Primair
                            </span>
                          )}
                        </div>
                        {selectedContext.organization_id === org.id && (
                          <Check size={20} className="text-orange-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Groups (optional) */}
              {availableContexts.groups.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600 mb-3">
                    <Users size={14} />
                    Team/Groep (optioneel)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedContext({ ...selectedContext, group_id: null })}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        selectedContext.group_id === null
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 bg-white hover:border-green-300'
                      }`}
                    >
                      <p className="font-bold text-slate-900">Geen groep</p>
                      {selectedContext.group_id === null && (
                        <Check size={20} className="text-green-600" />
                      )}
                    </button>
                    {availableContexts.groups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => setSelectedContext({ ...selectedContext, group_id: group.id })}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedContext.group_id === group.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-slate-200 bg-white hover:border-green-300'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-bold text-slate-900">{group.display_name}</p>
                          <p className="text-xs text-slate-500">{group.code}</p>
                        </div>
                        {selectedContext.group_id === group.id && (
                          <Check size={20} className="text-green-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Contexts (optional) */}
              {availableContexts.work_contexts.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-600 mb-3">
                    <MapPin size={14} />
                    Werkcontext (optioneel)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedContext({ ...selectedContext, work_context_id: null })}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        selectedContext.work_context_id === null
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-slate-200 bg-white hover:border-cyan-300'
                      }`}
                    >
                      <p className="font-bold text-slate-900">Geen werkcontext</p>
                      {selectedContext.work_context_id === null && (
                        <Check size={20} className="text-cyan-600" />
                      )}
                    </button>
                    {availableContexts.work_contexts.map((wc) => (
                      <button
                        key={wc.id}
                        onClick={() => setSelectedContext({ ...selectedContext, work_context_id: wc.id })}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedContext.work_context_id === wc.id
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-slate-200 bg-white hover:border-cyan-300'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-bold text-slate-900">{wc.display_name}</p>
                          <p className="text-xs text-slate-500">{wc.code}</p>
                        </div>
                        {selectedContext.work_context_id === wc.id && (
                          <Check size={20} className="text-cyan-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-3 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition-colors"
          >
            Annuleren
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedContext.role_id}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-wider hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Check size={16} />
                Context Activeren
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

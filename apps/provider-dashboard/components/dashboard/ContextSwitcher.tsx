'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Briefcase, Building2, Users, MapPin, RefreshCw, ChevronDown } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { ContextSelectionModal } from './ContextSelectionModal';

interface ActiveContext {
  role: string | null;
  specialism: string | null;
  organization: string | null;
  group: string | null;
  work_context: string | null;
}

interface ContextSwitcherProps {
  userId: string;
  onContextChange?: () => void;
}

export function ContextSwitcher({ userId, onContextChange }: ContextSwitcherProps) {
  const [activeContext, setActiveContext] = useState<ActiveContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    fetchActiveContext();
  }, [userId]);

  const fetchActiveContext = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('get_user_context', {
        p_user_id: userId
      });

      if (error) throw error;

      // Function returns array, take first row
      if (data && data.length > 0) {
        const context = data[0];
        setActiveContext({
          role: context.role_code || null,
          specialism: context.specialism_code || null,
          organization: context.organization_name || null,
          group: context.group_code || null,
          work_context: context.work_context_code || null
        });
      }
    } catch (error) {
      console.error('Error fetching active context:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchContext = () => {
    setShowDropdown(false);
    setShowModal(true);
  };

  const handleContextChanged = () => {
    fetchActiveContext();
    if (onContextChange) {
      onContextChange();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl animate-pulse">
        <RefreshCw size={14} className="animate-spin text-slate-400" />
        <span className="text-[9px] font-bold text-slate-400 uppercase">Context laden...</span>
      </div>
    );
  }

  if (!activeContext) {
    return (
      <button
        onClick={handleSwitchContext}
        className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors border border-amber-200"
      >
        <Shield size={14} />
        <span className="text-[9px] font-black uppercase tracking-wider">Context selecteren</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:shadow-md transition-all border border-blue-100"
      >
        <div className="flex flex-col items-start gap-0.5">
          <div className="flex items-center gap-2">
            {activeContext.role && (
              <span className="flex items-center gap-1 text-[9px] font-black uppercase text-purple-700">
                <Shield size={10} />
                {activeContext.role}
              </span>
            )}
            {activeContext.specialism && (
              <span className="flex items-center gap-1 text-[9px] font-black uppercase text-blue-700">
                <Briefcase size={10} />
                {activeContext.specialism}
              </span>
            )}
          </div>
          {activeContext.organization && (
            <span className="flex items-center gap-1 text-[8px] font-bold text-slate-600">
              <Building2 size={8} />
              {activeContext.organization}
            </span>
          )}
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                Actieve Werkcontext
              </h3>
            </div>
            
            <div className="p-4 space-y-3">
              {/* Role */}
              {activeContext.role && (
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                  <Shield size={16} className="text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold uppercase text-purple-600 tracking-wider">Systeemrol</p>
                    <p className="text-sm font-black text-slate-900">{activeContext.role}</p>
                  </div>
                </div>
              )}

              {/* Specialism */}
              {activeContext.specialism && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <Briefcase size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold uppercase text-blue-600 tracking-wider">Specialisme</p>
                    <p className="text-sm font-black text-slate-900">{activeContext.specialism}</p>
                  </div>
                </div>
              )}

              {/* Organization */}
              {activeContext.organization && (
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                  <Building2 size={16} className="text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold uppercase text-orange-600 tracking-wider">Organisatie</p>
                    <p className="text-sm font-black text-slate-900">{activeContext.organization}</p>
                  </div>
                </div>
              )}

              {/* Group (optional) */}
              {activeContext.group && (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <Users size={16} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold uppercase text-green-600 tracking-wider">Team/Groep</p>
                    <p className="text-sm font-black text-slate-900">{activeContext.group}</p>
                  </div>
                </div>
              )}

              {/* Work Context (optional) */}
              {activeContext.work_context && (
                <div className="flex items-start gap-3 p-3 bg-cyan-50 rounded-xl">
                  <MapPin size={16} className="text-cyan-600 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold uppercase text-cyan-600 tracking-wider">Werkcontext</p>
                    <p className="text-sm font-black text-slate-900">{activeContext.work_context}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Switch Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  handleSwitchContext();
                }}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all shadow-lg"
              >
                <RefreshCw size={14} />
                Wissel van Context
              </button>
            </div>
          </div>
        </>
      )}

      {/* Context Selection Modal */}
      <ContextSelectionModal
        userId={userId}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onContextChanged={handleContextChanged}
      />
    </div>
  );
}

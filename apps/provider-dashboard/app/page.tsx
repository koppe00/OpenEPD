'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { PatientProfile } from '../types';
import type { WorkContext } from '@openepd/clinical-core';
import { useRouter, useSearchParams } from 'next/navigation';

// Hooks
import { useDashboardLayout } from '../hooks/useDashboardLayout';
import { useClinicalData } from '../hooks/useClinicalData';
import { useWorkContexts } from '../hooks/useWorkContexts';

// Components
import { UniversalZibWidget } from '../components/dashboard/UniversalZibWidget';
import { UnifiedContextNavigator } from '../components/dashboard/UnifiedContextNavigator';
import { PatientIdentityCard } from '../components/dashboard/clinical/PatientIdentityCard';
import { MeasurementModal } from '../components/dashboard/MeasurementModal';
import { ZibDetailPanel } from '../components/dashboard/ZibDetailPanel';
import { GlobalPatientSearch } from '../components/dashboard/navigation/GlobalPatientSearch';

// Modules
import { MedicationModule } from '../components/dashboard/modules/medication/MedicationModule';
import { OrderEntryModule } from '../components/dashboard/modules/orders/OrderEntryModule';
import { PlanningModule } from '../components/dashboard/modules/planning/PlanningModule';
import { ImagingModule } from '../components/dashboard/modules/imaging/ImagingModule';
import { AIInsightsModule } from '../components/dashboard/intelligence/AIInsightsModule';

// Admin Widgets
import { AppointmentSchedulerWidget } from '../components/dashboard/admin/AppointmentSchedulerWidget';
import { PatientRegistrationWidget } from '../components/dashboard/admin/PatientRegistrationWidget';
import { ReferralInboxWidget } from '../components/dashboard/admin/ReferralInboxWidget';

import { Plus, Search, ChevronRight, LayoutTemplate, Settings, User, LogOut, AlertTriangle, Menu, X } from 'lucide-react';
import { PatientRegistrationModal } from '@/components/dashboard/PatientRegistrationModal';

type ModuleType = 'dossier' | 'medicatie' | 'orders' | 'imaging' | 'planning' | 'intelligence' | 'billing';

export default function ProviderDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProviderDashboardInner />
    </Suspense>
  );
}

function ProviderDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- STATE ---
  // NEW: Use database-driven work contexts instead of hardcoded modes
  const [activeModule, setActiveModule] = useState<ModuleType>('dossier');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  // Modals & Panels
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailZibId, setDetailZibId] = useState<string | null>(null);
  const [initialZibId, setInitialZibId] = useState<string | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [pendingPatientId, setPendingPatientId] = useState<string | null>(null);


  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  // --- SUPABASE ---
  const supabase = getSupabaseBrowserClient();

  const [authUser, setAuthUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Subscribe to auth state and populate current user
  useEffect(() => {
    let mounted = true;
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted) setAuthUser(user);
        if (mounted) setAuthChecked(true);
      } catch (err) {
        // ignore
        if (mounted) setAuthChecked(true);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (session?.user) setAuthUser(session.user);
      if (!session) setAuthUser(null);
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, [supabase]);

  // Probeer sessie te herstellen als deze ontbreekt, niet direct redirecten
  useEffect(() => {
    if (!authChecked) return; // nog niet gecheckt
    const path = window.location.pathname;
    // Alleen redirecten als de gebruiker expliciet heeft uitgelogd
    // of als we zeker weten dat de sessie niet hersteld kan worden
    if (!authUser && path !== '/login') {
      // Probeer sessie te herstellen
      supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
        if (!session) {
          // Nog steeds geen sessie, dan pas redirecten
          router.push('/login');
        }
        // Als er wel een sessie is, wordt authUser via onAuthStateChange gezet
      });
    }
  }, [authChecked, authUser, router, supabase]);

  // ...existing code...
    // ...existing code...
  // 1. Data Fetching: Geautoriseerde patiënten laden
  useEffect(() => {
    const fetchPatients = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) return;
        
        const { data: rels } = await supabase
            .from('care_relationships')
            .select('profiles:profiles!care_relationships_patient_user_id_fkey (*)')
            .eq('caregiver_user_id', user.id);
            
        if(rels) {
            const profileList = rels.map((r: any) => r.profiles) as PatientProfile[];
            setPatients(profileList);
        }
    };
    fetchPatients();
  }, [supabase]);

  // 2. Auto-select logica vanuit URL (?select=ID)
  useEffect(() => {
    const autoSelectId = searchParams.get('select');
    if (autoSelectId && patients.length > 0) {
      const targetPatient = patients.find(p => p.id === autoSelectId);
      if (targetPatient) {
        handlePatientSwitch(targetPatient);
        window.history.replaceState(null, '', '/');
      }
    }
  }, [searchParams, patients]);

  useEffect(() => {
  const handleOpenAI = () => setActiveModule('intelligence');
  window.addEventListener('open-ai-details', handleOpenAI);
  return () => window.removeEventListener('open-ai-details', handleOpenAI);
}, []);


  // 3. Verrijkte lijst voor Navigator (isRecent vlag)
  const patientsWithRecentFlag = useMemo(() => {
    return patients.map(p => ({
      ...p,
      isRecent: recentIds.includes(p.id)
    }));
  }, [patients, recentIds]);

  const { observations, refetch: reloadObs } = useClinicalData(selectedPatient?.id);

  // NEW: Use unified work contexts
  const workContextsHook = useWorkContexts(authUser?.id || '');
  const { workContexts, activeContext, isLoading: contextLoading, switchContext: originalSwitchContext, _revision } = workContextsHook;

  // Wrap switchContext to ensure immediate theme update
  // Wrap switchContext to ensure immediate theme update
  const switchContext = useCallback(async (contextId: string) => {
    const newContext = workContexts.find(c => c.id === contextId);
    await originalSwitchContext(contextId);
    
    // Immediately update theme state (don't wait for hook propagation)
    if (newContext?.theme_config) {
      setCurrentTheme({
        primary: newContext.theme_config.primary,
        secondary: newContext.theme_config.secondary,
        accent: newContext.theme_config.accent
      });
    }
  }, [workContexts, originalSwitchContext]);

  const { 
    leftWidgets, 
    mainWidgets, 
    rightWidgets, 
    loading: layoutLoading,
    availableTemplates,  
    activeTemplateId,    
    switchTemplate       
  } = useDashboardLayout({
    workContextId: activeContext?.id || '',
    specialtyId: null, // TODO: Get from user profile
    userId: authUser?.id || '',
    // Legacy fallback
    careSetting: 'polyclinic',
    specialtyCode: 'INT'
  });

  const selectedZibHistory = useMemo(() => {
    if (!detailZibId || !observations) return [];
    return observations.filter(obs => obs.zib_id === detailZibId);
  }, [detailZibId, observations]);

  // NEW: Local theme state that updates when revision changes (force re-render)
  const [currentTheme, setCurrentTheme] = useState({
    primary: '#64748b',
    secondary: '#f1f5f9',
    accent: '#475569'
  });

  // Update theme whenever revision changes
  useEffect(() => {
    if (activeContext?.theme_config) {
      setCurrentTheme({
        primary: activeContext.theme_config.primary,
        secondary: activeContext.theme_config.secondary,
        accent: activeContext.theme_config.accent
      });
    } else {
      setCurrentTheme({
        primary: '#64748b',
        secondary: '#f1f5f9',
        accent: '#475569'
      });
    }
  }, [_revision, activeContext]);

  const handleSelectExternalPatient = (patient: any) => {
   setIsGlobalSearchOpen(false); // Sluit zoekmodal
   setPendingPatientId(patient.id); // Onthoud welk ID we willen registreren
   setIsRegistrationModalOpen(true); // Open registratie modal
  };

  // 3. Functie voor als de registratie klaar is
  const handleRegistrationSuccess = async (patient: any) => {
    setIsRegistrationModalOpen(false);
    await handlePatientSwitch(patient); // Gebruik sessie check functie
  };


  const handleAddMeasurement = (zibId: string) => { setIsModalOpen(true); };
  const handleViewDetail = (zibId: string) => { setDetailZibId(zibId); };

  const handlePatientSwitch = async (patient: PatientProfile) => {
    // Controleer sessie voordat we switchen
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Probeer sessie te refreshen
      const { data: refreshData } = await supabase.auth.refreshSession();
      if (!refreshData.session) {
        // Sessie kon niet worden hersteld, redirect naar login
        router.push('/login');
        return;
      }
    }
    setSelectedPatient(patient);
    setRecentIds(prev => [patient.id, ...prev.filter(id => id !== patient.id)].slice(0, 5));
    setActiveModule('dossier');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      {!authChecked && (
        <div className="absolute inset-0 flex items-center justify-center h-screen text-slate-400 bg-white/80 z-50">
          <span>Bezig met controleren van sessie...</span>
        </div>
      )}
      
      {/* SIDEBAR (desktop) */}
      <aside className="hidden lg:flex w-85 bg-white border-r border-slate-200 flex flex-col shadow-2xl z-30 relative">
        <div className="p-8 border-b space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl text-white shadow-lg"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <span className="font-black text-xs">EPD</span>
              </div>
              <h1 className="font-black text-xl tracking-tighter uppercase italic leading-none">OpenEPD</h1>
            </div>
          </div>
          
          {/* NEW: Unified Context Navigator */}
          {authUser?.id && (
            <UnifiedContextNavigator 
              userId={authUser.id}
              switchContextOverride={switchContext}
              activeContextOverride={activeContext}
              onContextChange={(context) => {
                setActiveModule('dossier');
              }}
            />
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="p-4 px-6">
              <button 
                  onClick={() => setIsGlobalSearchOpen(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border border-blue-100 shadow-sm"
              >
                  <Search size={16} />
                  Zoek in alle dossiers
              </button>
          </div>
          
          <div className="flex-1">
            {activeContext?.code === 'ADMIN' ? (
                <div className="p-4 space-y-2">
                    <p className="px-4 text-[8px] font-black text-slate-400 uppercase tracking-widest mb-4">Administratie Modules</p>
                    <ModuleButton active={activeModule === 'billing'} onClick={() => setActiveModule('billing')} label="Facturatie & DBC" />
                    <ModuleButton active={activeModule === 'dossier'} onClick={() => setActiveModule('dossier')} label="Admin Dashboard" />
                    <ModuleButton active={activeModule === 'planning'} onClick={() => setActiveModule('planning')} label="Centrale Planning" />
                </div>
            ) : (
                <div className="p-4">
                  <p className="px-4 text-[8px] font-black text-slate-400 uppercase tracking-widest mb-4">Patiënten</p>
                  {patientsWithRecentFlag.filter(p => 
                    searchTerm === '' || 
                    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.bsn_number?.includes(searchTerm)
                  ).map(patient => (
                    <button
                      key={patient.id}
                      onClick={() => handlePatientSwitch(patient)}
                      className={`w-full text-left p-3 rounded-xl mb-2 transition-all ${
                        selectedPatient?.id === patient.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="font-semibold text-sm">{patient.full_name}</div>
                      <div className="text-xs text-gray-500">BSN: {patient.bsn_number}</div>
                    </button>
                  ))}
                </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
           <ModuleButton active={activeModule === 'dossier'} onClick={() => setActiveModule('dossier')} label="Kern Dossier" />
           <ModuleButton active={activeModule === 'medicatie'} onClick={() => setActiveModule('medicatie')} label="Medicatie" />
           <ModuleButton active={activeModule === 'orders'} onClick={() => setActiveModule('orders')} label="Orders" />
           <ModuleButton active={activeModule === 'intelligence'} onClick={() => setActiveModule('intelligence')} label="AI Assistant" />
        </div>
      </aside>

      {/* Mobile drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-80 bg-white border-r border-slate-200 shadow-2xl p-6 overflow-y-auto">
            <div className="p-2 border-b mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-xl text-white shadow-lg"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  <span className="font-black text-xs">EPD</span>
                </div>
                <h1 className="font-black text-lg tracking-tighter uppercase italic leading-none">OpenEPD</h1>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-lg bg-slate-50">
                <X size={18} />
              </button>
            </div>

            <div className="mb-4">
              <button onClick={() => { setIsGlobalSearchOpen(true); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border border-blue-100 shadow-sm">
                <Search size={16} />
                Zoek in alle dossiers
              </button>
            </div>

            <div>
              {activeContext?.code === 'ADMIN' ? (
                <div className="p-6 text-center text-slate-400 text-xs italic">Selecteer een module</div>
              ) : (
                <div className="space-y-2">
                  {patientsWithRecentFlag.filter(p => 
                    searchTerm === '' || 
                    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.bsn_number?.includes(searchTerm)
                  ).map(patient => (
                    <button
                      key={patient.id}
                      onClick={() => { handlePatientSwitch(patient); setIsSidebarOpen(false); }}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        selectedPatient?.id === patient.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="font-semibold text-sm">{patient.full_name}</div>
                      <div className="text-xs text-gray-500">BSN: {patient.bsn_number}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 border-t pt-4 space-y-2">
              <ModuleButton active={activeModule === 'dossier'} onClick={() => { setActiveModule('dossier'); setIsSidebarOpen(false); }} label="Kern Dossier" />
              <ModuleButton active={activeModule === 'medicatie'} onClick={() => { setActiveModule('medicatie'); setIsSidebarOpen(false); }} label="Medicatie" />
              <ModuleButton active={activeModule === 'orders'} onClick={() => { setActiveModule('orders'); setIsSidebarOpen(false); }} label="Orders" />
              <ModuleButton active={activeModule === 'intelligence'} onClick={() => { setActiveModule('intelligence'); setIsSidebarOpen(false); }} label="AI Assistant" />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header 
          className="bg-white shadow-sm p-2 sm:p-3 sticky top-0 z-20"
          style={{ 
            borderBottom: `3px solid ${currentTheme.primary}`,
            backgroundColor: currentTheme.secondary 
          }}
        >
          <div className="flex flex-col gap-3">
            {/* Eerste rij: Patient info */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-lg bg-slate-50 shrink-0">
                <Menu size={18} />
              </button>
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {activeContext?.code === 'ADMIN' ? (
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600 font-bold text-xs uppercase">Centrale Balie</div>
                ) : (
                  selectedPatient ? <PatientIdentityCard patient={selectedPatient} /> : (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-600 font-bold text-xs uppercase">OpenEPD</div>
                      <div className="text-slate-500 text-xs sm:text-sm font-bold hidden sm:block">Geen patiënt geselecteerd</div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Tweede rij: Controls (mobile wrap, desktop inline) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Template kiezer - gefilterd op actieve context */}
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 px-2 py-1.5 sm:px-4 sm:py-2.5 hover:border-blue-300 transition-all shrink-0">
                <LayoutTemplate size={12} className="text-slate-400 sm:w-3.5 sm:h-3.5" />
                <select 
                  value={activeTemplateId || ''} 
                  onChange={(e) => switchTemplate(e.target.value)}
                  className="bg-transparent text-[9px] sm:text-[10px] font-black uppercase text-slate-700 outline-none cursor-pointer min-w-[100px] sm:min-w-[140px]"
                >
                  {availableTemplates.length > 0 ? (
                    availableTemplates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))
                  ) : (
                    <option>Geen templates...</option>
                  )}
                </select>
              </div>

              {/* Actie knop */}
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-slate-900 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10 shrink-0"
              >
                <Plus size={14} /> <span className="hidden sm:inline">Actie</span><span className="sm:hidden">+</span>
              </button>

              {/* Auth status - altijd zichtbaar maar compacter op mobiel */}
              {authUser ? (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl shrink-0 ml-auto">
                  <User size={14} className="text-slate-600 sm:w-4 sm:h-4" />
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-black uppercase text-slate-400">Gebruiker</div>
                    <div className="text-[12px] font-bold text-slate-800">{authUser.email}</div>
                  </div>
                  <button 
                    onClick={async () => { await supabase.auth.signOut(); setAuthUser(null); router.push('/login'); }} 
                    className="p-1.5 sm:p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
                  >
                    <LogOut size={14} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => router.push('/login')} className="px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-[9px] sm:text-[10px] uppercase ml-auto">Inloggen</button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-2 sm:p-3 bg-slate-100 custom-scrollbar">
          <div className="max-w-[2200px] mx-auto">
            {selectedPatient || activeContext?.code === 'ADMIN' ? (
              <>
                {activeContext?.code === 'ADMIN' ? (
                  <div className="h-full">
                    {activeModule === 'billing' && (
                      <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm min-h-[600px]">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Financiële Afwikkeling & DBC Typering</h2>
                        <div className="grid grid-cols-3 gap-8">
                          {/* Hier komt je ValueCare-achtige interface */}
                          <div className="col-span-2 bg-slate-50 rounded-3xl p-8 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 italic">
                            DBC Dashboard overzicht...
                          </div>
                          <div className="bg-purple-50 rounded-3xl p-8 border border-purple-100">
                            <h4 className="font-black text-[10px] uppercase text-purple-600 mb-4">Openstaande Acties</h4>
                            <ul className="space-y-3 text-xs font-bold text-purple-900">
                              <li className="flex items-center gap-2"><AlertTriangle size={14}/> 12 DBC's zonder ICD-10</li>
                              <li className="flex items-center gap-2">✓ 45 Facturen verzonden</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeModule === 'dossier' && (
                      <div className="grid grid-cols-12 gap-6 h-full min-h-0">
                        {/* KOLOM 1: Registratie & Inbox */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-y-auto pb-10 custom-scrollbar pr-2">
                          <PatientRegistrationWidget />
                          <ReferralInboxWidget />
                        </div>

                        {/* KOLOM 2: Grote Planning / Agenda */}
                        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-y-auto pb-10 custom-scrollbar px-2">
                          <AppointmentSchedulerWidget />
                          
                          {/* Financiële Quickview (DBC/ValueCare) */}
                          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                             <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">DBC Validatie (AI Powered)</h3>
                                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-[10px] font-bold uppercase">ValueCare Sync Active</span>
                             </div>
                             {/* Hier landt de AI data van de opnamefunctie */}
                             <div className="p-4 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs italic">
                                Geen openstaande acties voor DBC typering.
                             </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeModule === 'planning' && <PlanningModule />}
                  </div>
                ) : (
                  activeModule === 'dossier' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3">
                        {/* Left sidebar - op mobiel bovenaan */}
                        <div className="lg:col-span-3 flex flex-col gap-2 sm:gap-3">
                           {leftWidgets.map((widget, index) => (
                            <div 
                              key={widget.id ? `left-${widget.id}` : `left-fallback-${index}`}
                            >
                              <UniversalZibWidget 
                                widget={widget} 
                                observations={observations || []}
                                patientId={selectedPatient?.id || 'admin'}
                                onAddMeasurement={handleAddMeasurement}
                                onViewDetail={handleViewDetail}
                                onDataChange={reloadObs}
                              />
                            </div>
                          ))}
                        </div>
                        {/* Main content */}
                        <div className="lg:col-span-6 flex flex-col gap-2 sm:gap-3">
                           {mainWidgets.map((widget, index) => (
                              <div 
                                key={widget.id ? `main-${widget.id}` : `main-fallback-${index}`}
                              >
                                <UniversalZibWidget 
                                  widget={widget}
                                  observations={observations || []}
                                  patientId={selectedPatient?.id || 'admin'}
                                  onAddMeasurement={handleAddMeasurement}
                                  onViewDetail={handleViewDetail}
                                  onDataChange={reloadObs}
                                />
                              </div>
                            ))}
                        </div>
                        {/* Right sidebar */}
                        <div className="lg:col-span-3 flex flex-col gap-2 sm:gap-3">
                           {rightWidgets.map((widget, index) => (
                              <div 
                                key={widget.id ? `right-${widget.id}` : `right-fallback-${index}`}
                              >
                                <UniversalZibWidget 
                                  widget={widget}
                                  observations={observations || []}
                                  patientId={selectedPatient?.id || 'admin'}
                                  onAddMeasurement={handleAddMeasurement}
                                  onViewDetail={handleViewDetail}
                                  onDataChange={reloadObs}
                                />
                              </div>
                            ))}
                        </div>
                    </div>
                  )
                )}
                {activeContext?.code !== 'ADMIN' && activeModule === 'medicatie' && <MedicationModule />}
                {/* DE NIEUWE INTELLIGENCE MODULE */}
                {activeModule === 'intelligence' && (
                  <AIInsightsModule 
                    observations={observations || []}
                    patientId={selectedPatient?.id}
                    onBack={() => setActiveModule('dossier')}
                    onDataRefresh={reloadObs}
                  />
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-200 italic bg-slate-50/30">
                <Search size={100} strokeWidth={0.5} className="opacity-20 mb-6" />
                <p className="font-black uppercase tracking-[0.5em] text-sm text-slate-300">Selecteer een patiënt</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODALS */}
      <GlobalPatientSearch 
        isOpen={isGlobalSearchOpen} 
        onClose={() => setIsGlobalSearchOpen(false)} 
        onSelect={handleSelectExternalPatient} 
      />
      <PatientRegistrationModal 
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        patientId={pendingPatientId}
        onSuccess={handleRegistrationSuccess}
      />



      {selectedPatient && (
        <>
          <MeasurementModal 
            isOpen={isModalOpen} 
            onClose={() => { setIsModalOpen(false); setInitialZibId(null); }} 
            patientId={selectedPatient.id} 
            onSaveSuccess={reloadObs}
            initialZibId={initialZibId || undefined}
          />
          <ZibDetailPanel 
            isOpen={!!detailZibId} 
            onClose={() => setDetailZibId(null)} 
            zibId={detailZibId} 
            history={selectedZibHistory} 
            onAddEntry={() => { setInitialZibId(detailZibId); setDetailZibId(null); setIsModalOpen(true); }} 
          />
        </>
      )}
    </div>
  );
}

function ModuleButton({ active, onClick, label }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-[10px] font-black uppercase transition-all ${active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
      <div className="flex items-center gap-3">{label}</div>
      <ChevronRight size={14} className={`transition-transform ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
    </button>
  );
}
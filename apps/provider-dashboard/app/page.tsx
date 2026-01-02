'use client';

import { useState, useMemo, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { PatientProfile } from '../types';
import { WorkflowMode, WORKFLOW_THEMES } from '@openepd/clinical-core';
import { useRouter, useSearchParams } from 'next/navigation';

// Hooks
import { useDashboardLayout } from '../hooks/useDashboardLayout';
import { useClinicalData } from '../hooks/useClinicalData';

// Components
import { UniversalZibWidget } from '../components/dashboard/UniversalZibWidget';
import { WorkflowNavigator } from '../components/dashboard/navigation/WorkflowNavigator';
import { PatientIdentityCard } from '../components/dashboard/clinical/PatientIdentityCard';
import { MeasurementModal } from '../components/dashboard/MeasurementModal';
import { ZibDetailPanel } from '../components/dashboard/ZibDetailPanel';
import { GlobalPatientSearch } from '../components/dashboard/navigation/GlobalPatientSearch';

// Modules
import { MedicationModule } from '../components/dashboard/modules/medication/MedicationModule';
import { OrderEntryModule } from '../components/dashboard/modules/orders/OrderEntryModule';
import { PlanningModule } from '../components/dashboard/modules/planning/PlanningModule';
import { ImagingModule } from '../components/dashboard/modules/imaging/ImagingModule';

import { Plus, Search, ChevronRight, LayoutTemplate, Settings } from 'lucide-react';
import { PatientRegistrationModal } from '@/components/dashboard/PatientRegistrationModal';

type ModuleType = 'dossier' | 'medicatie' | 'orders' | 'imaging' | 'planning';
type ExtendedWorkflowMode = WorkflowMode | 'admin';

export default function ProviderDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- STATE ---
  const [workflowMode, setWorkflowMode] = useState<ExtendedWorkflowMode>('spreekuur');
  const [activeModule, setActiveModule] = useState<ModuleType>('dossier');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  // Modals & Panels
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailZibId, setDetailZibId] = useState<string | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [pendingPatientId, setPendingPatientId] = useState<string | null>(null);


  // --- SUPABASE ---
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

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
        setSelectedPatient(targetPatient);
        setRecentIds(prev => [autoSelectId, ...prev.filter(id => id !== autoSelectId)].slice(0, 5));
        setActiveModule('dossier');
        window.history.replaceState(null, '', '/');
      }
    }
  }, [searchParams, patients]);

  // 3. Verrijkte lijst voor Navigator (isRecent vlag)
  const patientsWithRecentFlag = useMemo(() => {
    return patients.map(p => ({
      ...p,
      isRecent: recentIds.includes(p.id)
    }));
  }, [patients, recentIds]);

  const { observations, refetch: reloadObs } = useClinicalData(selectedPatient?.id);

  const { 
    leftWidgets, 
    mainWidgets, 
    rightWidgets, 
    loading: layoutLoading,
    availableTemplates,  
    activeTemplateId,    
    switchTemplate       
  } = useDashboardLayout({
    careSetting: workflowMode === 'admin' ? 'admin' : (workflowMode === 'kliniek' ? 'clinical' : 'polyclinic'),
    specialtyCode: workflowMode === 'admin' ? 'ALG' : 'INT'
  });

  const selectedZibHistory = useMemo(() => {
    if (!detailZibId || !observations) return [];
    return observations.filter(obs => obs.zib_id === detailZibId);
  }, [detailZibId, observations]);

  const currentTheme = workflowMode === 'admin' 
    ? { primary: 'bg-purple-600', secondary: 'bg-purple-100', accent: 'text-purple-600' }
    : WORKFLOW_THEMES[workflowMode as WorkflowMode];

  const handleSelectExternalPatient = (patient: any) => {
   setIsGlobalSearchOpen(false); // Sluit zoekmodal
   setPendingPatientId(patient.id); // Onthoud welk ID we willen registreren
   setIsRegistrationModalOpen(true); // Open registratie modal
  };

  // 3. Functie voor als de registratie klaar is
  const handleRegistrationSuccess = (patient: any) => {
    setIsRegistrationModalOpen(false);
    setSelectedPatient(patient); // Selecteer hem direct in het dashboard
    setRecentIds(prev => [patient.id, ...prev.filter(id => id !== patient.id)].slice(0, 5));
  };


  const handleAddMeasurement = (zibId: string) => { setIsModalOpen(true); };
  const handleViewDetail = (zibId: string) => { setDetailZibId(zibId); };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-85 bg-white border-r border-slate-200 flex flex-col shadow-2xl z-30 relative">
        <div className="p-8 border-b space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${currentTheme.primary} p-2 rounded-xl text-white shadow-lg`}>
                <span className="font-black text-xs">EPD</span>
              </div>
              <h1 className="font-black text-xl tracking-tighter uppercase italic leading-none">OpenEPD</h1>
            </div>
          </div>
          <nav className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
            <button onClick={() => setWorkflowMode('spreekuur')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${workflowMode === 'spreekuur' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Poli</button>
            <button onClick={() => setWorkflowMode('kliniek')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${workflowMode === 'kliniek' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>Kliniek</button>
            <button onClick={() => setWorkflowMode('admin')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${workflowMode === 'admin' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}>Admin</button>
          </nav>
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
            {workflowMode === 'admin' ? (
                <div className="p-6 text-center text-slate-400 text-xs italic">Selecteer een module</div>
            ) : (
                <WorkflowNavigator 
                  patients={patientsWithRecentFlag} 
                  viewMode={workflowMode as WorkflowMode} 
                  selectedId={selectedPatient?.id} 
                  onSelect={setSelectedPatient} 
                  searchTerm={searchTerm} 
                  onSearchChange={setSearchTerm} 
                />
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
           <ModuleButton active={activeModule === 'dossier'} onClick={() => setActiveModule('dossier')} label="Kern Dossier" />
           <ModuleButton active={activeModule === 'medicatie'} onClick={() => setActiveModule('medicatie')} label="Medicatie" />
           <ModuleButton active={activeModule === 'orders'} onClick={() => setActiveModule('orders')} label="Orders" />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {selectedPatient || workflowMode === 'admin' ? (
          <>
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 p-6 flex justify-between items-center sticky top-0 z-20">
              {workflowMode === 'admin' ? (
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600 font-bold text-xs uppercase">Centrale Balie</div>
                  </div>
              ) : (
                  <PatientIdentityCard patient={selectedPatient!} />
              )}
              
              <div className="flex items-center gap-4">
                {/* WERKCONTEXT / TEMPLATE KIEZER */}
                <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group">
                  <LayoutTemplate size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Werkcontext</span>
                    <select 
                      value={activeTemplateId || ''} 
                      onChange={(e) => switchTemplate(e.target.value)}
                      className="bg-transparent text-[10px] font-black uppercase text-slate-700 outline-none cursor-pointer min-w-[140px]"
                    >
                      {availableTemplates.length > 0 ? (
                        availableTemplates.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))
                      ) : (
                        <option>Geen contexten...</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* ACTIE KNOP */}
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10"
                >
                  <Plus size={16} /> Actie
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC] custom-scrollbar">
              <div className="max-w-[1920px] mx-auto h-full">
                {activeModule === 'dossier' && (
                  <div className="grid grid-cols-12 gap-6 h-full min-h-0">
                      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-y-auto pb-10 custom-scrollbar pr-2">
                         {leftWidgets.map((widget, index) => (
                          <div 
                            // FIX: Gebruik widget.id als hij er is, anders een veilige fallback met index
                            key={widget.id ? `left-${widget.id}` : `left-fallback-${index}`} 
                            className="min-h-[200px]"
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
                      <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 overflow-y-auto pb-10 custom-scrollbar px-2">
                         {mainWidgets.map((widget, index) => (
                            <div 
                              // FIX
                              key={widget.id ? `main-${widget.id}` : `main-fallback-${index}`} 
                              className="flex-1 min-h-[400px]"
                            >
                              <UniversalZibWidget 
                                // ... props
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
                      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-y-auto pb-10 custom-scrollbar pl-2">
                         {rightWidgets.map((widget, index) => (
                            <div 
                              // FIX
                              key={widget.id ? `right-${widget.id}` : `right-fallback-${index}`} 
                              className="min-h-[200px]"
                            >
                              <UniversalZibWidget 
                                // ... props
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
                )}
                {workflowMode !== 'admin' && activeModule === 'medicatie' && <MedicationModule />}
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-200 italic bg-slate-50/30">
            <Search size={100} strokeWidth={0.5} className="opacity-20 mb-6" />
            <p className="font-black uppercase tracking-[0.5em] text-sm text-slate-300">Selecteer een patiënt</p>
          </div>
        )}
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
            onClose={() => setIsModalOpen(false)} 
            patientId={selectedPatient.id} 
            onSaveSuccess={reloadObs} 
          />
          <ZibDetailPanel 
            isOpen={!!detailZibId} 
            onClose={() => setDetailZibId(null)} 
            zibId={detailZibId} 
            history={selectedZibHistory} 
            onAddEntry={() => { setDetailZibId(null); setIsModalOpen(true); }} 
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
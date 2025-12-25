'use client';

import { useState, useMemo, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { PatientProfile } from '../types';
import { WorkflowMode, WORKFLOW_THEMES } from '@openepd/clinical-core';

// Hooks
import { useDashboardLayout } from '../hooks/useDashboardLayout';
import { useClinicalData } from '../hooks/useClinicalData';

// Components
import { UniversalZibWidget } from '../components/dashboard/UniversalZibWidget';
import { WorkflowNavigator } from '../components/dashboard/navigation/WorkflowNavigator';
import { PatientIdentityCard } from '../components/dashboard/clinical/PatientIdentityCard';
import { MeasurementModal } from '../components/dashboard/MeasurementModal';
import { ZibDetailPanel } from '../components/dashboard/ZibDetailPanel';

// Modules
import { MedicationModule } from '../components/dashboard/modules/medication/MedicationModule';
import { OrderEntryModule } from '../components/dashboard/modules/orders/OrderEntryModule';
import { PlanningModule } from '../components/dashboard/modules/planning/PlanningModule';
import { ImagingModule } from '../components/dashboard/modules/imaging/ImagingModule';

import { Plus, Search, ChevronRight, LayoutTemplate, Settings } from 'lucide-react';

type ModuleType = 'dossier' | 'medicatie' | 'orders' | 'imaging' | 'planning';

// FIX: Maak een gecombineerd type zodat 'admin' toegestaan is
type ExtendedWorkflowMode = WorkflowMode | 'admin';

export default function ProviderDashboard() {
  // --- STATE ---
  // FIX: Gebruik het nieuwe type in useState
  const [workflowMode, setWorkflowMode] = useState<ExtendedWorkflowMode>('spreekuur');
  
  const [activeModule, setActiveModule] = useState<ModuleType>('dossier');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  
  // Modals & Panels
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailZibId, setDetailZibId] = useState<string | null>(null);

  // --- SUPABASE & DATA FETCHING ---
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    const fetchPatients = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) return;
        
        const { data: rels } = await supabase
            .from('care_relationships')
            .select('profiles:profiles!care_relationships_patient_user_id_fkey (*)')
            .eq('caregiver_user_id', user.id);
            
        if(rels) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const profileList = rels.map((r: any) => r.profiles) as PatientProfile[];
            setPatients(profileList);
        }
    };
    fetchPatients();
  }, [supabase]);

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
    // FIX: Types kloppen nu omdat de hook 'admin' accepteert
    careSetting: workflowMode === 'admin' ? 'admin' : (workflowMode === 'kliniek' ? 'clinical' : 'polyclinic'),
    specialtyCode: workflowMode === 'admin' ? 'ALG' : 'INT'
  });

  const selectedZibHistory = useMemo(() => {
    if (!detailZibId || !observations) return [];
    return observations.filter(obs => obs.zib_id === detailZibId);
  }, [detailZibId, observations]);

  // FIX: Fallback voor als workflowMode 'admin' is, want die zit niet in WORKFLOW_THEMES
  const currentTheme = workflowMode === 'admin' 
    ? { primary: 'bg-purple-600', secondary: 'bg-purple-100', accent: 'text-purple-600' }
    : WORKFLOW_THEMES[workflowMode as WorkflowMode];

  const handleAddMeasurement = (zibId: string) => {
    console.log("Quick add requested for:", zibId);
    setIsModalOpen(true);
  };

  const handleViewDetail = (zibId: string) => {
    setDetailZibId(zibId);
  };

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
            <button onClick={() => setWorkflowMode('admin')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${workflowMode === 'admin' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}>Admin & Logistiek</button>
          </nav>
        </div>
        
        {/* FIX: Alleen WorkflowNavigator tonen als we NIET in admin mode zijn, of aangepaste navigator */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {workflowMode === 'admin' ? (
              <div className="p-6 text-center text-slate-400 text-xs italic">
                  Selecteer een module in het dashboard
              </div>
          ) : (
              <WorkflowNavigator 
                patients={patients} 
                viewMode={workflowMode as WorkflowMode} 
                selectedId={selectedPatient?.id} 
                onSelect={setSelectedPatient} 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
              />
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
           <ModuleButton active={activeModule === 'dossier'} onClick={() => setActiveModule('dossier')} label="Kern Dossier" />
           <ModuleButton active={activeModule === 'medicatie'} onClick={() => setActiveModule('medicatie')} label="Medicatie" />
           <ModuleButton active={activeModule === 'orders'} onClick={() => setActiveModule('orders')} label="Orders" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Voor admin mode hoeven we niet per se een patient geselecteerd te hebben */}
        {selectedPatient || workflowMode === 'admin' ? (
          <>
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 p-6 flex justify-between items-center sticky top-0 z-20">
              {workflowMode === 'admin' ? (
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600 font-bold text-xs uppercase">Centrale Balie</div>
                      <span className="text-sm font-bold text-slate-700">Overzicht</span>
                  </div>
              ) : (
                  <PatientIdentityCard patient={selectedPatient!} />
              )}
              
              <div className="flex items-center gap-4">
                 <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 shadow-sm hover:border-slate-300 transition-colors">
                    <LayoutTemplate size={14} className="text-slate-400" />
                    {layoutLoading ? (
                        <span className="text-[10px] text-slate-400 font-mono animate-pulse">Layout laden...</span>
                    ) : (
                        <select 
                            value={activeTemplateId || ''} 
                            onChange={(e) => switchTemplate(e.target.value)}
                            className="bg-transparent text-[10px] font-bold uppercase text-slate-700 outline-none cursor-pointer min-w-[160px]"
                            disabled={availableTemplates.length === 0}
                        >
                            {availableTemplates.length > 0 ? (
                                availableTemplates.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))
                            ) : (
                                <option>Geen layouts beschikbaar</option>
                            )}
                        </select>
                    )}
                 </div>

                 <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10">
                  <Plus size={16} /> Actie
                 </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC] custom-scrollbar">
              <div className="max-w-[1920px] mx-auto h-full">
                
                {activeModule === 'dossier' && (
                  layoutLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center py-20 text-slate-400 animate-pulse text-xs uppercase tracking-widest flex flex-col items-center gap-4">
                            <LayoutTemplate size={48} className="opacity-20" />
                            Dashboard context opbouwen...
                        </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-12 gap-6 h-full min-h-0">
                      
                      {/* LINKER KOLOM */}
                      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-y-auto pb-10 custom-scrollbar pr-2">
                         {leftWidgets.map(widget => (
                           <div key={widget.instance_id} className="min-h-[200px] animate-in slide-in-from-left-4 duration-500 fade-in">
                             <UniversalZibWidget 
                               widget={widget} 
                               observations={observations || []}
                               patientId={selectedPatient?.id || 'admin'} // Fallback voor admin
                               onAddMeasurement={handleAddMeasurement}
                               onViewDetail={handleViewDetail}
                               onDataChange={reloadObs}
                             />
                           </div>
                         ))}
                      </div>

                      {/* MIDDEN KOLOM */}
                      <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 overflow-y-auto pb-10 custom-scrollbar px-2">
                         {mainWidgets.map(widget => (
                           <div key={widget.instance_id} className="flex-1 min-h-[400px] animate-in zoom-in-95 duration-500 fade-in">
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
                         {mainWidgets.length === 0 && (
                           <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 text-xs uppercase tracking-widest gap-4">
                             <Settings size={32} className="opacity-20" />
                             Sleep widgets naar &apos;Main Content&apos; in Admin
                           </div>
                         )}
                      </div>

                      {/* RECHTER KOLOM */}
                      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-y-auto pb-10 custom-scrollbar pl-2">
                         {rightWidgets.map(widget => (
                           <div key={widget.instance_id} className="min-h-[200px] animate-in slide-in-from-right-4 duration-500 fade-in">
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
                
                {/* ANDERE MODULES - Alleen tonen als NIET in admin mode, of specifiek maken */}
                {workflowMode !== 'admin' && (
                    <>
                        {activeModule === 'medicatie' && <MedicationModule />}
                        {activeModule === 'orders' && <OrderEntryModule />}
                        {activeModule === 'planning' && <PlanningModule />}
                        {activeModule === 'imaging' && <ImagingModule />}
                    </>
                )}
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

      {/* MODALS & PANELS */}
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ModuleButton({ active, onClick, label }: any) {
    return (
      <button onClick={onClick} className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-[10px] font-black uppercase transition-all ${active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
        <div className="flex items-center gap-3">{label}</div>
        <ChevronRight size={14} className={`transition-transform ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
      </button>
    );
}
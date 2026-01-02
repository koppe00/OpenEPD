import React, { useState } from 'react';
import { 
  Building2, Stethoscope, Cpu, Globe, 
  ChevronRight, Plus, Database, Settings2 
} from 'lucide-react';

export function SettingsView() {
  const [activeSection, setActiveSection] = useState('organisatie');

  const sections = [
    { id: 'organisatie', label: 'Organisatie', icon: Building2, desc: 'Locaties, afdelingen en types' },
    { id: 'medisch', label: 'Medische Stamgegevens', icon: Stethoscope, desc: 'Specialismen en ZIB-mapping' },
    { id: 'systeem', label: 'Workflow & AI', icon: Cpu, desc: 'Standaard workflows en LLM-parameters' },
    { id: 'interop', label: 'Interoperabiliteit', icon: Globe, desc: 'FHIR endpoints en FHIR-servers' },
  ];

  return (
    <div className="flex gap-8 h-full animate-in fade-in duration-500">
      {/* Linker Navigatie Paneel */}
      <div className="w-80 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left p-6 rounded-[2rem] border transition-all ${
                activeSection === section.id 
                ? 'bg-white border-blue-100 shadow-sm' 
                : 'border-transparent hover:bg-white/50 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${activeSection === section.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest ${activeSection === section.id ? 'text-slate-900' : ''}`}>
                    {section.label}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 mt-1">{section.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Rechter Content Paneel */}
      <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings2 className="text-blue-600" size={20} />
            <h2 className="font-black uppercase tracking-[0.2em] text-sm text-slate-800">
              Configuratie: {activeSection}
            </h2>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
            <Plus size={14} /> Toevoegen
          </button>
        </div>

        <div className="p-8 flex-1 overflow-auto">
          {activeSection === 'organisatie' && renderOrganisatieSettings()}
          {activeSection === 'medisch' && renderMedischeSettings()}
          {activeSection === 'systeem' && renderWorkflowSettings()}
        </div>
      </div>
    </div>
  );

  function renderOrganisatieSettings() {
    // Voorbeeld van stamgegevens uit de 'organizations' tabel
    return (
      <div className="space-y-4">
        {['Hoofdlocatie UMC', 'Dependance Zuid', 'Radiologie Lab A'].map((loc) => (
          <div key={loc} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Building2 size={16} className="text-slate-400"/></div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{loc}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Org Type: Ziekenhuis</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
        ))}
      </div>
    );
  }

  function renderMedischeSettings() {
    return (
      <div className="grid grid-cols-2 gap-4">
        {['Cardiologie', 'Neurologie', 'Oncologie', 'Klinische Chemie'].map((spec) => (
          <div key={spec} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm"><Stethoscope size={20}/></div>
              <span className="text-[9px] font-black px-2 py-1 bg-blue-100 text-blue-700 rounded-md">12 ZIB's</span>
            </div>
            <p className="font-black text-slate-900 uppercase tracking-tight text-xs">{spec}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1 italic">Mapping: SNOMED CT / LOINC</p>
          </div>
        ))}
      </div>
    );
  }

  function renderWorkflowSettings() {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-blue-600 rounded-[2rem] text-white">
          <div className="flex items-center gap-3 mb-2">
            <Cpu size={20} />
            <p className="font-black uppercase tracking-widest text-xs">AI Workflow Engine Status</p>
          </div>
          <p className="text-[11px] opacity-80 leading-relaxed">De centrale workflow engine synchroniseert ziekenhuis-specifieke processen naar StandardWorkflows conform het detailontwerp.</p>
        </div>
        <div className="border border-slate-100 rounded-[2rem] p-6 space-y-4">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Actieve Protocollen</p>
           {['STD_TRIAGE_01', 'STD_LAB_ORDER_V2'].map(id => (
             <div key={id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
               <span className="font-mono text-[11px] font-bold text-slate-700">{id}</span>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                 <span className="text-[9px] font-black uppercase text-slate-400">Gevalideerd door AI</span>
               </div>
             </div>
           ))}
        </div>
      </div>
    );
  }
}

function renderMedischeSettings() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const specialties = [
    { id: 'spec-01', name: 'Cardiologie', zibs: 12, workflows: ['Pijn op de borst v4', 'Hartfalen Monitor'] },
    { id: 'spec-02', name: 'Neurologie', zibs: 8, workflows: ['Stroke Triage', 'TIA Traject'] },
    { id: 'spec-03', name: 'Oncologie', zibs: 24, workflows: ['Chemotherapie Protocol', 'MDO Planning'] },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {specialties.map((spec) => (
          <button 
            key={spec.id}
            onClick={() => setSelectedSpecialty(spec.id)}
            className={`p-6 rounded-[2rem] border transition-all text-left ${
              selectedSpecialty === spec.id ? 'bg-blue-600 border-blue-600 shadow-lg' : 'bg-slate-50 border-slate-100 hover:bg-white'
            }`}
          >
            <p className={`text-[9px] font-black uppercase tracking-widest ${selectedSpecialty === spec.id ? 'text-blue-200' : 'text-slate-400'}`}>
              Specialisme
            </p>
            <p className={`text-sm font-black mt-1 ${selectedSpecialty === spec.id ? 'text-white' : 'text-slate-900'}`}>
              {spec.name}
            </p>
          </button>
        ))}
      </div>

      {selectedSpecialty && (
        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 animate-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Configuratie Details</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Gekoppelde Workflows & ZIB-Mapping</p>
            </div>
            <button className="text-[10px] font-black text-blue-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
              Wijzigingen Vastleggen
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Workflow Koppeling */}
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Geautoriseerde Workflows</p>
              {specialties.find(s => s.id === selectedSpecialty)?.workflows.map(wf => (
                <div key={wf} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100/50">
                  <span className="text-xs font-bold text-slate-700">{wf}</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              ))}
              <button className="w-full py-3 border border-dashed border-slate-300 rounded-2xl text-[10px] font-black text-slate-400 uppercase hover:bg-white transition-all">
                + Workflow Toevoegen
              </button>
            </div>

            {/* ZIB / SNOMED Mapping */}
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Widget & ZIB Mapping</p>
              <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                <div className="flex items-center gap-2 mb-4 text-blue-400">
                  <Database size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">SNOMED CT Registry</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="opacity-60 italic">Gekoppelde ZIB's</span>
                    <span className="font-bold">12 Items</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[65%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// apps/admin-dashboard/components/users/WorkflowManager.tsx
import React, { useState } from 'react';
import { 
  Play, Cpu, Zap, FileJson, 
  ArrowUpCircle, BarChart3, TestTube2, CheckCircle2 
} from 'lucide-react';

export function WorkflowManager() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);

  const mockWorkflows = [
    { id: 'WF-001', name: 'Sepsis Protocol V3', specialty: 'Intensive Care', status: 'Active', aiScore: 92, type: 'Hospital-Specific' },
    { id: 'WF-002', name: 'Pre-operatieve Checklist', specialty: 'Heelkunde', status: 'Proposed', aiScore: 88, type: 'Standard-Candidate' },
    { id: 'WF-003', name: 'Triage Spoedeisende Hulp', specialty: 'SEH', status: 'Active', aiScore: 95, type: 'Standard' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Statistieken Bar */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-[2.5rem] text-white shadow-lg shadow-blue-600/20">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Gemiddelde AI Score</p>
          <h3 className="text-3xl font-black mt-1">91.4%</h3>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
            <Zap size={12} /> +2.1% t.o.v. vorige maand
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Actieve Workflows</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">128</h3>
          <p className="text-[10px] font-bold text-emerald-600 mt-4 flex items-center gap-1">
             <CheckCircle2 size={12} /> Alle systemen synchroon
          </p>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upgrade Wachtrij</p>
          <h3 className="text-3xl font-black mt-1">12</h3>
          <p className="text-[10px] font-bold text-blue-400 mt-4 underline cursor-pointer">Start Analyse</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workflow Lijst */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black uppercase tracking-widest text-xs">Workflow Catalogus</h3>
            <button className="btn-primary text-[9px] px-4 py-2">Nieuwe BPMN Import</button>
          </div>
          <div className="divide-y divide-slate-50">
            {mockWorkflows.map((wf) => (
              <div 
                key={wf.id} 
                onClick={() => setSelectedWorkflow(wf)}
                className={`p-6 flex items-center justify-between cursor-pointer transition-all ${selectedWorkflow?.id === wf.id ? 'bg-blue-50/50 border-l-4 border-blue-600' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${wf.type === 'Standard' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <FileJson size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{wf.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{wf.specialty} • {wf.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-blue-600">{wf.aiScore}% Efficiëntie</p>
                    <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div className="bg-blue-600 h-full" style={{ width: `${wf.aiScore}%` }} />
                    </div>
                  </div>
                  <ArrowUpCircle className={wf.type === 'Standard-Candidate' ? 'text-amber-500 animate-pulse' : 'text-slate-200'} size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analyse & Upgrade Paneel */}
        <div className="space-y-6">
          {selectedWorkflow ? (
            <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <Cpu className="text-blue-600" />
                <h4 className="font-black uppercase tracking-widest text-xs">AI Analyse Resultaat</h4>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Aanbeveling</p>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    "Dit protocol vertoont een hoge correlatie met positieve uitkomsten in {selectedWorkflow.specialty}. Upgrade naar Standaard wordt geadviseerd."
                  </p>
                </div>
                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
                  <ArrowUpCircle size={16} /> Upgrade naar StandardWorkflow
                </button>
                <button className="w-full border border-slate-200 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                  <TestTube2 size={16} /> Start Simulatie
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 p-12 text-center">
              <BarChart3 className="mx-auto text-slate-300 mb-4" size={40} />
              <p className="text-xs font-bold text-slate-400 italic">Selecteer een workflow voor AI-analyse</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
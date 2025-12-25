'use client';

import React from 'react';
import { 
  Clock, 
  UserPlus, 
  MoreHorizontal, 
  PlayCircle, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface QueueItem {
  id: string;
  patientName: string;
  appointmentTime: string;
  waitTime: number;
  status: 'waiting' | 'in-progress' | 'completed' | 'delayed';
  triageColor: 'green' | 'amber' | 'red';
}

export const PatientQueueCard = () => {
  // Demo data - later te koppelen aan Supabase 'appointments' tabel
  const queue: QueueItem[] = [
    { id: '1', patientName: 'Dhr. J. de Vries', appointmentTime: '14:00', waitTime: 15, status: 'waiting', triageColor: 'green' },
    { id: '2', patientName: 'Mevr. S. Bakker', appointmentTime: '14:20', waitTime: 5, status: 'waiting', triageColor: 'amber' },
    { id: '3', patientName: 'Kind L. Janssen', appointmentTime: '14:40', waitTime: 0, status: 'waiting', triageColor: 'green' },
  ];

  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 italic">Workflow: Spreekuur</h3>
          <h2 className="text-xl font-black tracking-tighter uppercase italic">Wachtkamer Live</h2>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Clock size={14} /> 4 Patiënten
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {queue.map((item) => (
          <div 
            key={item.id} 
            className="group relative bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 rounded-[2.5rem] p-6 border border-transparent hover:border-slate-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-5">
              {/* Triage Indicator */}
              <div className={`w-1.5 h-12 rounded-full ${
                item.triageColor === 'red' ? 'bg-rose-500' : 
                item.triageColor === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-black uppercase tracking-tight text-slate-800">{item.patientName}</span>
                  {item.waitTime > 10 && (
                    <div className="flex items-center gap-1 text-amber-600">
                      <AlertCircle size={12} />
                      <span className="text-[9px] font-black tracking-widest">{item.waitTime}M WACHTTIJD</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                     <Clock size={12} /> {item.appointmentTime}
                   </span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/60 italic">Controle DM2</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
              <button className="p-4 bg-white text-slate-400 hover:text-blue-600 rounded-full shadow-sm border border-slate-100 transition-all">
                <UserPlus size={18} />
              </button>
              <button className="p-4 bg-slate-900 text-white hover:bg-blue-600 rounded-full shadow-lg transition-all flex items-center gap-2 px-6">
                <PlayCircle size={18} />
                <span className="text-[9px] font-black uppercase tracking-widest">Oproepen</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Analytics */}
      <div className="p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gem. Doorloop</p>
          <p className="text-lg font-black text-slate-800 italic">18 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-normal">min</span></p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <p className="text-sm font-black text-slate-800">OP SCHEMA</p>
          </div>
        </div>
      </div>
    </div>
  );
};
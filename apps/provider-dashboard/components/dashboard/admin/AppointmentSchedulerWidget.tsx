'use client';
import { Calendar, Clock, MapPin, UserCheck, User } from 'lucide-react';

export function AppointmentSchedulerWidget() {
  const schedule = [
    { time: '09:00', patient: 'Dhr. Jansen', type: 'Consult', status: 'checked_in', room: 'Kamer 3.04' },
    { time: '09:20', patient: 'Mv. de Groot', type: 'Controle', status: 'planned', room: 'Kamer 3.04' },
    { time: '09:40', patient: 'Dhr. Bakker', type: 'Eerste Afspraak', status: 'planned', room: 'Kamer 3.04' },
    { time: '10:00', patient: 'Mv. Yilmaz', type: 'Spoed', status: 'planned', room: 'Kamer 3.04' },
  ];

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-50 rounded-xl text-purple-600"><Calendar size={18} /></div>
             <h3 className="font-black text-sm text-slate-900">Agenda & Doorstroom</h3>
          </div>
          <div className="text-xs font-bold text-slate-400">Vandaag, 25 Nov</div>
       </div>

       <div className="space-y-3">
          {schedule.map((slot, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${slot.status === 'checked_in' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100'}`}>
                  <div className="w-16 text-center">
                      <div className="font-black text-sm text-slate-700">{slot.time}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">15 min</div>
                  </div>
                  
                  <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{slot.patient}</span>
                        {slot.status === 'checked_in' && <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">In Wachtkamer</span>}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1"><User size={10}/> {slot.type}</span>
                          <span className="flex items-center gap-1"><MapPin size={10}/> {slot.room}</span>
                      </div>
                  </div>

                  <div className="flex flex-col gap-1">
                      {slot.status === 'planned' ? (
                          <button className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-blue-600 transition-colors">
                              Aanmelden
                          </button>
                      ) : (
                          <button className="bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded-lg text-[10px] font-bold">
                              Wijzig
                          </button>
                      )}
                  </div>
              </div>
          ))}
       </div>
    </div>
  );
}
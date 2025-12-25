import { Calendar as CalendarIcon, Clock, Users, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export const PlanningModule = () => {
  const schedule = [
    { time: '08:30', patient: 'Jan de Vries', type: 'Poli - Controle', room: 'Kamer 12', status: 'In wachtkamer' },
    { time: '09:15', patient: 'Lotte van Dam', type: 'Spoed Consult', room: 'Kamer 12', status: 'Gepland' },
    { time: '10:00', patient: 'Multidisciplinair Overleg', type: 'MDO Cardiologie', room: 'Zaal B1', status: 'Gepland' },
    { time: '11:30', patient: 'OK Blok A', type: 'Chirurgische Ingreep', room: 'OK 4', status: 'Voorbereiding' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black tracking-tighter uppercase italic">Planning & Resources</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vrijdag 19 December 2025</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"><ChevronLeft size={16}/></button>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Dagoverzicht / Timeline */}
        <div className="col-span-8 space-y-4">
          {schedule.map((item, i) => (
            <div key={i} className="group relative flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer">
              <div className="flex flex-col items-center">
                <span className="font-black text-sm tracking-tighter">{item.time}</span>
                <div className="w-px h-10 bg-slate-100 group-last:hidden mt-2" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-tight">{item.patient}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.type}</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                    item.status === 'In wachtkamer' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span className="text-[10px] font-bold">{item.room}</span>
                </div>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Resource Status Sidebar */}
        <div className="col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-slate-400 italic">Capaciteit OK-Complex</h4>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((ok) => (
                <div key={ok} className="flex justify-between items-center">
                  <span className="text-xs font-black">OK {ok}</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${ok === 4 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      {ok === 4 ? 'Bezet' : 'Vrij'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem]">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-slate-400 italic">Beschikbare Specialisten</h4>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 w-10 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black">DR</div>
              ))}
              <div className="h-10 w-10 rounded-full border-4 border-white bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black">+2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

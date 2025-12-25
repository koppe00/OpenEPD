'use client';

import { Activity, Scale, Thermometer, Clock, AlertCircle } from 'lucide-react';

interface ZibMeasurement {
  id: string;
  zib_id: string; // Consistent met DB naming
  timestamp: string;
  systolic?: number;
  diastolic?: number;
  weight_value?: number;
  temperature_value?: number;
  position?: string;
  location?: string;
}

interface VitalsGridProps {
  observations?: ZibMeasurement[];
}

export const VitalsGrid = ({ observations = [] }: VitalsGridProps) => {
  // 1. Groepeer de data op de juiste property: zib_id
  const latestVitals = observations.reduce((acc: Record<string, ZibMeasurement>, curr) => {
    // Gebruik overal curr.zib_id in plaats van zibId
    if (!acc[curr.zib_id] || new Date(curr.timestamp) > new Date(acc[curr.zib_id].timestamp)) {
      acc[curr.zib_id] = curr;
    }
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Bloeddruk Card */}
      <VitalCard 
        title="Bloeddruk"
        icon={<Activity className="text-rose-500" size={20} />}
        data={latestVitals['nl.zorg.Bloeddruk']}
        renderValue={(data) => (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tighter text-slate-900">
              {data.systolic}/{data.diastolic}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase">mmHg</span>
          </div>
        )}
      />

      {/* Gewicht Card */}
      <VitalCard 
        title="Lichaamsgewicht"
        icon={<Scale className="text-blue-500" size={20} />}
        data={latestVitals['nl.zorg.Lichaamsgewicht']}
        renderValue={(data) => (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tighter text-slate-900">
              {data.weight_value}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase">kg</span>
          </div>
        )}
      />

      {/* Temperatuur Card */}
      <VitalCard 
        title="Temperatuur"
        icon={<Thermometer className="text-amber-500" size={20} />}
        data={latestVitals['nl.zorg.Lichaamstemperatuur']}
        renderValue={(data) => (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tighter text-slate-900">
              {data.temperature_value}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase">°C</span>
          </div>
        )}
      />
    </div>
  );
};

interface VitalCardProps {
  title: string;
  icon: React.ReactNode;
  data?: ZibMeasurement;
  renderValue: (data: ZibMeasurement) => React.ReactNode;
}

function VitalCard({ title, icon, data, renderValue }: VitalCardProps) {
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        {data && (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest italic">
              <Clock size={10} />
              {new Date(data.timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <span className="text-[8px] font-bold text-blue-500 uppercase mt-1">
              {new Date(data.timestamp).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        )}
      </div>

      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 italic">{title}</h4>
      
      <div className="min-h-[3rem] flex items-center">
        {data ? (
          renderValue(data)
        ) : (
          <div className="flex items-center gap-2 text-slate-200 py-2">
            <AlertCircle size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Geen meting</span>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50">
        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">
          {data ? 'Gevalideerde Bron' : 'Wachten op invoer'}
        </span>
      </div>
    </div>
  );
}
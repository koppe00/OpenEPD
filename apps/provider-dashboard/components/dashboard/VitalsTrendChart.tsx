'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ClinicalObservation } from '../../hooks/useClinicalData';

interface Props {
  observations: ClinicalObservation[];
}

export const VitalsTrendChart = ({ observations }: Props) => {
  // Filter alleen bloeddruk metingen en draai om voor chronologische volgorde
  const bpData = observations
    .filter(o => o.zib_id === 'nl.zorg.Bloeddruk')
    .map(o => ({
      time: new Date(o.timestamp).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' }),
      systolic: o.systolic,
      diastolic: o.diastolic,
    }))
    .reverse();

  if (bpData.length === 0) return null;

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm mt-8">
      <div className="mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic mb-2">Historische Trend</h3>
        <h2 className="text-xl font-black tracking-tighter uppercase">Bloeddruk Verloop</h2>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={bpData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 'bold', fill: '#cbd5e1' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 'bold', fill: '#cbd5e1' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', paddingTop: '20px' }} />
            <Line 
              name="Systolisch"
              type="monotone" 
              dataKey="systolic" 
              stroke="#f43f5e" 
              strokeWidth={4} 
              dot={{ r: 6, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8 }}
            />
            <Line 
              name="Diastolisch"
              type="monotone" 
              dataKey="diastolic" 
              stroke="#3b82f6" 
              strokeWidth={4} 
              dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
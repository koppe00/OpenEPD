'use client';

import React from 'react';
import { Users, Fingerprint, Building2, Activity, ShieldAlert, ArrowUpRight } from 'lucide-react';

export function DashboardOverview({ stats, recentLogs }: any) {
  const cards = [
    { label: 'Actieve Zorgverleners', value: stats.totalStaff, icon: Users, color: 'blue' },
    { label: 'Geregistreerde Patiënten', value: stats.totalPatients, icon: Fingerprint, color: 'emerald' },
    { label: 'Zorginstellingen', value: stats.totalOrgs, icon: Building2, color: 'purple' },
    { label: 'Audit Log Entries', value: stats.recentLogsCount, icon: Activity, color: 'slate' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Statistieken Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-${card.color}-50 text-${card.color}-600`}>
                  <Icon size={24} />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                  <ArrowUpRight size={12} /> LIVE
                </span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Audit Log Mini-view */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
              <ShieldAlert className="text-blue-600" size={18} /> Kritieke Systeemlogs
            </h4>
            <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800">Bekijk Alles</button>
          </div>
          <div className="space-y-4">
            {recentLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{log.action}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Uitgevoerd door: {log.actor?.full_name || 'Systeem'}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Systeem Gezondheid */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-xl shadow-slate-900/20">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Systeem Integriteit</h4>
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span>Database Belasting</span>
                <span className="text-emerald-400">Optimaal</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[12%]" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span>NEN 7510 Compliancy</span>
                <span className="text-blue-400">100%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
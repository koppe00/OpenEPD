'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Fingerprint, Clock, User, Activity, Search, ShieldCheck, Download, FileText } from 'lucide-react';

export function AuditLogView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      // QUERY UPDATE: We halen nu ook description, resource_type en status op
      const { data } = await supabase
        .from('nen7513_logs')
        .select(`
          id,
          action,
          timestamp,
          description,
          resource_type,
          resource_id,
          status,
          actor:actor_user_id (full_name, app_role),
          patient:patient_user_id (full_name)
        `)
        .order('timestamp', { ascending: false })
        .limit(100);

      setLogs(data || []);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  // FUNCTIE: Genereer en download CSV bestand
  const handleExportCSV = () => {
    if (!logs.length) return;

    // 1. Headers definiëren
    const headers = ['Tijdstip', 'Actie', 'Status', 'Actor Naam', 'Actor Rol', 'Betreft Patiënt', 'Beschrijving', 'Resource Type', 'Resource ID'];
    
    // 2. Data mappen naar CSV formaat
    const csvRows = [
      headers.join(','), // Header rij
      ...logs.map(log => {
        const row = [
          new Date(log.timestamp).toLocaleString('nl-NL'),
          log.action,
          log.status || 'unknown',
          `"${log.actor?.full_name || 'Systeem'}"`,
          log.actor?.app_role || 'system',
          `"${log.patient?.full_name || '-'}"`,
          `"${(log.description || '').replace(/"/g, '""')}"`, // Escape quotes in beschrijving
          log.resource_type,
          log.resource_id
        ];
        return row.join(',');
      })
    ];

    // 3. Blob aanmaken en downloaden
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nen7513_audit_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm items-center">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Zoek op actie, gebruiker of beschrijving..."
            className="w-full pl-12 pr-6 py-3 bg-slate-50 rounded-xl border-none text-sm font-bold focus:ring-2 focus:ring-blue-500/10 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Export Knop */}
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
          title="Download NEN 7513 rapportage"
        >
          <Download size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Export CSV</span>
        </button>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">NEN 7513</span>
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="px-8 py-4">Tijdstip</th>
                <th className="px-8 py-4">Gebruiker (Actor)</th>
                <th className="px-8 py-4">Actie & Context</th>
                <th className="px-8 py-4 text-right">Hash/ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-sans font-bold">Logs ophalen...</td></tr>
              ) : (
                logs.filter(log => 
                  log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  log.actor?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  log.description?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={12} />
                        {new Date(log.timestamp).toLocaleString('nl-NL')}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-600">{log.actor?.full_name || 'SYSTEEM'}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-black">{log.actor?.app_role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-start gap-3">
                        <Activity size={14} className={`mt-0.5 ${log.action.includes('DELETE') ? 'text-red-400' : 'text-slate-300'}`} />
                        <div>
                          <p className="text-slate-700 font-bold leading-tight">{log.action}</p>
                          <p className="text-slate-500 mt-1 max-w-md truncate" title={log.description}>
                            {log.description || '-'}
                          </p>
                          {log.patient && (
                            <p className="text-[9px] text-blue-400 mt-1 uppercase font-black">
                              Betreft patiënt: {log.patient.full_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="text-slate-300 text-[9px] uppercase font-black tracking-tighter">
                        #{log.id.split('-')[0]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
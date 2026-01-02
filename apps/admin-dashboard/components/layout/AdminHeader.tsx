'use client';

import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, LogOut, Activity, Database, Wifi, WifiOff } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export function AdminHeader({ title }: { title: string }) {
  const [isOnline, setIsOnline] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'error'>('connected');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const checkHealth = async () => {
    try {
      // Simpele ping naar de profiles tabel om connectiviteit te checken
      const { error } = await supabase.from('profiles').select('id', { count: 'estimated', head: true }).limit(1);
      if (error) throw error;
      setDbStatus('connected');
    } catch (err) {
      setDbStatus('error');
    }
  };

  useEffect(() => {
    // Check status bij laden en elke 30 seconden
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    
    // Luister naar browser online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <header className="flex justify-between items-center bg-white border-b border-slate-100 px-8 py-4 -mx-8 -mt-8 mb-8 sticky top-0 z-30 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{title}</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">OpenEPD Beheeromgeving</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Real-time Status Indicators */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
          {/* Netwerk Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span className="text-[9px] font-black uppercase tracking-widest">{isOnline ? 'Internet OK' : 'Offline'}</span>
          </div>

          {/* Database Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${dbStatus === 'connected' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
            <Database size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">{dbStatus === 'connected' ? 'DB Verbonden' : 'DB Error'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right mr-2 hidden md:block">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter leading-none">Beheerder</p>
            <p className="text-[9px] font-bold text-slate-400">Gezaghebbende sessie</p>
          </div>
          <button 
            onClick={handleLogout}
            className="group flex items-center justify-center w-11 h-11 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-2xl transition-all"
            title="Sessie beëindigen"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
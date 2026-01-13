'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  FileText, 
  Settings, 
  ShieldAlert, 
  Database, 
  Cpu,
  LayoutTemplate,
  Component,
  Network,
  BookOpen // Voor referentiedata
} from 'lucide-react';

const menuItems = [
  {
    category: 'Main',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Gebruikers & Rollen', href: '/users', icon: Users },
    ]
  },
  {
    category: 'Inrichting & UI',
    items: [
      { label: 'Dashboard Templates', href: '/ui-config/templates', icon: LayoutTemplate },
      { label: 'Widget Architect', href: '/ui-config/widgets', icon: Component },
      { label: 'Protocollen (GLM)', href: '/clinical/protocols', icon: Stethoscope },
      { label: 'Documentatie', href: '/documentation', icon: FileText },
    ]
  },
  {
    category: 'Referentiedata',
    items: [
      { label: 'Stamtabellen', href: '/reference-data', icon: BookOpen },
    ]
  },
  {
    category: 'Systeem & Governance',
    items: [
      { label: 'AI Configuratie', href: '/system/ai-governance', icon: Cpu },
      { label: 'Storage Providers', href: '/system/storage', icon: Database },
      { label: 'Audit Logs', href: '/system/audit-logs', icon: ShieldAlert },
      { label: 'Instellingen', href: '/settings', icon: Settings },
    ]
  }
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 shrink-0">
      {/* Header Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-900/20">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight">OpenEPD</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Admin Console</p>
        </div>
      </div>

      {/* Navigatie Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {menuItems.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 px-3">
              {group.category}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                // Check of de link actief is. 
                // We kijken of de pathname BEGINT met de href (behalve voor home '/')
                const isActive = item.href === '/' 
                  ? pathname === '/' 
                  : pathname.startsWith(item.href);

                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon size={16} strokeWidth={2} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer User Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
            ADM
          </div>
          <div>
            <p className="text-xs font-bold text-white">Systeembeheer</p>
            <p className="text-[10px] text-slate-500">Secure Environment</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
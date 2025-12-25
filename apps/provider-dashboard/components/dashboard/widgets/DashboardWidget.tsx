'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  icon: LucideIcon;
  // Kleur is nu subtieler (alleen icoon achtergrond), niet de hele header
  iconColor?: string; 
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  // Nieuw: Optie om padding weg te laten voor lijsten die tot de rand moeten lopen
  noPadding?: boolean; 
}

export const DashboardWidget = ({ 
  title, 
  icon: Icon, 
  iconColor = 'bg-slate-900', 
  children, 
  action, 
  className = '',
  noPadding = false
}: Props) => {
  return (
    <div className={`bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col overflow-hidden ${className}`}>
      
      {/* Compacte Header: Zakelijk & Strak */}
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 min-h-[48px]">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg text-white shadow-sm ${iconColor}`}>
            <Icon size={14} strokeWidth={2.5} />
          </div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
            {title}
          </h3>
        </div>
        {action && (
          <div className="text-slate-400 hover:text-slate-600 transition-colors">
            {action}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${noPadding ? '' : 'p-4'}`}>
        {children}
      </div>
    </div>
  );
};
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
    <div className={`bg-white border border-slate-300 shadow-sm rounded-lg flex flex-col overflow-hidden ${className}`}>
      
      {/* Compacte Header: Zakelijk & Strak */}
      <div className="px-2 sm:px-3 py-2 border-b-2 border-blue-600 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
          <div className={`p-1 rounded text-white ${iconColor}`}>
            <Icon size={12} strokeWidth={2.5} />
          </div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-wide text-slate-700">
            {title}
          </h3>
          </div>
          {action && (
            <div className="w-full sm:w-auto mt-2 sm:mt-0 text-slate-400 hover:text-slate-600 transition-colors flex justify-end">
              {action}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${noPadding ? '' : 'p-2 sm:p-3'}`}>
        {children}
      </div>
    </div>
  );
};
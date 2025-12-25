'use client';

import { Activity, Bell, Database, Calendar, Pill, Microscope, Image as ImageIcon } from 'lucide-react';

// We hergebruiken het type uit de page.tsx voor consistentie
type ModuleType = 'dossier' | 'medicatie' | 'orders' | 'imaging' | 'planning';

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
}

// Interface voor de interne SidebarButton component
interface SidebarButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export const Sidebar = ({ activeModule, setActiveModule }: SidebarProps) => {
  return (
    <aside className="w-85 bg-white border-r border-slate-200 flex flex-col shadow-2xl z-30 transition-all">
      <div className="p-8 border-b space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Activity size={18} />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none text-slate-900">OpenEPD</h1>
          </div>
          <Bell size={18} className="text-slate-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="p-6 space-y-1.5 flex-1">
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] mb-3 px-2 italic">Ziekenhuis Systeem</p>
        
        <SidebarButton 
          active={activeModule === 'dossier'} 
          onClick={() => setActiveModule('dossier')} 
          icon={<Database size={14} />} 
          label="Kern Dossier" 
        />
        <SidebarButton 
          active={activeModule === 'planning'} 
          onClick={() => setActiveModule('planning')} 
          icon={<Calendar size={14} />} 
          label="Planning" 
        />
        <SidebarButton 
          active={activeModule === 'medicatie'} 
          onClick={() => setActiveModule('medicatie')} 
          icon={<Pill size={14} />} 
          label="Medicatie" 
        />
        <SidebarButton 
          active={activeModule === 'orders'} 
          onClick={() => setActiveModule('orders')} 
          icon={<Microscope size={14} />} 
          label="Lab & Orders" 
        />
        <SidebarButton 
          active={activeModule === 'imaging'} 
          onClick={() => setActiveModule('imaging')} 
          icon={<ImageIcon size={14} />} 
          label="Beeldvorming" 
        />
      </div>
    </aside>
  );
};

// Typed component voor de navigatieknoppen
function SidebarButton({ active, onClick, icon, label }: SidebarButtonProps) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-[10px] font-black uppercase transition-all group ${
        active 
          ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
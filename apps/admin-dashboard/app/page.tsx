import Link from 'next/link';
import { 
  ShieldCheck, Activity, Users, Database, Cpu, ArrowRight,
  LayoutTemplate, Component, FileText, Settings
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Systeem Overzicht</h1>
          <p className="text-slate-500 mt-2">Real-time status van de OpenEPD infrastructuur.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Systeem Operationeel
        </div>
      </div>

      {/* KPI Kaarten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard title="Actieve Sessies" value="142" sub="12 Zorgverleners" icon={Users} color="bg-blue-500" />
        <StatusCard title="AI Requests (24u)" value="1.204" sub="Gemini Pro 1.5" icon={Cpu} color="bg-purple-500" />
        <StatusCard title="Storage Vaults" value="89" sub="Versleuteld" icon={Database} color="bg-amber-500" />
        <StatusCard title="Audit Integriteit" value="100%" sub="NEN7513 Compliant" icon={ShieldCheck} color="bg-slate-800" />
      </div>

      {/* NIEUW: Snelle Navigatie naar Configuratie */}
      <div>
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Settings size={18} className="text-slate-400" />
            Beheer & Inrichting
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ConfigCard 
                title="UI Templates" 
                desc="Beheer layouts voor poli, kliniek en admin." 
                icon={LayoutTemplate} 
                href="/ui-config/templates" // Zorg dat deze route bestaat
                color="text-blue-600 bg-blue-50"
            />
            <ConfigCard 
                title="Widget Architect" 
                desc="Configureer ZIB-blokken en procesmodules." 
                icon={Component} 
                href="/ui-config/widgets" // Zorg dat deze route bestaat
                color="text-purple-600 bg-purple-50"
            />
            <ConfigCard 
                title="Klinische Protocollen" 
                desc="Beheer beslisregels en zorgpaden." 
                icon={FileText} 
                href="/clinical/protocols" 
                color="text-emerald-600 bg-emerald-50"
            />
        </div>
      </div>

      {/* Logs & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Activity size={18} className="text-slate-400" />
            Recente Audit Logs
          </h3>
          <div className="space-y-0 divide-y divide-slate-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 group hover:bg-slate-50 px-2 rounded-xl transition-colors -mx-2">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                    LOG
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Protocol Update: MDL Coeliakie</p>
                    <p className="text-xs text-slate-400">Uitgevoerd door <span className="font-medium text-slate-600">J. Admin</span></p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">14:3${i}</span>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-3 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 rounded-xl transition-colors border border-dashed border-slate-200">
            Bekijk alle logs
          </button>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-blue-500 blur-[100px] opacity-20 rounded-full pointer-events-none" />
          <h3 className="font-bold text-lg mb-4 relative z-10">Systeem Status</h3>
          <div className="space-y-6 relative z-10">
            <SystemMetric label="Database Load" value="12%" />
            <SystemMetric label="API Latency" value="45ms" />
            <SystemMetric label="Storage Usage" value="1.2 TB" />
            <SystemMetric label="AI Token Quota" value="65%" />
          </div>
          <button className="mt-8 flex items-center gap-2 text-xs font-bold text-blue-300 hover:text-white transition-colors">
            Open Monitoring <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- HULP COMPONENTEN ---

function StatusCard({ title, value, sub, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start justify-between group hover:shadow-md transition-all">
      <div>
        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
        {sub && <p className="text-xs font-medium text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`p-4 rounded-2xl text-white ${color} shadow-lg shadow-blue-900/5 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
    </div>
  );
}

function ConfigCard({ title, desc, icon: Icon, href, color }: any) {
    return (
        <Link href={href} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
        </Link>
    );
}

function SystemMetric({ label, value }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="font-bold font-mono">{value}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }} />
      </div>
    </div>
  );
}
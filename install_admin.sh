#!/bin/bash

# Configuratie
APP_DIR="apps/admin-dashboard"

echo "🏗️  Start installatie OpenEPD Beheerdersportaal in: $APP_DIR"

# 1. Mappenstructuur aanmaken
echo "📁 Mappen aanmaken..."
mkdir -p "$APP_DIR/app/users"
mkdir -p "$APP_DIR/app/clinical/protocols"
mkdir -p "$APP_DIR/app/documentation/templates"
mkdir -p "$APP_DIR/app/ui-config/layouts"
mkdir -p "$APP_DIR/app/system/ai-governance"
mkdir -p "$APP_DIR/app/system/storage"
mkdir -p "$APP_DIR/app/system/audit-logs"
mkdir -p "$APP_DIR/app/settings"
mkdir -p "$APP_DIR/components/layout"
mkdir -p "$APP_DIR/components/shared"
mkdir -p "$APP_DIR/public"

# 2. Package.json (Aangepast aan jouw monorepo dependencies)
echo "📦 Package.json configureren..."
cat <<EOF > "$APP_DIR/package.json"
{
  "name": "admin-dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3002",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.1.0",
    "lucide-react": "^0.300.0",
    "@supabase/ssr": "^0.1.0",
    "@supabase/supabase-js": "^2.39.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0"
  }
}
EOF

# 3. Configuraties (TS, Tailwind, PostCSS)
echo "⚙️  Config bestanden schrijven..."

# tsconfig.json
cat <<EOF > "$APP_DIR/tsconfig.json"
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# tailwind.config.ts
cat <<EOF > "$APP_DIR/tailwind.config.ts"
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
EOF

# postcss.config.js
cat <<EOF > "$APP_DIR/postcss.config.js"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# 4. Globals CSS
echo "🎨 Stylesheets aanmaken..."
cat <<EOF > "$APP_DIR/app/globals.css"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 15, 23, 42;
  --background-rgb: 248, 250, 252;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}

/* Custom Scrollbar voor Admin */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
EOF

# 5. Componenten (Sidebar)
echo "🧩 Componenten bouwen..."
cat << 'EOF' > "$APP_DIR/components/layout/AdminSidebar.tsx"
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
  LayoutTemplate
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
    category: 'Klinische Configuratie',
    items: [
      { label: 'Protocollen (GLM)', href: '/clinical/protocols', icon: Stethoscope },
      { label: 'Smart Templates', href: '/documentation/templates', icon: FileText },
      { label: 'UI & Widgets', href: '/ui-config/layouts', icon: LayoutTemplate },
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
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-900/20">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight">OpenEPD</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Admin Console</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-8">
        {menuItems.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 px-3">
              {group.category}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
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
EOF

# 6. Layout & Pages
echo "📄 Pagina's genereren..."

# Root Layout
cat << 'EOF' > "$APP_DIR/app/layout.tsx"
import './globals.css';
import { Inter } from 'next/font/google';
import { AdminSidebar } from '../../components/layout/AdminSidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'OpenEPD Beheerportaal',
  description: 'Configuratie en Governance voor OpenEPD',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-slate-50`}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto pb-20">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
EOF

# Dashboard Page (Home)
cat << 'EOF' > "$APP_DIR/app/page.tsx"
import { ShieldCheck, Activity, Users, Database, Cpu, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard title="Actieve Sessies" value="142" sub="12 Zorgverleners" icon={Users} color="bg-blue-500" />
        <StatusCard title="AI Requests (24u)" value="1.204" sub="Gemini Pro 1.5" icon={Cpu} color="bg-purple-500" />
        <StatusCard title="Storage Vaults" value="89" sub="Versleuteld" icon={Database} color="bg-amber-500" />
        <StatusCard title="Audit Integriteit" value="100%" sub="NEN7513 Compliant" icon={ShieldCheck} color="bg-slate-800" />
      </div>

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
EOF

# 7. Placeholder Pages (zodat menu links werken)
echo "🚧 Placeholder pagina's genereren..."

create_placeholder_page() {
  local PATH=$1
  local TITLE=$2
  cat << EOF > "$APP_DIR/app/$PATH/page.tsx"
import { Hammer } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="p-4 bg-slate-100 rounded-full text-slate-400">
        <Hammer size={48} />
      </div>
      <div>
        <h1 className="text-2xl font-black text-slate-900">$TITLE</h1>
        <p className="text-slate-500 max-w-md mx-auto mt-2">
          Deze module wordt momenteel geconfigureerd. In de volgende stap koppelen we hier de database tabellen aan.
        </p>
      </div>
    </div>
  );
}
EOF
}

create_placeholder_page "users" "Gebruikers & Rollen"
create_placeholder_page "clinical/protocols" "Protocol Editor (GLM)"
create_placeholder_page "documentation/templates" "Smart Template Builder"
create_placeholder_page "ui-config/layouts" "Interface & Widgets"
create_placeholder_page "system/ai-governance" "AI Governance"
create_placeholder_page "system/storage" "Storage Providers"
create_placeholder_page "system/audit-logs" "Audit Logs"
create_placeholder_page "settings" "Instellingen"

echo "✅ Klaar! OpenEPD Admin Dashboard is geïnstalleerd."
echo "👉 Voer nu uit: 'npm install' (of pnpm install) om dependencies bij te werken."
echo "👉 Start daarna: 'npm run dev --workspace=apps/admin-dashboard' (of pnpm dev --filter admin-dashboard)"
'use client';

import React, { useState, useRef } from 'react';
// Import html2pdf.js for PDF export
import html2pdf from 'html2pdf.js';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { 
  BookOpen, 
  Heart,
  Activity,
  Calendar,
  FileText,
  Shield,
  Bell,
  Settings,
  Smartphone,
  Lock,
  User
} from 'lucide-react';

export default function PatientPortalDocPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'OpenEPD_Patient_Portal.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .from(contentRef.current)
      .save();
  };

  return (
    <div className="flex h-screen bg-slate-50/50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-slate-200 p-6 overflow-y-auto">
        <h2 className="text-lg font-black text-slate-900 mb-4">Patient Portal</h2>
        <nav className="space-y-1">
          <NavItem 
            icon={BookOpen} 
            label="Overzicht" 
            active={activeSection === 'overview'}
            onClick={() => setActiveSection('overview')}
          />
          <NavItem 
            icon={Activity} 
            label="Vitals Registratie" 
            active={activeSection === 'vitals'}
            onClick={() => setActiveSection('vitals')}
          />
          <NavItem 
            icon={FileText} 
            label="Dossier Inzage" 
            active={activeSection === 'records'}
            onClick={() => setActiveSection('records')}
          />
          <NavItem 
            icon={Calendar} 
            label="Afspraken" 
            active={activeSection === 'appointments'}
            onClick={() => setActiveSection('appointments')}
          />
          <NavItem 
            icon={Shield} 
            label="Privacy & Consent" 
            active={activeSection === 'privacy'}
            onClick={() => setActiveSection('privacy')}
          />
          <NavItem 
            icon={Settings} 
            label="Technisch" 
            active={activeSection === 'technical'}
            onClick={() => setActiveSection('technical')}
          />
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between max-w-4xl mb-4">
          <AdminHeader 
            title="Patient Portal Documentatie" 
            subtitle="Handleiding voor het patiënt self-service portaal"
          />
          <button
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            onClick={handleExportPDF}
            title="Exporteer volledige documentatie naar PDF"
          >
            Export PDF
          </button>
        </div>
        <div className="max-w-4xl" ref={contentRef}>
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'vitals' && <VitalsSection />}
          {activeSection === 'records' && <RecordsSection />}
          {activeSection === 'appointments' && <AppointmentsSection />}
          {activeSection === 'privacy' && <PrivacySection />}
          {activeSection === 'technical' && <TechnicalSection />}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold
        transition-colors
        ${active 
          ? 'bg-green-50 text-green-700' 
          : 'text-slate-600 hover:bg-slate-50'
        }
      `}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
      <h3 className="text-lg font-black text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-green-600" />
        <span className="font-bold text-slate-900">{title}</span>
      </div>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {title && (
        <div className="bg-slate-800 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-700">
          {title}
        </div>
      )}
      <pre className="p-4 text-sm text-slate-100 overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <Section title="Patient Portal">
        <p className="text-slate-700 mb-4">
          Het Patient Portal is de patiëntgerichte applicatie van OpenEPD. 
          Hiermee kunnen patiënten hun eigen medische gegevens inzien, metingen registreren 
          en communiceren met hun zorgverleners.
        </p>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-green-900 mb-2">🩺 Patiëntregie Centraal</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>URL:</strong> http://localhost:3001</li>
            <li>• <strong>Login:</strong> Supabase Auth met patiënt account</li>
            <li>• <strong>Filosofie:</strong> Patiënt is eigenaar van eigen data</li>
          </ul>
        </div>
      </Section>

      <Section title="Kern Functionaliteiten">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard 
            icon={Activity}
            title="Vitals Registratie"
            description="Zelf bloeddruk, gewicht en andere metingen invoeren"
          />
          <FeatureCard 
            icon={FileText}
            title="Dossier Inzage"
            description="Inzien van eigen medische gegevens en verslagen"
          />
          <FeatureCard 
            icon={Calendar}
            title="Afspraken"
            description="Overzicht van geplande en historische afspraken"
          />
          <FeatureCard 
            icon={Shield}
            title="Consent Management"
            description="Beheer wie toegang heeft tot welke data"
          />
          <FeatureCard 
            icon={Bell}
            title="Notificaties"
            description="Meldingen voor afspraken, resultaten en berichten"
          />
          <FeatureCard 
            icon={Lock}
            title="Data Soevereiniteit"
            description="Keuze waar data wordt opgeslagen (cloud/lokaal)"
          />
        </div>
      </Section>

      <Section title="Schermindeling">
        <CodeBlock title="Patient Portal Layout">{`
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: OpenEPD Patient Portal │ Notificaties │ Profile │ Logout  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    WELKOM, [NAAM]                            │   │
│  │                    Uw gezondheid in eigen hand               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   📊         │  │   📋         │  │   📅         │              │
│  │  Vitals      │  │  Dossier     │  │  Afspraken   │              │
│  │  Invoeren    │  │  Inzien      │  │  Bekijken    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  RECENTE METINGEN                                            │   │
│  │  ────────────────────────────────────────────────────────── │   │
│  │  Bloeddruk: 135/85 mmHg (vandaag 08:30)                     │   │
│  │  Gewicht: 78.5 kg (gisteren)                                 │   │
│  │  [Alle metingen bekijken →]                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
`}</CodeBlock>
      </Section>

      <Section title="Data Synchronisatie">
        <p className="text-slate-700 mb-4">
          Data ingevoerd in het Patient Portal wordt automatisch gesynchroniseerd 
          naar de centrale database en is direct zichtbaar voor zorgverleners 
          in het Provider Dashboard.
        </p>
        
        <CodeBlock title="Realtime Sync Flow">{`
Patient Portal                    Supabase                    Provider Dashboard
     │                               │                               │
     │  [Nieuwe meting invoeren]     │                               │
     │──────────────────────────────►│                               │
     │                               │                               │
     │                               │  [Realtime subscription]      │
     │                               │◄──────────────────────────────│
     │                               │                               │
     │                               │  [Push update]                │
     │                               │──────────────────────────────►│
     │                               │                               │
     │                               │         [Data direct zichtbaar]
`}</CodeBlock>
      </Section>
    </div>
  );
}

function VitalsSection() {
  return (
    <div className="space-y-6">
      <Section title="Vitals Registratie">
        <p className="text-slate-700 mb-4">
          Patiënten kunnen zelf vitale parameters registreren. 
          Dit ondersteunt thuismonitoring en chronische zorg.
        </p>
      </Section>

      <Section title="Ondersteunde Metingen">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="border border-slate-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Heart size={16} className="text-red-500" />
              <strong className="text-slate-900">Bloeddruk</strong>
            </div>
            <p className="text-xs text-slate-600">Systolisch, diastolisch, pols</p>
            <code className="text-xs text-slate-500">nl.zorg.Bloeddruk</code>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-blue-500" />
              <strong className="text-slate-900">Gewicht</strong>
            </div>
            <p className="text-xs text-slate-600">Lichaamsgewicht in kg</p>
            <code className="text-xs text-slate-500">nl.zorg.Lichaamsgewicht</code>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-green-500" />
              <strong className="text-slate-900">Bloedglucose</strong>
            </div>
            <p className="text-xs text-slate-600">Glucose nuchter/postprandiaal</p>
            <code className="text-xs text-slate-500">nl.zorg.Glucose</code>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-purple-500" />
              <strong className="text-slate-900">Temperatuur</strong>
            </div>
            <p className="text-xs text-slate-600">Lichaamstemperatuur</p>
            <code className="text-xs text-slate-500">nl.zorg.Lichaamstemperatuur</code>
          </div>
        </div>
      </Section>

      <Section title="ZIB Blood Pressure Card">
        <p className="text-slate-700 mb-4">
          De primaire invoer component voor bloeddruk metingen.
        </p>
        
        <CodeBlock title="ZibBloodPressureCard Component">{`// components/ZibBloodPressureCard.tsx

export function ZibBloodPressureCard({ patientId }: Props) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [position, setPosition] = useState('Sitting');
  
  const handleSubmit = async () => {
    await supabase.from('zib_compositions').insert({
      patient_id: patientId,
      zib_id: 'nl.zorg.Bloeddruk',
      content: {
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        position
      },
      source_system: 'patient-portal',
      storage_status: 'sync_pending'
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bloeddruk meting</CardTitle>
      </CardHeader>
      <CardContent>
        <Input label="Systolisch" value={systolic} ... />
        <Input label="Diastolisch" value={diastolic} ... />
        <Select label="Houding" value={position} ... />
        <Button onClick={handleSubmit}>Opslaan</Button>
      </CardContent>
    </Card>
  );
}`}</CodeBlock>
      </Section>

      <Section title="Trend Visualisatie">
        <p className="text-slate-700 mb-4">
          Patiënten kunnen hun metingen over tijd bekijken met grafieken.
        </p>
        
        <CodeBlock title="Trend View">{`
┌─────────────────────────────────────────────────────────────────────┐
│  BLOEDDRUK TREND (laatste 30 dagen)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  160 ─┤                                                             │
│       │            *                                                │
│  140 ─┤    *   *       *   *                                       │
│       │  *   *   * * *   *   * * *                                 │ Systolisch
│  120 ─┤                                                             │
│       │                                                             │
│  100 ─┤                                                             │
│       │                                                             │
│   80 ─┤  • • • • • • • • • • • • •                                 │ Diastolisch
│       │                                                             │
│   60 ─┼────────────────────────────────────────────────────────────│
│       1  3  5  7  9  11 13 15 17 19 21 23 25 27 29                 │
│                          Datum                                      │
└─────────────────────────────────────────────────────────────────────┘
`}</CodeBlock>
      </Section>
    </div>
  );
}

function RecordsSection() {
  return (
    <div className="space-y-6">
      <Section title="Dossier Inzage">
        <p className="text-slate-700 mb-4">
          Patiënten hebben recht op inzage in hun complete medisch dossier 
          conform de WGBO en AVG.
        </p>
      </Section>

      <Section title="Beschikbare Gegevens">
        <ul className="text-sm text-slate-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></span>
            <div>
              <strong>Vitale parameters:</strong> Alle bloeddruk, gewicht, glucose metingen
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></span>
            <div>
              <strong>Lab uitslagen:</strong> Bloedonderzoek, urineonderzoek
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></span>
            <div>
              <strong>Verslagen:</strong> Consult verslagen, ontslagbrieven
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></span>
            <div>
              <strong>Medicatie:</strong> Actieve en historische voorschriften
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></span>
            <div>
              <strong>Diagnoses:</strong> Actieve en historische aandoeningen
            </div>
          </li>
        </ul>
      </Section>

      <Section title="Audit Trail">
        <p className="text-slate-700 mb-4">
          Patiënten kunnen zien wie hun dossier heeft ingezien (conform WGBO artikel 456a).
        </p>
        
        <CodeBlock title="Logging Query">{`-- Wie heeft mijn dossier bekeken?

SELECT 
  p.full_name as viewer_name,
  p.specialty as viewer_specialty,
  l.action,
  l.target_resource,
  l.created_at
FROM system_config_logs l
JOIN profiles p ON p.id = l.user_id
WHERE l.target_resource LIKE 'patient:' || :patient_id || '%'
ORDER BY l.created_at DESC;`}</CodeBlock>
      </Section>
    </div>
  );
}

function AppointmentsSection() {
  return (
    <div className="space-y-6">
      <Section title="Afspraken">
        <p className="text-slate-700 mb-4">
          Overzicht van geplande en historische afspraken met zorgverleners.
        </p>
      </Section>

      <Section title="Afspraken Overzicht">
        <CodeBlock title="Appointments View">{`
┌─────────────────────────────────────────────────────────────────────┐
│  MIJN AFSPRAKEN                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ⏰ AANKOMEND                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  15 januari 2026 - 10:30                                     │   │
│  │  Dr. Van der Berg - Interne Geneeskunde                      │   │
│  │  Polikliniek Diabetes - Kamer 2.14                           │   │
│  │  [📍 Route] [📝 Voorbereiden] [❌ Afzeggen]                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  22 januari 2026 - 14:00                                     │   │
│  │  Laboratorium - Bloedafname                                  │   │
│  │  Route 1 - Prikpoli                                          │   │
│  │  [📍 Route]                                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  📜 AFGEROND                                                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  8 januari 2026 - 09:15 ✓                                    │   │
│  │  Dr. Van der Berg - Controle bloeddruk                       │   │
│  │  [📄 Verslag bekijken]                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
`}</CodeBlock>
      </Section>

      <Section title="Appointments Database">
        <CodeBlock title="Schema">{`CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id),
  resource_id UUID,               -- Kamer/locatie
  appointment_type TEXT,          -- consult, lab, imaging
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  status TEXT,                    -- scheduled, checked_in, completed
  checkin_time TIMESTAMPTZ,
  waiting_room_location TEXT
);`}</CodeBlock>
      </Section>
    </div>
  );
}

function PrivacySection() {
  return (
    <div className="space-y-6">
      <Section title="Privacy & Consent Management">
        <p className="text-slate-700 mb-4">
          OpenEPD geeft patiënten volledige controle over hun privacy en 
          wie toegang heeft tot welke gegevens.
        </p>
      </Section>

      <Section title="Consent Types">
        <div className="space-y-3">
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked readOnly className="w-4 h-4" />
              <strong className="text-slate-900">Behandelrelatie</strong>
            </div>
            <p className="text-sm text-slate-600">
              Zorgverleners met actieve behandelrelatie mogen mijn gegevens inzien 
              voor directe zorgverlening.
            </p>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked readOnly className="w-4 h-4" />
              <strong className="text-slate-900">Huisarts delen</strong>
            </div>
            <p className="text-sm text-slate-600">
              Specialistische gegevens automatisch delen met mijn huisarts.
            </p>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" readOnly className="w-4 h-4" />
              <strong className="text-slate-900">Wetenschappelijk onderzoek</strong>
            </div>
            <p className="text-sm text-slate-600">
              Geanonimiseerde gegevens mogen worden gebruikt voor medisch onderzoek.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Data Locatie Keuze">
        <p className="text-slate-700 mb-4">
          Uniek aan OpenEPD: patiënten kiezen waar hun data wordt opgeslagen.
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-slate-200 rounded-lg p-3">
            <strong className="text-slate-900 block mb-1">☁️ Cloud (Default)</strong>
            <p className="text-xs text-slate-600">Veilige opslag in Supabase/AWS met encryptie</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-3">
            <strong className="text-slate-900 block mb-1">🏠 Personal NAS</strong>
            <p className="text-xs text-slate-600">Lokale opslag op eigen NAS thuis</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-3">
            <strong className="text-slate-900 block mb-1">📁 Google Drive</strong>
            <p className="text-xs text-slate-600">Opslag in eigen Google account</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-3">
            <strong className="text-slate-900 block mb-1">🏥 Ziekenhuis</strong>
            <p className="text-xs text-slate-600">Opslag in ziekenhuis datacenter</p>
          </div>
        </div>
      </Section>

      <Section title="Care Relationships">
        <p className="text-slate-700 mb-4">
          Het systeem houdt bij welke zorgverleners een behandelrelatie hebben.
        </p>
        
        <CodeBlock title="care_relationships table">{`CREATE TABLE care_relationships (
  id UUID PRIMARY KEY,
  patient_user_id UUID REFERENCES profiles(id),
  caregiver_user_id UUID REFERENCES profiles(id),
  organization_id UUID REFERENCES organizations(id),
  role_code TEXT,                 -- 'PCP', 'spec', 'nurse'
  relationship_level TEXT,        -- 'TREAT', 'VIEW', 'ADMIN'
  is_main_practitioner BOOLEAN,
  consent_source TEXT,            -- 'local', 'mitz', 'lsp'
  created_at TIMESTAMPTZ
);`}</CodeBlock>
      </Section>
    </div>
  );
}

function TechnicalSection() {
  return (
    <div className="space-y-6">
      <Section title="Technische Details">
        <p className="text-slate-700 mb-4">
          Het Patient Portal is een standalone Next.js applicatie die 
          dezelfde Supabase backend deelt met de andere apps.
        </p>
      </Section>

      <Section title="Projectstructuur">
        <CodeBlock title="Mappenstructuur">{`
apps/patient-portal/
├── app/
│   ├── page.tsx              # Homepage/dashboard
│   ├── login/                # Authenticatie
│   └── vitals/               # Vitals invoer pagina
├── components/
│   └── ZibBloodPressureCard.tsx  # Bloeddruk component
├── config/
│   └── prompts.ts            # AI prompt configuratie
├── public/                   # Static assets
└── package.json
`}</CodeBlock>
      </Section>

      <Section title="Environment Variables">
        <CodeBlock title=".env.local">{`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001`}</CodeBlock>
      </Section>

      <Section title="Development">
        <CodeBlock title="Commands">{`# Start patient portal only
pnpm dev --filter patient-portal

# Build
pnpm build --filter patient-portal

# Port
http://localhost:3001`}</CodeBlock>
      </Section>
    </div>
  );
}

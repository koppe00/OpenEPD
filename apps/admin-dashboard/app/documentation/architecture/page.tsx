'use client';

import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { 
  BookOpen, 
  Layers, 
  Database,
  Server,
  Globe,
  Code,
  GitBranch,
  Package,
  Cpu,
  HardDrive,
  Network,
  Shield,
  Workflow,
  Boxes
} from 'lucide-react';

export default function ArchitectureDocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'OpenEPD_Architectuur.pdf',
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
        <h2 className="text-lg font-black text-slate-900 mb-4">Architectuur</h2>
        <nav className="space-y-1">
          <NavItem 
            icon={BookOpen} 
            label="Overzicht" 
            active={activeSection === 'overview'}
            onClick={() => setActiveSection('overview')}
          />
          <NavItem 
            icon={Boxes} 
            label="Monorepo Structuur" 
            active={activeSection === 'monorepo'}
            onClick={() => setActiveSection('monorepo')}
          />
          <NavItem 
            icon={Layers} 
            label="Applicaties" 
            active={activeSection === 'apps'}
            onClick={() => setActiveSection('apps')}
          />
          <NavItem 
            icon={Package} 
            label="Packages" 
            active={activeSection === 'packages'}
            onClick={() => setActiveSection('packages')}
          />
          <NavItem 
            icon={Server} 
            label="Infrastructure" 
            active={activeSection === 'infrastructure'}
            onClick={() => setActiveSection('infrastructure')}
          />
          <NavItem 
            icon={Database} 
            label="Data Flow" 
            active={activeSection === 'dataflow'}
            onClick={() => setActiveSection('dataflow')}
          />
          <NavItem 
            icon={Shield} 
            label="Security" 
            active={activeSection === 'security'}
            onClick={() => setActiveSection('security')}
          />
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between max-w-4xl mb-4">
          <AdminHeader 
            title="Systeem Architectuur" 
            subtitle="Technische architectuur en monorepo structuur van OpenEPD"
          />
          <button
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={handleExportPDF}
            title="Exporteer volledige documentatie naar PDF"
          >
            Export PDF
          </button>
        </div>
        <div className="max-w-4xl" ref={contentRef}>
          <OverviewSection />
          <MonorepoSection />
          <AppsSection />
          <PackagesSection />
          <InfrastructureSection />
          <DataFlowSection />
          <SecuritySection />
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
          ? 'bg-blue-50 text-blue-700' 
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
        <Icon size={16} className="text-blue-600" />
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
      <Section title="OpenEPD Architectuur Overzicht">
        <p className="text-slate-700 mb-4">
          OpenEPD is een open-source Elektronisch Patiëntendossier (EPD) dat de patiënt centraal stelt. 
          Het systeem is ontworpen met focus op transparantie, interoperabiliteit en patiëntcontrole 
          over hun eigen medische gegevens.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-blue-900 mb-2">Kern Principes</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Data Soevereiniteit:</strong> Patiënt is eigenaar van eigen data</li>
            <li>• <strong>Interoperabiliteit:</strong> HL7 FHIR, openEHR, SNOMED CT, DICOM</li>
            <li>• <strong>Open Source:</strong> GPL v3 licentie</li>
            <li>• <strong>AI-First:</strong> Maximale ondersteuning van zorgverleners met AI</li>
          </ul>
        </div>
      </Section>

      <Section title="High-Level Architectuur">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FeatureCard 
            icon={Globe}
            title="Multi-Persona Frontend"
            description="Drie Next.js apps: Provider Dashboard, Patient Portal, Admin Dashboard"
          />
          <FeatureCard 
            icon={Database}
            title="Supabase Backend"
            description="PostgreSQL database met realtime subscriptions en Row Level Security"
          />
          <FeatureCard 
            icon={Cpu}
            title="Event-Driven Architecture"
            description="Kafka message bus voor async processing en microservices communicatie"
          />
          <FeatureCard 
            icon={Shield}
            title="Compliance Ready"
            description="NEN 7510, AVG/GDPR, WGBO compliant met audit trails"
          />
        </div>
        
        <CodeBlock title="Architectuur Diagram (ASCII)">{`
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                                │
├──────────────────┬──────────────────┬───────────────────────────────┤
│  Provider        │  Patient         │  Admin                        │
│  Dashboard       │  Portal          │  Dashboard                    │
│  (localhost:3000)│  (localhost:3001)│  (localhost:3002)             │
└────────┬─────────┴────────┬─────────┴─────────┬─────────────────────┘
         │                  │                   │
         └──────────────────┴───────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────────┐
│                        API LAYER                                     │
│  Next.js API Routes + Supabase Edge Functions                        │
└────────────────────────────┬────────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────────┐
│                        DATA LAYER                                    │
├─────────────────────┬─────────────────────┬─────────────────────────┤
│  Supabase           │  EHRbase            │  Kafka                  │
│  (PostgreSQL +      │  (openEHR Clinical  │  (Event Bus)            │
│   Auth + Storage)   │   Data Repository)  │                         │
└─────────────────────┴─────────────────────┴─────────────────────────┘
`}</CodeBlock>
      </Section>

      <Section title="Tech Stack">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <TechBadge name="Next.js 16" category="Frontend" />
          <TechBadge name="React 19" category="Frontend" />
          <TechBadge name="TypeScript" category="Language" />
          <TechBadge name="Tailwind CSS" category="Styling" />
          <TechBadge name="Supabase" category="Backend" />
          <TechBadge name="PostgreSQL" category="Database" />
          <TechBadge name="Kafka" category="Messaging" />
          <TechBadge name="Docker" category="Infrastructure" />
          <TechBadge name="EHRbase" category="openEHR" />
          <TechBadge name="Turborepo" category="Build" />
          <TechBadge name="pnpm" category="Package Mgr" />
          <TechBadge name="Gemini AI" category="AI" />
        </div>
      </Section>
    </div>
  );
}

function TechBadge({ name, category }: { name: string; category: string }) {
  return (
    <div className="bg-slate-100 rounded-lg px-3 py-2 text-center">
      <div className="font-bold text-slate-900 text-sm">{name}</div>
      <div className="text-xs text-slate-500">{category}</div>
    </div>
  );
}

function MonorepoSection() {
  return (
    <div className="space-y-6">
      <Section title="Monorepo Structuur">
        <p className="text-slate-700 mb-4">
          OpenEPD gebruikt Turborepo voor monorepo management. Dit maakt het mogelijk om 
          meerdere applicaties en packages in één repository te beheren met gedeelde code.
        </p>
        
        <CodeBlock title="Mappenstructuur">{`
OpenEPD/
├── apps/                          # Frontend applicaties
│   ├── admin-dashboard/           # Beheerportaal (port 3002)
│   ├── patient-portal/            # Patiënt app (port 3001)
│   ├── provider-dashboard/        # Zorgverlener app (port 3000)
│   └── shared/                    # Gedeelde componenten
│
├── packages/                      # Herbruikbare packages
│   ├── clinical-core/             # ZIB configuratie & types
│   ├── agent-services/            # AI agents (triage, etc)
│   ├── workflow-engine/           # BPMN workflow runner
│   ├── projection-service/        # CQRS read models
│   └── openehr-client/            # EHRbase client
│
├── infrastructure/                # Docker configs
│   ├── ehrbase/                   # openEHR server
│   └── kafka/                     # Message bus
│
├── services/                      # Backend services
│   └── supabase/                  # Database migraties
│
└── docs/                          # Documentatie
`}</CodeBlock>
      </Section>

      <Section title="Turborepo Configuratie">
        <p className="text-slate-700 mb-4">
          Turborepo optimaliseert builds door intelligent caching en parallel execution.
        </p>
        
        <CodeBlock title="turbo.json">{`{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}`}</CodeBlock>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-bold text-amber-900 mb-2">💡 Development Commands</h4>
          <ul className="text-sm text-amber-800 space-y-1 font-mono">
            <li>pnpm dev                    # Start alle apps</li>
            <li>pnpm dev --filter admin-dashboard   # Start alleen admin</li>
            <li>pnpm build                  # Build alle apps</li>
            <li>pnpm lint                   # Lint alle packages</li>
          </ul>
        </div>
      </Section>

      <Section title="Package Dependencies">
        <CodeBlock title="pnpm-workspace.yaml">{`packages:
  - "apps/*"
  - "packages/*"`}</CodeBlock>
        
        <p className="text-slate-700 mt-4 mb-2">
          Packages kunnen elkaar importeren via workspace protocol:
        </p>
        
        <CodeBlock title="package.json (provider-dashboard)">{`{
  "dependencies": {
    "@openepd/clinical-core": "workspace:*",
    "@openepd/workflow-engine": "workspace:*"
  }
}`}</CodeBlock>
      </Section>
    </div>
  );
}

function AppsSection() {
  return (
    <div className="space-y-6">
      <Section title="Frontend Applicaties">
        <p className="text-slate-700 mb-4">
          OpenEPD heeft drie Next.js applicaties, elk gericht op een specifieke gebruikersgroep.
        </p>
      </Section>

      <Section title="Provider Dashboard (port 3000)">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">MAIN APP</span>
          <span className="text-slate-600 text-sm">Zorgverlener werkstation</span>
        </div>
        
        <p className="text-slate-700 mb-4">
          Het centrale werkstation voor artsen en verpleegkundigen. Biedt toegang tot patiëntdossiers, 
          klinische workflows en AI-ondersteunde documentatie.
        </p>
        
        <h4 className="font-bold text-slate-900 mb-2">Belangrijkste Features:</h4>
        <ul className="text-sm text-slate-700 space-y-1 mb-4">
          <li>• <strong>Smart Template Editor:</strong> Hybride narratieve + gestructureerde verslaglegging</li>
          <li>• <strong>ZIB Widgets:</strong> Dynamische klinische data invoer (120+ ZIB types)</li>
          <li>• <strong>Voice Assistant:</strong> AI-gestuurde spraakherkenning voor consult documentatie</li>
          <li>• <strong>Workflow Navigator:</strong> Context-switching (Poli, Kliniek, SEH, OK)</li>
          <li>• <strong>Triage Module:</strong> AI-ondersteunde verwijzingen verwerking</li>
          <li>• <strong>Protocol Engine:</strong> Klinische besluitondersteuning</li>
        </ul>
        
        <CodeBlock title="Key Components">{`
apps/provider-dashboard/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── patient/[id]/         # Patient detail view
│   ├── triage/               # Triage inbox
│   └── workflow/             # Workflow editor
├── components/
│   └── dashboard/
│       ├── ai/               # AI widgets
│       ├── clinical/         # Clinical components
│       ├── widgets/          # ZIB widgets
│       └── modules/          # Feature modules
└── hooks/
    ├── useClinicalData.ts    # ZIB data management
    ├── useDashboardLayout.ts # UI template loading
    └── useWorkContexts.ts    # Context switching
`}</CodeBlock>
      </Section>

      <Section title="Patient Portal (port 3001)">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">PATIENT APP</span>
          <span className="text-slate-600 text-sm">Patiënt self-service</span>
        </div>
        
        <p className="text-slate-700 mb-4">
          Laagdrempelige interface voor patiënten om eigen medische gegevens in te zien, 
          metingen te registreren en met zorgverleners te communiceren.
        </p>
        
        <h4 className="font-bold text-slate-900 mb-2">Features:</h4>
        <ul className="text-sm text-slate-700 space-y-1 mb-4">
          <li>• Inzage in medisch dossier (bloeddruk, labwaarden)</li>
          <li>• Self-registration van vitale parameters</li>
          <li>• Afspraken overzicht</li>
          <li>• Consent management</li>
        </ul>
      </Section>

      <Section title="Admin Dashboard (port 3002)">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">ADMIN APP</span>
          <span className="text-slate-600 text-sm">Beheerportaal</span>
        </div>
        
        <p className="text-slate-700 mb-4">
          Beheerportaal voor systeembeheerders om gebruikers, templates, AI configuratie 
          en referentiedata te beheren.
        </p>
        
        <h4 className="font-bold text-slate-900 mb-2">Modules:</h4>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• <strong>Gebruikersbeheer:</strong> CRUD users, rollen, specialismen, werkcontexten</li>
          <li>• <strong>UI Configuration:</strong> Template builder, widget configuratie</li>
          <li>• <strong>AI Governance:</strong> Feature management, scope-based prompts</li>
          <li>• <strong>Reference Data:</strong> Specialismen, werkcontexten, ICD-10 codes</li>
          <li>• <strong>Workflow:</strong> BPMN process editor</li>
          <li>• <strong>Documentatie:</strong> In-app handleidingen (deze pagina!)</li>
        </ul>
      </Section>
    </div>
  );
}

function PackagesSection() {
  return (
    <div className="space-y-6">
      <Section title="Shared Packages">
        <p className="text-slate-700 mb-4">
          Herbruikbare packages die door meerdere apps worden gebruikt. 
          Gemanaged via pnpm workspaces.
        </p>
      </Section>

      <Section title="@openepd/clinical-core">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">CORE</span>
          <span className="text-slate-600 text-sm">Klinische standaarden</span>
        </div>
        
        <p className="text-slate-700 mb-4">
          Bevat alle ZIB (Zorginformatiebouwsteen) configuraties conform NICTIZ 2024 Gold Standard. 
          120+ ZIB types met veldconfiguraties, validatie en terminologie.
        </p>
        
        <CodeBlock title="ZIB Voorbeeld: Bloeddruk">{`// packages/clinical-core/src/constants/zibConfig.ts

'nl.zorg.Bloeddruk': [
  { name: 'systolic', label: 'Systolisch', type: 'number', unit: 'mmHg' },
  { name: 'diastolic', label: 'Diastolisch', type: 'number', unit: 'mmHg' },
  { 
    name: 'position', 
    label: 'Houding', 
    type: 'select', 
    options: [
      { value: 'Sitting', label: 'Zittend' },
      { value: 'Lying', label: 'Liggend' },
      { value: 'Standing', label: 'Staand' }
    ] 
  },
  { name: 'cuff_size', label: 'Manchet', type: 'select', ... }
]`}</CodeBlock>
        
        <h4 className="font-bold text-slate-900 mt-4 mb-2">ZIB Categorieën:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-slate-50 p-2 rounded">
            <strong>Metingen:</strong> Bloeddruk, Pols, Saturatie, Temperatuur, Gewicht, Lengte
          </div>
          <div className="bg-slate-50 p-2 rounded">
            <strong>Lab:</strong> LaboratoriumUitslag, TekstUitslag, Bloedbeeld
          </div>
          <div className="bg-slate-50 p-2 rounded">
            <strong>Diagnoses:</strong> Aandoening, Probleem, Allergie
          </div>
          <div className="bg-slate-50 p-2 rounded">
            <strong>Verslagen:</strong> Anamnese, Onderzoek, Evaluatie, Beleid
          </div>
        </div>
      </Section>

      <Section title="@openepd/workflow-engine">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">PROTOTYPE</span>
          <span className="text-slate-600 text-sm">BPMN workflow runner</span>
        </div>
        
        <p className="text-slate-700 mb-4">
          Proof-of-concept workflow engine die BPMN processen kan uitvoeren. 
          Integreert met Kafka voor event-driven service tasks.
        </p>
        
        <CodeBlock title="ACS Protocol (BPMN fragment)">{`<bpmn:process id="acs-process" name="ACS Protocol">
  <bpmn:startEvent id="startChestPain" name="Patiënt meldt pijn"/>
  <bpmn:task id="intakeTask" name="Snelle Intake"/>
  <bpmn:serviceTask id="orderECG" name="ECG Aanvragen" 
    camunda:expression="\${orderService.createOrder('ECG', 'STAT')}"/>
  <bpmn:exclusiveGateway id="checkECG" name="ST-elevatie?"/>
  <bpmn:serviceTask id="planPCI" name="PCI Plannen"/>
</bpmn:process>`}</CodeBlock>
      </Section>

      <Section title="@openepd/agent-services">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">AI</span>
          <span className="text-slate-600 text-sm">AI Agent services</span>
        </div>
        
        <p className="text-slate-700 mb-4">
          AI agents voor klinische taken zoals triage en automatische verslaglegging. 
          Gebruikt Kafka consumers voor async processing.
        </p>
        
        <h4 className="font-bold text-slate-900 mb-2">Beschikbare Agents:</h4>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• <strong>Triage Agent:</strong> Automatische prioritering van verwijzingen</li>
          <li>• <strong>Extraction Agent:</strong> ZIB extractie uit vrije tekst/spraak</li>
          <li>• <strong>Coding Agent:</strong> ICD-10/DBC code suggesties</li>
        </ul>
      </Section>

      <Section title="@openepd/projection-service">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-bold">CQRS</span>
          <span className="text-slate-600 text-sm">Read model projections</span>
        </div>
        
        <p className="text-slate-700 mb-4">
          CQRS implementatie die events van Kafka verwerkt en read-optimized views 
          opbouwt in Supabase. Scheidt write-path van read-path.
        </p>
      </Section>
    </div>
  );
}

function InfrastructureSection() {
  return (
    <div className="space-y-6">
      <Section title="Infrastructure Components">
        <p className="text-slate-700 mb-4">
          Docker-based infrastructure voor development en productie. 
          Alle services zijn containerized voor consistente deployment.
        </p>
      </Section>

      <Section title="Supabase (Primary Database)">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">CLOUD</span>
          <span className="text-slate-600 text-sm">jlatbisropqmrkilphuz.supabase.co</span>
        </div>
        
        <p className="text-slate-700 mb-4">
          Supabase levert PostgreSQL database, authenticatie, realtime subscriptions 
          en storage. Row Level Security (RLS) voor fine-grained toegangscontrole.
        </p>
        
        <h4 className="font-bold text-slate-900 mb-2">Key Tables:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="bg-slate-50 p-2 rounded font-mono">profiles</div>
          <div className="bg-slate-50 p-2 rounded font-mono">zib_compositions</div>
          <div className="bg-slate-50 p-2 rounded font-mono">work_contexts</div>
          <div className="bg-slate-50 p-2 rounded font-mono">ui_templates</div>
          <div className="bg-slate-50 p-2 rounded font-mono">ai_config_scopes</div>
          <div className="bg-slate-50 p-2 rounded font-mono">referrals</div>
        </div>
      </Section>

      <Section title="EHRbase (openEHR Server)">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">DOCKER</span>
          <span className="text-slate-600 text-sm">localhost:8080</span>
        </div>
        
        <p className="text-slate-700 mb-4">
          openEHR compliant Clinical Data Repository. Slaat klinische data op 
          volgens openEHR archetypes voor maximale interoperabiliteit.
        </p>
        
        <CodeBlock title="infrastructure/ehrbase/docker-compose.yml">{`services:
  ehrdb:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: ehrbase
      POSTGRES_USER: ehrbase
      POSTGRES_DB: ehrbase
    ports:
      - "5432:5432"

  ehrbase:
    image: ehrbase/ehrbase:next
    environment:
      DB_URL: jdbc:postgresql://ehrdb:5432/ehrbase
      SECURITY_AUTH_USER: admin
      SECURITY_AUTH_PASSWORD: password
    ports:
      - "8080:8080"
    depends_on:
      ehrdb:
        condition: service_healthy`}</CodeBlock>
      </Section>

      <Section title="Kafka (Message Bus)">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">DOCKER</span>
          <span className="text-slate-600 text-sm">localhost:9092</span>
        </div>
        
        <p className="text-slate-700 mb-4">
          Apache Kafka voor event-driven architectuur. Ondersteunt async processing 
          van klinische events en service-to-service communicatie.
        </p>
        
        <h4 className="font-bold text-slate-900 mb-2">Topics:</h4>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• <code className="bg-slate-100 px-1 rounded">order-created</code> - Nieuwe orders (lab, imaging)</li>
          <li>• <code className="bg-slate-100 px-1 rounded">referral-received</code> - Inkomende verwijzingen</li>
          <li>• <code className="bg-slate-100 px-1 rounded">zib-updated</code> - Klinische data wijzigingen</li>
        </ul>
        
        <CodeBlock title="infrastructure/kafka/docker-compose.yml">{`services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.4.0
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
    ports:
      - "9092:9092"`}</CodeBlock>
      </Section>
    </div>
  );
}

function DataFlowSection() {
  return (
    <div className="space-y-6">
      <Section title="Data Flow & CQRS">
        <p className="text-slate-700 mb-4">
          OpenEPD implementeert CQRS (Command Query Responsibility Segregation) 
          voor optimale schaalbaarheid en data consistency.
        </p>
        
        <CodeBlock title="Data Flow Diagram">{`
┌─────────────────────────────────────────────────────────────────────┐
│                         WRITE PATH                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   User Input ──► API Route ──► Supabase ──► Kafka Event            │
│                                  │                                   │
│                                  └──► zib_compositions              │
│                                  └──► verslagen                      │
│                                  └──► ai_extractions                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                          Kafka (order-created)
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         READ PATH                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Projection Service ──► Supabase Realtime ──► Dashboard Widgets   │
│         │                                                            │
│         └──► Denormalized views for fast queries                    │
│         └──► Aggregates (patient timeline, trends)                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
`}</CodeBlock>
      </Section>

      <Section title="Vault Sync (Data Sovereignty)">
        <p className="text-slate-700 mb-4">
          Unieke feature: patiënten kunnen kiezen waar hun data wordt opgeslagen. 
          De cloud is slechts een transit station - data kan naar persoonlijke vault worden gesynchroniseerd.
        </p>
        
        <CodeBlock title="Storage Status Flow">{`
sync_pending ──► local_vault_only
     │                 │
     │                 └──► Data in persoonlijke kluis
     │
     └──► Data in cloud transit
`}</CodeBlock>
        
        <h4 className="font-bold text-slate-900 mt-4 mb-2">Storage Options:</h4>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• <strong>Personal NAS:</strong> Lokale opslag thuis</li>
          <li>• <strong>Cloud Storage:</strong> Google Drive, OneDrive</li>
          <li>• <strong>Institution Server:</strong> Ziekenhuis datacenter</li>
          <li>• <strong>OpenEPD Cloud:</strong> Managed hosting</li>
        </ul>
      </Section>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-6">
      <Section title="Security & Compliance">
        <p className="text-slate-700 mb-4">
          OpenEPD is ontworpen met security-first principes, compliant met 
          Nederlandse en Europese regelgeving voor medische data.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-900 mb-2">✓ NEN 7510</h4>
            <p className="text-sm text-green-800">
              Nederlandse norm voor informatiebeveiliging in de zorg
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-900 mb-2">✓ AVG/GDPR</h4>
            <p className="text-sm text-green-800">
              Privacy by design, data minimalisatie, recht op vergetelheid
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-900 mb-2">✓ WGBO</h4>
            <p className="text-sm text-green-800">
              Wet op de Geneeskundige Behandelingsovereenkomst
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-900 mb-2">✓ MedMij</h4>
            <p className="text-sm text-green-800">
              Afsprakenstelsel voor gegevensuitwisseling
            </p>
          </div>
        </div>
      </Section>

      <Section title="Authentication & Authorization">
        <h4 className="font-bold text-slate-900 mb-2">Supabase Auth</h4>
        <ul className="text-sm text-slate-700 space-y-1 mb-4">
          <li>• JWT tokens met refresh rotation</li>
          <li>• Email/password + magic link login</li>
          <li>• MFA ondersteuning (TOTP)</li>
          <li>• Session management</li>
        </ul>
        
        <h4 className="font-bold text-slate-900 mb-2">Row Level Security (RLS)</h4>
        <CodeBlock title="RLS Policy Example">{`-- Users can only see their own profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Caregivers can see patients they have relationship with
CREATE POLICY "Caregivers view patients" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM care_relationships 
      WHERE caregiver_user_id = auth.uid() 
      AND patient_user_id = profiles.id
    )
  );`}</CodeBlock>
      </Section>

      <Section title="Audit Logging">
        <p className="text-slate-700 mb-4">
          Alle acties worden gelogd voor compliance en forensisch onderzoek.
        </p>
        
        <h4 className="font-bold text-slate-900 mb-2">Logged Events:</h4>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• Login/logout events</li>
          <li>• Patient record access</li>
          <li>• Data modifications (CREATE, UPDATE, DELETE)</li>
          <li>• AI extractions and approvals</li>
          <li>• Configuration changes</li>
        </ul>
      </Section>
    </div>
  );
}

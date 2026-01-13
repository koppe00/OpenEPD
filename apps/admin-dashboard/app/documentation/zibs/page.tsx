'use client';

import React, { useState, useRef } from 'react';
// Import html2pdf.js for PDF export
import html2pdf from 'html2pdf.js';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { 
  BookOpen, 
  Database,
  FileJson,
  CheckCircle,
  List,
  Code,
  AlertCircle,
  Heart,
  Thermometer,
  Scale,
  Activity,
  Stethoscope,
  Pill,
  FileText,
  GraduationCap,
  ArrowRight,
  FolderPlus,
  Settings
} from 'lucide-react';

export default function ZibDocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'OpenEPD_ZIB_Implementatie.pdf',
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
        <h2 className="text-lg font-black text-slate-900 mb-4">ZIB Implementatie</h2>
        <nav className="space-y-1">
          <NavItem 
            icon={BookOpen} 
            label="Overzicht" 
            active={activeSection === 'overview'}
            onClick={() => setActiveSection('overview')}
          />
          <NavItem 
            icon={GraduationCap} 
            label="🎓 Tutorial" 
            active={activeSection === 'tutorial'}
            onClick={() => setActiveSection('tutorial')}
          />
          <NavItem 
            icon={List} 
            label="ZIB Catalogus" 
            active={activeSection === 'catalog'}
            onClick={() => setActiveSection('catalog')}
          />
          <NavItem 
            icon={FileJson} 
            label="ZIB Config" 
            active={activeSection === 'config'}
            onClick={() => setActiveSection('config')}
          />
          <NavItem 
            icon={Database} 
            label="Database Schema" 
            active={activeSection === 'database'}
            onClick={() => setActiveSection('database')}
          />
          <NavItem 
            icon={CheckCircle} 
            label="Validatie" 
            active={activeSection === 'validation'}
            onClick={() => setActiveSection('validation')}
          />
          <NavItem 
            icon={Code} 
            label="API Gebruik" 
            active={activeSection === 'api'}
            onClick={() => setActiveSection('api')}
          />
          <NavItem 
            icon={AlertCircle} 
            label="Best Practices" 
            active={activeSection === 'best-practices'}
            onClick={() => setActiveSection('best-practices')}
          />
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between max-w-4xl mb-4">
          <AdminHeader 
            title="ZIB Implementatie Documentatie" 
            subtitle="NICTIZ 2024 Gold Standard Zorginformatiebouwstenen"
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
          {activeSection === 'overview' && <OverviewSection setActiveSection={setActiveSection} />}
          {activeSection === 'tutorial' && <TutorialSection />}
          {activeSection === 'catalog' && <CatalogSection />}
          {activeSection === 'config' && <ConfigSection />}
          {activeSection === 'database' && <DatabaseSection />}
          {activeSection === 'validation' && <ValidationSection />}
          {activeSection === 'api' && <APISection />}
          {activeSection === 'best-practices' && <BestPracticesSection />}
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

function OverviewSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <div className="space-y-6">
      <Section title="Wat zijn ZIBs?">
        <p className="text-slate-700 mb-4">
          <strong>Zorginformatiebouwstenen (ZIBs)</strong> zijn gestandaardiseerde definities 
          van klinische concepten, ontwikkeld door NICTIZ (Nationaal ICT Instituut in de Zorg). 
          Ze vormen de basis voor interoperabiliteit in de Nederlandse zorg.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-blue-900 mb-2">🏥 NICTIZ 2024 Gold Standard</h4>
          <p className="text-sm text-blue-800">
            OpenEPD implementeert de volledige NICTIZ 2024 ZIB specificatie met 120+ 
            zorginformatiebouwstenen voor maximale interoperabiliteit met andere systemen.
          </p>
        </div>
      </Section>

      {/* Quick Start CTA */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <GraduationCap size={24} className="text-green-600" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Nieuwe ZIB toevoegen?</h3>
        </div>
        <p className="text-slate-700 mb-4">
          Volg onze stap-voor-stap tutorial om een nieuwe ZIB correct te implementeren in OpenEPD.
        </p>
        <button
          onClick={() => setActiveSection('tutorial')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Start Tutorial
          <ArrowRight size={16} />
        </button>
      </div>

      <Section title="ZIB Categorieën in OpenEPD">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <CategoryCard 
            icon={Heart}
            title="Vitals"
            count={10}
            examples="Bloeddruk, Pols, Saturatie"
          />
          <CategoryCard 
            icon={Stethoscope}
            title="Onderzoek"
            count={15}
            examples="Lichamelijk onderzoek, Visus"
          />
          <CategoryCard 
            icon={Activity}
            title="Lab"
            count={8}
            examples="Labuitslag, Bloedbeeld"
          />
          <CategoryCard 
            icon={Pill}
            title="Medicatie"
            count={12}
            examples="Medicatiegebruik, Allergie"
          />
          <CategoryCard 
            icon={FileText}
            title="Verslagen"
            count={20}
            examples="Anamnese, Evaluatie, Beleid"
          />
          <CategoryCard 
            icon={Scale}
            title="Overig"
            count={55}
            examples="Probleem, Verrichting, Consent"
          />
        </div>
      </Section>

      <Section title="ZIB Architectuur">
        <CodeBlock title="ZIB Data Flow">{`
┌─────────────────────────────────────────────────────────────────────┐
│                        ZIB ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌───────────────┐                                                 │
│   │  ZIB_CONFIG   │  ← TypeScript configuratie (clinical-core)      │
│   │  (120+ ZIBs)  │                                                 │
│   └───────┬───────┘                                                 │
│           │                                                          │
│           ▼                                                          │
│   ┌───────────────┐                                                 │
│   │  ZIB Widget   │  ← React component voor data invoer            │
│   │  (Form/Card)  │                                                 │
│   └───────┬───────┘                                                 │
│           │                                                          │
│           ▼                                                          │
│   ┌───────────────┐                                                 │
│   │ Validation    │  ← Schema validatie voor opslag                │
│   │ (Preprocessing)│                                                │
│   └───────┬───────┘                                                 │
│           │                                                          │
│           ▼                                                          │
│   ┌───────────────┐                                                 │
│   │zib_compositions│  ← PostgreSQL tabel (Supabase)                │
│   │  (JSON data)  │                                                 │
│   └───────────────┘                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
`}</CodeBlock>
      </Section>

      <Section title="Key Files">
        <ul className="text-sm text-slate-700 space-y-2">
          <li className="flex items-center gap-2">
            <code className="bg-slate-100 px-2 py-1 rounded text-xs">packages/clinical-core/src/constants/zibConfig.ts</code>
            <span className="text-slate-500">→ ZIB definities</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="bg-slate-100 px-2 py-1 rounded text-xs">packages/clinical-core/src/constants/terminology.ts</code>
            <span className="text-slate-500">→ Codelijsten</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="bg-slate-100 px-2 py-1 rounded text-xs">packages/clinical-core/src/validation/</code>
            <span className="text-slate-500">→ Validatie schemas</span>
          </li>
        </ul>
      </Section>
    </div>
  );
}

function CategoryCard({ icon: Icon, title, count, examples }: any) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className="text-blue-600" />
        <span className="font-bold text-slate-900">{title}</span>
        <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      <p className="text-xs text-slate-500">{examples}</p>
    </div>
  );
}

function TutorialStep({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
          {step}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
        <div className="text-slate-700 space-y-3">{children}</div>
      </div>
    </div>
  );
}

function TutorialSection() {
  return (
    <div className="space-y-6">
      {/* Tutorial Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap size={28} />
          <h2 className="text-2xl font-black">Tutorial: Een Nieuwe ZIB Toevoegen</h2>
        </div>
        <p className="text-green-100">
          Leer stap-voor-stap hoe je een nieuwe Zorginformatiebouwsteen (ZIB) implementeert in OpenEPD.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-green-200">
          <span>⏱️ Geschatte tijd: 30-45 minuten</span>
          <span className="mx-2">•</span>
          <span>📋 Vereist: TypeScript, React kennis</span>
        </div>
      </div>

      {/* Prerequisites */}
      <Section title="Voorbereidingen">
        <p className="text-slate-700 mb-4">
          Voordat je begint, zorg dat je het volgende bij de hand hebt:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-blue-600" />
              <span className="font-semibold text-blue-900">NICTIZ Specificatie</span>
            </div>
            <p className="text-sm text-blue-800">
              Download de officiële ZIB specificatie van{' '}
              <a href="https://zibs.nl" target="_blank" className="underline">zibs.nl</a>.
              Let op de veldnamen, datatypes en codelijsten.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings size={18} className="text-amber-600" />
              <span className="font-semibold text-amber-900">Development Setup</span>
            </div>
            <p className="text-sm text-amber-800">
              Zorg dat je de monorepo lokaal draait met <code className="bg-white px-1 rounded">pnpm dev</code> 
              en toegang hebt tot de Supabase database.
            </p>
          </div>
        </div>
      </Section>

      {/* Example ZIB */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-4">
        <h4 className="font-bold text-slate-900 mb-2">📋 Voorbeeld: We voegen "Hartfrequentie" (nl.zorg.Hartfrequentie) toe</h4>
        <p className="text-sm text-slate-600">
          Deze ZIB bevat: heart_rate (number), measurement_method (codelijst), body_position (codelijst), 
          en measurement_datetime (timestamp).
        </p>
      </div>

      {/* Tutorial Steps */}
      <Section title="Stap-voor-stap handleiding">
        <div className="space-y-8">
          <TutorialStep step={1} title="Voeg de ZIB toe aan zibConfig.ts">
            <p>
              Open <code className="bg-slate-100 px-2 py-0.5 rounded">packages/clinical-core/src/constants/zibConfig.ts</code> 
              en voeg een nieuwe entry toe aan het <code>zibConfig</code> object:
            </p>
            <CodeBlock title="zibConfig.ts">{`// Voeg toe aan het zibConfig object:
'nl.zorg.Hartfrequentie': {
  id: 'nl.zorg.Hartfrequentie',
  name: 'Hartfrequentie',
  name_en: 'Heart Rate',
  category: 'vitals',
  version: '4.0',
  nictiz_url: 'https://zibs.nl/wiki/Hartfrequentie-v4.0(2024NL)',
  
  fields: [
    {
      name: 'heart_rate',
      type: 'quantity',
      label: 'Hartfrequentie',
      unit: '/min',
      required: true,
      validation: {
        min: 20,
        max: 300,
        decimals: 0
      }
    },
    {
      name: 'measurement_method',
      type: 'codelist',
      label: 'Meetmethode',
      codelist: 'HeartRateMeasurementMethodCodelist',
      required: false
    },
    {
      name: 'body_position',
      type: 'codelist',
      label: 'Lichaamshouding',
      codelist: 'BodyPositionCodelist',
      required: false
    },
    {
      name: 'measurement_datetime',
      type: 'datetime',
      label: 'Meetdatum/tijd',
      required: true
    }
  ],
  
  // Widget mapping
  widget_type: 'measurement_card',
  icon: 'Heart',
  color: 'red'
}`}</CodeBlock>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Gebruik de NICTIZ specificatie om de correcte veldnamen en datatypes te bepalen. 
                De <code>id</code> moet exact overeenkomen met de NICTIZ OID.
              </p>
            </div>
          </TutorialStep>

          <TutorialStep step={2} title="Voeg codelijsten toe aan terminology.ts">
            <p>
              Als de ZIB codelijsten gebruikt, voeg deze toe aan <code className="bg-slate-100 px-2 py-0.5 rounded">packages/clinical-core/src/constants/terminology.ts</code>:
            </p>
            <CodeBlock title="terminology.ts">{`// Voeg nieuwe codelijst toe:
export const HeartRateMeasurementMethodCodelist = {
  codelist_id: 'HeartRateMeasurementMethodCodelist',
  name: 'Hartfrequentie Meetmethode',
  codes: [
    {
      code: 'AUSCULTATION',
      display: 'Auscultatie',
      system: 'urn:oid:2.16.840.1.113883.2.4.3.11.60.40.4.24.1'
    },
    {
      code: 'PALPATION',
      display: 'Palpatie',
      system: 'urn:oid:2.16.840.1.113883.2.4.3.11.60.40.4.24.1'
    },
    {
      code: 'AUTOMATIC',
      display: 'Automatisch (apparaat)',
      system: 'urn:oid:2.16.840.1.113883.2.4.3.11.60.40.4.24.1'
    },
    {
      code: 'ECG',
      display: 'ECG',
      system: 'urn:oid:2.16.840.1.113883.2.4.3.11.60.40.4.24.1'
    }
  ]
};`}</CodeBlock>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-amber-800">
                <strong>⚠️ Let op:</strong> Gebruik de officiële NICTIZ OIDs voor de <code>system</code> waarden. 
                Deze vind je in de NICTIZ specificatie onder "ValueSets".
              </p>
            </div>
          </TutorialStep>

          <TutorialStep step={3} title="Maak een validatie schema">
            <p>
              Maak een Zod schema voor validatie in <code className="bg-slate-100 px-2 py-0.5 rounded">packages/clinical-core/src/validation/zib-schemas/</code>:
            </p>
            <CodeBlock title="heartRate.schema.ts">{`import { z } from 'zod';
import { baseZibSchema } from '../base-schema';

export const heartRateSchema = baseZibSchema.extend({
  heart_rate: z.number()
    .min(20, 'Hartfrequentie moet minimaal 20/min zijn')
    .max(300, 'Hartfrequentie mag maximaal 300/min zijn')
    .int('Hartfrequentie moet een geheel getal zijn'),
  
  measurement_method: z.string().optional(),
  body_position: z.string().optional(),
  measurement_datetime: z.string().datetime()
});

export type HeartRateZib = z.infer<typeof heartRateSchema>;`}</CodeBlock>
            <p className="mt-4">
              Exporteer het schema via de index file:
            </p>
            <CodeBlock title="validation/index.ts">{`// Voeg export toe:
export { heartRateSchema, type HeartRateZib } from './zib-schemas/heartRate.schema';`}</CodeBlock>
          </TutorialStep>

          <TutorialStep step={4} title="Maak een React Widget Component">
            <p>
              Maak een widget voor data weergave in <code className="bg-slate-100 px-2 py-0.5 rounded">apps/provider-dashboard/components/zibs/</code>:
            </p>
            <CodeBlock title="ZibHeartRateCard.tsx">{`'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface HeartRateData {
  heart_rate: number;
  measurement_method?: string;
  body_position?: string;
  measurement_datetime: string;
}

export function ZibHeartRateCard({ data }: { data: HeartRateData }) {
  // Bepaal status kleur op basis van waarde
  const getStatusColor = (rate: number) => {
    if (rate < 60) return 'text-blue-600 bg-blue-50';  // Bradycardie
    if (rate > 100) return 'text-red-600 bg-red-50';   // Tachycardie
    return 'text-green-600 bg-green-50';               // Normaal
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Heart size={18} className="text-red-500" />
        <span className="font-bold text-slate-900">Hartfrequentie</span>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={\`text-3xl font-bold \${getStatusColor(data.heart_rate)}\`}>
          {data.heart_rate}
        </span>
        <span className="text-slate-500">/min</span>
      </div>
      
      {data.body_position && (
        <p className="text-sm text-slate-500 mt-2">
          Positie: {data.body_position}
        </p>
      )}
      
      <p className="text-xs text-slate-400 mt-2">
        {formatDateTime(data.measurement_datetime)}
      </p>
    </div>
  );
}`}</CodeBlock>
          </TutorialStep>

          <TutorialStep step={5} title="Registreer de widget in widget_definitions">
            <p>
              Voeg de widget toe aan de database via Supabase SQL Editor of een migratie:
            </p>
            <CodeBlock title="SQL Migratie">{`-- Voeg widget definitie toe
INSERT INTO widget_definitions (
  widget_type,
  zib_id,
  component_name,
  default_config,
  description
) VALUES (
  'heart_rate_card',
  'nl.zorg.Hartfrequentie',
  'ZibHeartRateCard',
  '{
    "showTrend": true,
    "alertThresholds": {
      "low": 60,
      "high": 100
    }
  }'::jsonb,
  'Compacte kaart voor hartfrequentie weergave'
);`}</CodeBlock>
          </TutorialStep>

          <TutorialStep step={6} title="Voeg de ZIB toe aan templates">
            <p>
              Nu kun je de ZIB gebruiken in templates via de Smart Template Builder 
              of direct in de database:
            </p>
            <CodeBlock title="Template configuratie">{`-- Voeg ZIB widget toe aan bestaand template
INSERT INTO ui_widget_instances (
  template_id,
  widget_definition_id,
  section_id,
  position,
  config
) VALUES (
  (SELECT id FROM ui_templates WHERE name = 'Cardiologie Polikliniek'),
  (SELECT id FROM widget_definitions WHERE widget_type = 'heart_rate_card'),
  'vitals',
  3,
  '{"prominent": true}'::jsonb
);`}</CodeBlock>
          </TutorialStep>

          <TutorialStep step={7} title="Test de implementatie">
            <p>Verifieer dat alles correct werkt:</p>
            <div className="space-y-3 mt-3">
              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                <CheckCircle size={18} className="text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">ZIB Config</p>
                  <p className="text-sm text-slate-600">Check dat de ZIB verschijnt in de ZIB Catalogus (Admin → Documentation → ZIB)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                <CheckCircle size={18} className="text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Validatie</p>
                  <p className="text-sm text-slate-600">Test met ongeldige data (te hoge/lage waarden) en controleer foutmeldingen</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                <CheckCircle size={18} className="text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Widget Rendering</p>
                  <p className="text-sm text-slate-600">Open een patiëntdossier met het template en controleer de widget weergave</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                <CheckCircle size={18} className="text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Data Persistentie</p>
                  <p className="text-sm text-slate-600">Sla data op en verifieer in zib_compositions tabel</p>
                </div>
              </div>
            </div>
          </TutorialStep>
        </div>
      </Section>

      {/* Common Issues */}
      <Section title="Veelvoorkomende problemen">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-bold text-red-900 mb-2">❌ "ZIB not found in config"</h4>
            <p className="text-sm text-red-800">
              De ZIB ID in zibConfig.ts komt niet overeen met de id in de database of template. 
              Controleer dat de ID exact overeenkomt met het NICTIZ formaat: <code>nl.zorg.NaamVanZib</code>
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-bold text-red-900 mb-2">❌ "Validation failed for field"</h4>
            <p className="text-sm text-red-800">
              Het Zod schema is strenger dan de invoer. Controleer of alle velden correct zijn 
              gedefinieerd als required of optional, en of de types overeenkomen.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-bold text-red-900 mb-2">❌ "Widget component not rendering"</h4>
            <p className="text-sm text-red-800">
              Controleer of de component_name in widget_definitions exact overeenkomt met de 
              export naam van je React component. Vergeet niet de component te registreren 
              in de widget registry.
            </p>
          </div>
        </div>
      </Section>

      {/* Success celebration */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <h3 className="text-lg font-black text-green-900">🎉 Gefeliciteerd!</h3>
        </div>
        <p className="text-green-800 mb-4">
          Je hebt succesvol een nieuwe ZIB geïmplementeerd! De ZIB is nu beschikbaar voor 
          gebruik in templates en kan klinische data opslaan volgens de NICTIZ standaard.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ ZIB Config
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Codelijsten
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Validatie Schema
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Widget Component
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Database Registratie
          </span>
        </div>
      </div>

      {/* Next Steps */}
      <Section title="Volgende stappen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-bold text-slate-900 mb-2">📊 Trends & Grafieken</h4>
            <p className="text-sm text-slate-600">
              Voeg een trend widget toe om historische data te visualiseren met charts.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-bold text-slate-900 mb-2">🔔 Alerts & Notificaties</h4>
            <p className="text-sm text-slate-600">
              Configureer alert thresholds in de widget config voor automatische waarschuwingen.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-bold text-slate-900 mb-2">🔄 EHRbase Mapping</h4>
            <p className="text-sm text-slate-600">
              Map de ZIB naar een openEHR archetype voor interoperabiliteit met EHRbase.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-bold text-slate-900 mb-2">📝 FHIR Export</h4>
            <p className="text-sm text-slate-600">
              Voeg FHIR resource mapping toe voor HL7 FHIR interoperabiliteit.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

function CatalogSection() {
  return (
    <div className="space-y-6">
      <Section title="ZIB Catalogus">
        <p className="text-slate-700 mb-4">
          Complete lijst van geïmplementeerde Zorginformatiebouwstenen, gegroepeerd per categorie.
        </p>
      </Section>

      <Section title="Groep 1: Vitale Parameters">
        <div className="space-y-2">
          <ZibRow code="nl.zorg.Bloeddruk" name="Bloeddruk" fields="systolic, diastolic, position, cuff_size" />
          <ZibRow code="nl.zorg.Polsfrequentie" name="Pols" fields="pulse_rate, regularity" />
          <ZibRow code="nl.zorg.Hartfrequentie" name="Hartfrequentie" fields="heart_rate, measurement_method" />
          <ZibRow code="nl.zorg.O2Saturatie" name="Saturatie" fields="spo2, measurement_method, probe_location" />
          <ZibRow code="nl.zorg.Ademhaling" name="Ademhaling" fields="respiratory_rate, rhythm, extra_oxygen" />
          <ZibRow code="nl.zorg.Lichaamstemperatuur" name="Temperatuur" fields="temperature_value, location" />
          <ZibRow code="nl.zorg.Lichaamsgewicht" name="Gewicht" fields="weight_value, clothing_status" />
          <ZibRow code="nl.zorg.Lichaamslengte" name="Lengte" fields="length_value, position" />
          <ZibRow code="nl.zorg.Schedelomvang" name="Schedelomvang" fields="head_circumference" />
          <ZibRow code="nl.zorg.Visus" name="Visus" fields="visual_acuity, eye, correction" />
        </div>
      </Section>

      <Section title="Groep 2: Laboratorium">
        <div className="space-y-2">
          <ZibRow code="nl.zorg.LaboratoriumUitslag" name="Lab Uitslag" fields="test_code, result_value, result_unit, abnormality_flag" />
          <ZibRow code="nl.zorg.TekstUitslag" name="Tekst Uitslag" fields="test_name, result_text, effective_date" />
          <ZibRow code="nl.zorg.Vochtbalans" name="Vochtbalans" fields="total_input, total_output, balance" />
        </div>
      </Section>

      <Section title="Groep 3: Klinische Context">
        <div className="space-y-2">
          <ZibRow code="nl.zorg.AandoeningOfGesteldheid" name="Aandoening" fields="problem_name, problem_type, onset_date, status" />
          <ZibRow code="nl.zorg.AllergieIntolerantie" name="Allergie" fields="causative_agent, category, criticality, reaction_type" />
          <ZibRow code="nl.zorg.MedicatieGebruik" name="Medicatie" fields="product_name, dosage, route, frequency" />
          <ZibRow code="nl.zorg.Verrichting" name="Verrichting" fields="procedure_name, procedure_code, body_site, date" />
          <ZibRow code="nl.zorg.Vaccinatie" name="Vaccinatie" fields="vaccine_name, dose_number, administration_date" />
        </div>
      </Section>

      <Section title="Groep 4: Verslaglegging">
        <div className="space-y-2">
          <ZibRow code="nl.zorg.Anamnese" name="Anamnese" fields="chief_complaint, history_present_illness, family_history" />
          <ZibRow code="nl.zorg.LichamelijkOnderzoek" name="Lich. Onderzoek" fields="general_impression, findings_per_system" />
          <ZibRow code="nl.zorg.Evaluatie" name="Evaluatie" fields="clinical_impression, differential_diagnosis, assessment" />
          <ZibRow code="nl.zorg.Beleid" name="Beleid" fields="treatment_plan, follow_up, patient_instructions" />
          <ZibRow code="nl.zorg.PoliklinischConsult" name="Poli Consult" fields="reason_visit, subjective, objective, plan" />
        </div>
      </Section>

      <Section title="Groep 5: Scores & Schalen">
        <div className="space-y-2">
          <ZibRow code="nl.zorg.Pijnscore" name="Pijnscore" fields="pain_score, pain_location, pain_type" />
          <ZibRow code="nl.zorg.GlasgowComaScale" name="GCS" fields="eye_response, verbal_response, motor_response, total" />
          <ZibRow code="nl.zorg.DAS" name="DAS28" fields="das28_score, tender_joints, swollen_joints" />
          <ZibRow code="nl.zorg.MMSE" name="MMSE" fields="total_score, orientation, recall, attention" />
        </div>
      </Section>
    </div>
  );
}

function ZibRow({ code, name, fields }: { code: string; name: string; fields: string }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
      <code className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono w-48 flex-shrink-0">
        {code.split('.').pop()}
      </code>
      <strong className="text-sm text-slate-900 w-32 flex-shrink-0">{name}</strong>
      <span className="text-xs text-slate-500 truncate">{fields}</span>
    </div>
  );
}

function ConfigSection() {
  return (
    <div className="space-y-6">
      <Section title="ZIB Configuratie">
        <p className="text-slate-700 mb-4">
          Alle ZIB definities staan in <code className="bg-slate-100 px-1 rounded">packages/clinical-core/src/constants/zibConfig.ts</code>.
          Dit bestand definieert de velden, types en validatie per ZIB.
        </p>
      </Section>

      <Section title="ZIB Field Types">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="text-sm font-bold text-slate-900">text</code>
            <p className="text-xs text-slate-600 mt-1">Vrije tekst invoer</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="text-sm font-bold text-slate-900">number</code>
            <p className="text-xs text-slate-600 mt-1">Numerieke waarde met unit</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="text-sm font-bold text-slate-900">select</code>
            <p className="text-xs text-slate-600 mt-1">Dropdown met voorgedefinieerde opties</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="text-sm font-bold text-slate-900">boolean</code>
            <p className="text-xs text-slate-600 mt-1">Ja/Nee toggle</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="text-sm font-bold text-slate-900">date</code>
            <p className="text-xs text-slate-600 mt-1">Datum picker</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="text-sm font-bold text-slate-900">datetime</code>
            <p className="text-xs text-slate-600 mt-1">Datum + tijd picker</p>
          </div>
        </div>
      </Section>

      <Section title="ZibField Interface">
        <CodeBlock title="TypeScript Interface">{`// packages/clinical-core/src/constants/zibConfig.ts

export interface ZibOption {
  value: string;   // Interne waarde (SNOMED code of enum)
  label: string;   // Weergave tekst
}

export interface ZibField {
  name: string;              // Unieke veldnaam
  type: 'text' | 'number' | 'select' | 'boolean' | 'date' | 'datetime';
  label: string;             // Nederlandse labeltekst
  unit?: string;             // Eenheid (mmHg, kg, °C)
  placeholder?: string;      // Placeholder tekst
  options?: ZibOption[];     // Opties voor select type
}`}</CodeBlock>
      </Section>

      <Section title="Voorbeeld: Bloeddruk ZIB">
        <CodeBlock title="ZIB_CONFIG['nl.zorg.Bloeddruk']">{`'nl.zorg.Bloeddruk': [
  { 
    name: 'systolic', 
    label: 'Systolisch', 
    type: 'number', 
    unit: 'mmHg' 
  },
  { 
    name: 'diastolic', 
    label: 'Diastolisch', 
    type: 'number', 
    unit: 'mmHg' 
  },
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
  { 
    name: 'cuff_size', 
    label: 'Manchet', 
    type: 'select', 
    options: [
      { value: 'Standard', label: 'Standaard' }, 
      { value: 'Large', label: 'Groot' }
    ] 
  }
]`}</CodeBlock>
      </Section>

      <Section title="Nieuwe ZIB Toevoegen">
        <ol className="text-sm text-slate-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
            <div>
              <strong>Voeg entry toe aan ZIB_CONFIG:</strong>
              <code className="block mt-1 text-xs bg-slate-100 p-2 rounded">'nl.zorg.NieuweZib': [...]</code>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
            <span>Definieer alle velden met correcte types</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
            <span>(Optioneel) Voeg validatieschema toe</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">4</span>
            <span>Widget wordt automatisch beschikbaar in template builder</span>
          </li>
        </ol>
      </Section>
    </div>
  );
}

function DatabaseSection() {
  return (
    <div className="space-y-6">
      <Section title="Database Schema">
        <p className="text-slate-700 mb-4">
          Alle ZIB data wordt opgeslagen in de <code className="bg-slate-100 px-1 rounded">zib_compositions</code> 
          tabel met JSON content voor flexibiliteit.
        </p>
      </Section>

      <Section title="zib_compositions Table">
        <CodeBlock title="Schema">{`CREATE TABLE zib_compositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificatie
  patient_id UUID REFERENCES profiles(id) NOT NULL,
  caregiver_id UUID REFERENCES profiles(id),
  
  -- ZIB Metadata
  zib_id TEXT NOT NULL,              -- 'nl.zorg.Bloeddruk'
  zib_version TEXT DEFAULT '3.1',    -- NICTIZ versie
  
  -- Content (flexible JSON)
  content JSONB NOT NULL,            -- { systolic: 142, diastolic: 91, ... }
  
  -- Timestamps
  effective_at TIMESTAMPTZ,          -- Klinisch relevante tijd
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status & Provenance
  clinical_status TEXT DEFAULT 'active',
  verification_status TEXT DEFAULT 'confirmed',
  source_system TEXT,                -- 'provider-dashboard', 'patient-portal'
  external_id TEXT,                  -- ID van extern systeem
  
  -- Data Sovereignty
  storage_status TEXT DEFAULT 'cloud',  -- 'sync_pending', 'local_vault_only'
  local_vault_id UUID,
  
  -- Security
  confidentiality_code TEXT DEFAULT 'N'  -- N=Normal, R=Restricted
);

-- Indexes
CREATE INDEX idx_zib_patient ON zib_compositions(patient_id);
CREATE INDEX idx_zib_type ON zib_compositions(zib_id);
CREATE INDEX idx_zib_effective ON zib_compositions(effective_at DESC);`}</CodeBlock>
      </Section>

      <Section title="Voorbeeld Data">
        <CodeBlock title="Bloeddruk Record">{`{
  "id": "707c2da9-477f-42ea-b6cc-10c4e42dd028",
  "patient_id": "70000000-0000-0000-0000-000000000002",
  "caregiver_id": "b8c8e2be-cfd0-4714-adaf-3f670b5164ed",
  "zib_id": "nl.zorg.Bloeddruk",
  "zib_version": "3.1",
  "content": {
    "systolic": 142,
    "diastolic": 91,
    "position": "Sitting",
    "cuff_size": "Standard"
  },
  "effective_at": "2025-12-19T15:54:59.722Z",
  "recorded_at": "2025-12-19T15:54:59.722Z",
  "clinical_status": "active",
  "verification_status": "confirmed",
  "source_system": "provider-dashboard",
  "storage_status": "local_vault_only",
  "confidentiality_code": "N"
}`}</CodeBlock>
      </Section>

      <Section title="Query Voorbeelden">
        <CodeBlock title="Laatste bloeddruk van patiënt">{`SELECT 
  content->>'systolic' as systolic,
  content->>'diastolic' as diastolic,
  effective_at
FROM zib_compositions
WHERE patient_id = :patient_id
  AND zib_id = 'nl.zorg.Bloeddruk'
ORDER BY effective_at DESC
LIMIT 1;`}</CodeBlock>

        <CodeBlock title="Alle vitals van vandaag">{`SELECT 
  zib_id,
  content,
  effective_at,
  source_system
FROM zib_compositions
WHERE patient_id = :patient_id
  AND zib_id IN (
    'nl.zorg.Bloeddruk',
    'nl.zorg.Polsfrequentie',
    'nl.zorg.O2Saturatie',
    'nl.zorg.Lichaamstemperatuur'
  )
  AND effective_at >= CURRENT_DATE
ORDER BY effective_at DESC;`}</CodeBlock>
      </Section>
    </div>
  );
}

function ValidationSection() {
  return (
    <div className="space-y-6">
      <Section title="ZIB Validatie">
        <p className="text-slate-700 mb-4">
          Validatie zorgt dat ingevoerde data voldoet aan de ZIB specificaties 
          voordat het wordt opgeslagen.
        </p>
      </Section>

      <Section title="Validatie Niveaus">
        <div className="space-y-3">
          <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded-r">
            <strong className="text-green-900">Type Validatie</strong>
            <p className="text-sm text-green-700 mt-1">
              Check of waarde correct type heeft (number, string, etc.)
            </p>
          </div>
          <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r">
            <strong className="text-blue-900">Range Validatie</strong>
            <p className="text-sm text-blue-700 mt-1">
              Check of numerieke waarden binnen realistische grenzen vallen
            </p>
          </div>
          <div className="border-l-4 border-purple-500 bg-purple-50 p-3 rounded-r">
            <strong className="text-purple-900">Codelist Validatie</strong>
            <p className="text-sm text-purple-700 mt-1">
              Check of select waarden in toegestane opties voorkomen
            </p>
          </div>
          <div className="border-l-4 border-orange-500 bg-orange-50 p-3 rounded-r">
            <strong className="text-orange-900">Verplichte Velden</strong>
            <p className="text-sm text-orange-700 mt-1">
              Check of alle verplichte velden zijn ingevuld
            </p>
          </div>
        </div>
      </Section>

      <Section title="Validatie Voorbeeld">
        <CodeBlock title="Bloeddruk Validatie">{`// packages/clinical-core/src/validation/bloodPressure.ts

const bloodPressureSchema = {
  systolic: {
    type: 'number',
    required: true,
    min: 50,
    max: 300,
    message: 'Systolische druk moet tussen 50-300 mmHg liggen'
  },
  diastolic: {
    type: 'number',
    required: true,
    min: 30,
    max: 200,
    message: 'Diastolische druk moet tussen 30-200 mmHg liggen'
  },
  position: {
    type: 'select',
    required: false,
    allowedValues: ['Sitting', 'Lying', 'Standing']
  },
  cuff_size: {
    type: 'select',
    required: false,
    allowedValues: ['Standard', 'Large']
  }
};

function validateBloodPressure(data: any): ValidationResult {
  const errors: string[] = [];
  
  if (data.systolic < 50 || data.systolic > 300) {
    errors.push('Systolische druk onrealistisch');
  }
  
  if (data.diastolic >= data.systolic) {
    errors.push('Diastolisch moet lager zijn dan systolisch');
  }
  
  return { valid: errors.length === 0, errors };
}`}</CodeBlock>
      </Section>

      <Section title="Referentiewaarden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 font-bold text-slate-900">ZIB</th>
                <th className="text-left py-2 font-bold text-slate-900">Veld</th>
                <th className="text-left py-2 font-bold text-slate-900">Min</th>
                <th className="text-left py-2 font-bold text-slate-900">Max</th>
                <th className="text-left py-2 font-bold text-slate-900">Unit</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-100">
                <td className="py-2">Bloeddruk</td>
                <td>systolic</td>
                <td>50</td>
                <td>300</td>
                <td>mmHg</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2">Bloeddruk</td>
                <td>diastolic</td>
                <td>30</td>
                <td>200</td>
                <td>mmHg</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2">Pols</td>
                <td>pulse_rate</td>
                <td>30</td>
                <td>250</td>
                <td>/min</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2">Saturatie</td>
                <td>spo2</td>
                <td>50</td>
                <td>100</td>
                <td>%</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2">Temperatuur</td>
                <td>temperature</td>
                <td>32</td>
                <td>44</td>
                <td>°C</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function APISection() {
  return (
    <div className="space-y-6">
      <Section title="API Gebruik">
        <p className="text-slate-700 mb-4">
          ZIB data wordt via Supabase client opgehaald en opgeslagen. 
          Hieronder voorbeelden voor veelvoorkomende operaties.
        </p>
      </Section>

      <Section title="ZIB Data Ophalen">
        <CodeBlock title="React Hook">{`// hooks/useClinicalData.ts

export function useClinicalData(patientId: string) {
  const [data, setData] = useState<ZibComposition[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('zib_compositions')
        .select('*')
        .eq('patient_id', patientId)
        .order('effective_at', { ascending: false });
        
      if (data) setData(data);
    };
    
    fetchData();
    
    // Realtime subscription
    const subscription = supabase
      .channel('zib-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'zib_compositions',
        filter: \`patient_id=eq.\${patientId}\`
      }, (payload) => {
        setData(prev => [payload.new, ...prev]);
      })
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, [patientId]);
  
  return data;
}`}</CodeBlock>
      </Section>

      <Section title="ZIB Data Opslaan">
        <CodeBlock title="Insert Function">{`async function saveZibComposition(
  patientId: string,
  zibId: string,
  content: Record<string, any>,
  effectiveAt?: Date
) {
  const { data, error } = await supabase
    .from('zib_compositions')
    .insert({
      patient_id: patientId,
      caregiver_id: currentUserId,
      zib_id: zibId,
      content,
      effective_at: effectiveAt || new Date(),
      source_system: 'provider-dashboard'
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Gebruik:
await saveZibComposition(
  'patient-uuid',
  'nl.zorg.Bloeddruk',
  { systolic: 142, diastolic: 91, position: 'Sitting' }
);`}</CodeBlock>
      </Section>

      <Section title="ZIB Config Ophalen">
        <CodeBlock title="Get ZIB Fields">{`import { ZIB_CONFIG } from '@openepd/clinical-core';

// Get veld configuratie voor specifieke ZIB
const bloodPressureFields = ZIB_CONFIG['nl.zorg.Bloeddruk'];

// Dynamisch formulier genereren
function DynamicZibForm({ zibId }: { zibId: string }) {
  const fields = ZIB_CONFIG[zibId];
  
  if (!fields) return <div>Onbekende ZIB: {zibId}</div>;
  
  return (
    <form>
      {fields.map(field => (
        <FormField key={field.name} field={field} />
      ))}
    </form>
  );
}`}</CodeBlock>
      </Section>
    </div>
  );
}

function BestPracticesSection() {
  return (
    <div className="space-y-6">
      <Section title="Best Practices">
        <p className="text-slate-700 mb-4">
          Richtlijnen voor het correct gebruik van ZIBs in OpenEPD.
        </p>
      </Section>

      <Section title="✅ Do's">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>Gebruik officiële ZIB IDs:</strong> Altijd nl.zorg.* notatie
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>Sla effective_at op:</strong> Klinisch relevante tijd, niet alleen recorded_at
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>Gebruik SNOMED codes:</strong> Voor select opties waar mogelijk
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>Valideer voor opslag:</strong> Check ranges en verplichte velden
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>Log source_system:</strong> Traceerbaarheid van data herkomst
            </span>
          </li>
        </ul>
      </Section>

      <Section title="❌ Don'ts">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>Geen eigen ZIB IDs verzinnen:</strong> Gebruik bestaande standaarden
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>Geen ongevalideerde data opslaan:</strong> Voorkom garbage in, garbage out
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>Geen hard-delete:</strong> Gebruik soft-delete of status wijziging
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-700">
              <strong>Geen extra velden in content:</strong> Houd je aan ZIB specificatie
            </span>
          </li>
        </ul>
      </Section>

      <Section title="NICTIZ Referenties">
        <div className="bg-slate-50 rounded-xl p-4">
          <h4 className="font-bold text-slate-900 mb-2">Externe Documentatie</h4>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>
              • <a href="https://zibs.nl" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                zibs.nl - Officiële ZIB bibliotheek
              </a>
            </li>
            <li>
              • <a href="https://nictiz.nl/publicaties/informatiestandaarden" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                NICTIZ Informatiestandaarden
              </a>
            </li>
            <li>
              • <a href="https://decor.nictiz.nl" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                ART-DECOR - ZIB definities
              </a>
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}

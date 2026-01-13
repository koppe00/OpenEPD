'use client';

import React, { useState, useRef } from 'react';
// Import html2pdf.js for PDF export
import html2pdf from 'html2pdf.js';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { 
  BookOpen, 
  Settings, 
  Layers, 
  LayoutTemplate,
  CheckCircle,
  AlertCircle,
  Code,
  Database,
  GraduationCap,
  Grid,
  PlusCircle,
  MousePointer,
  Save,
  Eye,
  Palette,
  Component,
  ArrowRight
} from 'lucide-react';

export default function TemplatesDocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'OpenEPD_Smart_Templates.pdf',
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
        <h2 className="text-lg font-black text-slate-900 mb-4">Smart Templates</h2>
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
            icon={Layers} 
            label="Architectuur" 
            active={activeSection === 'architecture'}
            onClick={() => setActiveSection('architecture')}
          />
          <NavItem 
            icon={LayoutTemplate} 
            label="Templates" 
            active={activeSection === 'templates'}
            onClick={() => setActiveSection('templates')}
          />
          <NavItem 
            icon={Component} 
            label="Widget Architect" 
            active={activeSection === 'widgets'}
            onClick={() => setActiveSection('widgets')}
          />
          <NavItem 
            icon={Database} 
            label="Database Schema" 
            active={activeSection === 'database'}
            onClick={() => setActiveSection('database')}
          />
          <NavItem 
            icon={Code} 
            label="API & Functies" 
            active={activeSection === 'api'}
            onClick={() => setActiveSection('api')}
          />
          <NavItem 
            icon={AlertCircle} 
            label="Troubleshooting" 
            active={activeSection === 'troubleshooting'}
            onClick={() => setActiveSection('troubleshooting')}
          />
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between max-w-4xl mb-4">
          <AdminHeader 
            title="Smart Template Builder Documentatie" 
            subtitle="Visuele template configuratie voor dashboards en klinische layouts"
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
          {activeSection === 'architecture' && <ArchitectureSection />}
          {activeSection === 'templates' && <TemplatesSection />}
          {activeSection === 'widgets' && <WidgetsSection />}
          {activeSection === 'database' && <DatabaseSection />}
          {activeSection === 'api' && <APISection />}
          {activeSection === 'troubleshooting' && <TroubleshootingSection />}
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

function TutorialStep({ number, title, description, children }: any) {
  return (
    <div className="border-2 border-slate-200 rounded-2xl p-6 relative">
      <div className="absolute -top-4 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-black">
        Stap {number}
      </div>
      <h4 className="text-lg font-black text-slate-900 mb-2 mt-2">{title}</h4>
      <p className="text-slate-600 mb-4">{description}</p>
      {children}
    </div>
  );
}

function OverviewSection({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  return (
    <div className="space-y-6">
      <Section title="Wat is de Smart Template Builder?">
        <p className="text-slate-700 mb-4">
          De <strong>Smart Template Builder</strong> is een visueel drag-and-drop systeem waarmee je 
          dashboards en klinische layouts configureert voor het Provider Dashboard. Je kunt widgets 
          plaatsen, ordenen en koppelen aan specifieke werkcontexten en specialismen.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-blue-900 mb-2">🎨 Visueel Ontwerpen</h4>
          <p className="text-sm text-blue-800">
            Geen code nodig! Sleep widgets naar de gewenste positie, configureer de inhoud, 
            en sla je layout op. De wijzigingen zijn direct zichtbaar in het Provider Dashboard.
          </p>
        </div>
      </Section>

      <Section title="Kernfunctionaliteit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard 
            icon={LayoutTemplate}
            title="Dashboard Templates"
            description="Maak layouts voor verschillende werkcontexten: Polikliniek, SEH, Kliniek"
          />
          <FeatureCard 
            icon={Component}
            title="Widget Bibliotheek"
            description="50+ voorgedefinieerde widgets voor ZIB data, grafieken en formulieren"
          />
          <FeatureCard 
            icon={Grid}
            title="3-Kolom Layout"
            description="Flexibele layout met Left Sidebar, Main Content en Right Sidebar"
          />
          <FeatureCard 
            icon={Palette}
            title="Theme Support"
            description="Kleuren per werkcontext: blauw voor Poli, rood voor SEH, groen voor Kliniek"
          />
        </div>
      </Section>

      <Section title="Hoe werkt het?">
        <CodeBlock title="Template Flow">{`
┌─────────────────────────────────────────────────────────────────────┐
│                     SMART TEMPLATE BUILDER                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   1. MAAK TEMPLATE                                                  │
│      ↓                                                              │
│   ┌─────────────────┐                                               │
│   │  ui_templates   │ ← Naam, Work Context, Specialisme, Theme     │
│   └────────┬────────┘                                               │
│            │                                                         │
│   2. VOEG WIDGETS TOE                                               │
│      ↓                                                              │
│   ┌─────────────────┐     ┌─────────────────────┐                   │
│   │ widget_instances│ ──▶ │ widget_definitions  │                   │
│   │ (plaatsing)     │     │ (blueprint)         │                   │
│   └────────┬────────┘     └──────────┬──────────┘                   │
│            │                         │                              │
│   3. CONFIGUREER SECTIES             │                              │
│      ↓                               │                              │
│   ┌─────────────────┐                │                              │
│   │ widget_sections │ ◀──────────────┘                              │
│   │ (velden/ZIBs)   │                                               │
│   └────────┬────────┘                                               │
│            │                                                         │
│   4. TOON IN DASHBOARD                                              │
│      ↓                                                              │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │              Provider Dashboard (runtime)                    │   │
│   │   ┌─────────┐  ┌───────────────────────┐  ┌─────────┐       │   │
│   │   │ Sidebar │  │     Main Content      │  │ Sidebar │       │   │
│   │   │ Widgets │  │       Widgets         │  │ Widgets │       │   │
│   │   └─────────┘  └───────────────────────┘  └─────────┘       │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
`}</CodeBlock>
      </Section>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-purple-900 mb-2">
              🚀 Nieuw? Start met de Tutorial!
            </h3>
            <p className="text-purple-800 mb-3">
              Leer in 5 eenvoudige stappen hoe je een dashboard template maakt voor Cardiologie. 
              Van template aanmaken tot widgets plaatsen - alles via de visuele interface!
            </p>
            <button
              onClick={() => setActiveSection('tutorial')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              📚 Bekijk de Tutorial →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TutorialSection() {
  return (
    <div className="space-y-6">
      <Section title="🎓 Tutorial: Template voor Cardiologie Polikliniek">
        <p className="text-slate-700 mb-4">
          In deze tutorial maak je een compleet dashboard template voor de Cardiologie polikliniek. 
          Je leert hoe je templates aanmaakt, widgets toevoegt en de layout configureert.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>⏱️ Geschatte tijd:</strong> 10-15 minuten<br />
            <strong>📋 Resultaat:</strong> Een werkend dashboard met vitals, anamnese en medicatieoverzicht
          </p>
        </div>
      </Section>

      <div className="space-y-8">
        <TutorialStep 
          number={1} 
          title="Open de Template Beheer Pagina"
          description="Navigeer naar het templatesysteem in de Admin Dashboard."
        >
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-slate-700">Ga naar <strong>Beheer & Inrichting</strong> in de sidebar</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-slate-700">Klik op <strong>UI Templates</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">3</div>
              <span className="text-slate-700">Je ziet nu de lijst met bestaande templates</span>
            </div>
          </div>
          
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <CheckCircle size={14} className="inline mr-1" />
              <strong>Tip:</strong> Je kunt direct naar <code className="bg-green-100 px-1 rounded">/ui-config/templates</code> navigeren.
            </p>
          </div>
        </TutorialStep>

        <TutorialStep 
          number={2} 
          title="Maak een Nieuw Template"
          description="Creëer een template specifiek voor Cardiologie consulten."
        >
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-slate-700">Klik op de knop <strong>+ Nieuw Template</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-slate-700">Vul de volgende gegevens in:</span>
            </div>
          </div>
          
          <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-semibold text-slate-700">Template Naam</td>
                  <td className="py-2"><code className="bg-blue-50 px-2 py-1 rounded">Cardiologie Polikliniek</code></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold text-slate-700">Work Context</td>
                  <td className="py-2"><code className="bg-blue-50 px-2 py-1 rounded">Polikliniek</code> (uit dropdown)</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-slate-700">Specialisme</td>
                  <td className="py-2"><code className="bg-purple-50 px-2 py-1 rounded">Cardiologie (CARD)</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-slate-700">Klik <strong>Opslaan</strong></span>
          </div>
        </TutorialStep>

        <TutorialStep 
          number={3} 
          title="Open de Template Builder"
          description="Ga naar de visuele drag-and-drop editor."
        >
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-slate-700">Zoek je nieuwe template <strong>Cardiologie Polikliniek</strong> in de lijst</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-slate-700">Klik op <strong>Builder Openen</strong></span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-2">Je ziet nu de Template Designer met 3 kolommen:</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white border border-slate-200 rounded p-2">
                <strong>Left Sidebar</strong>
                <p className="text-slate-500 mt-1">Navigatie, snelinfo</p>
              </div>
              <div className="bg-white border-2 border-blue-300 rounded p-2">
                <strong>Main Content</strong>
                <p className="text-slate-500 mt-1">Hoofd widgets</p>
              </div>
              <div className="bg-white border border-slate-200 rounded p-2">
                <strong>Right Sidebar</strong>
                <p className="text-slate-500 mt-1">Details, acties</p>
              </div>
            </div>
          </div>
        </TutorialStep>

        <TutorialStep 
          number={4} 
          title="Voeg Widgets Toe"
          description="Plaats ZIB widgets in je layout."
        >
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-slate-700">Klik op <strong>+ TOEVOEGEN</strong> bij de gewenste kolom</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-slate-700">De <strong>Widget Bibliotheek</strong> opent</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">3</div>
              <span className="text-slate-700">Selecteer een widget om toe te voegen</span>
            </div>
          </div>
          
          <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-sm font-bold text-slate-900 mb-3">Aanbevolen widgets voor Cardiologie:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <span className="text-red-600">❤️</span>
                <span><strong>Vitals Widget</strong> - Bloeddruk, Pols</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <span className="text-blue-600">📝</span>
                <span><strong>Anamnese Widget</strong> - Klachten</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <span className="text-green-600">💊</span>
                <span><strong>Medicatie Widget</strong> - Overzicht</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                <span className="text-purple-600">📊</span>
                <span><strong>ECG Widget</strong> - Laatste ECG</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <AlertCircle size={14} className="inline mr-1" />
              <strong>Tip:</strong> Je kunt widgets verslepen om de volgorde te wijzigen!
            </p>
          </div>
        </TutorialStep>

        <TutorialStep 
          number={5} 
          title="Sla de Layout Op"
          description="Bewaar je template en test het resultaat."
        >
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-slate-700">Klik rechtsboven op <strong>Layout Opslaan</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-slate-700">Je ziet de bevestiging <strong>"Layout opgeslagen!"</strong></span>
            </div>
          </div>
          
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
            <h5 className="font-bold text-green-900 mb-2">✅ Resultaat Testen</h5>
            <ol className="text-sm text-green-800 space-y-1">
              <li>1. Ga naar het <strong>Provider Dashboard</strong> (localhost:3000)</li>
              <li>2. Log in als een Cardioloog gebruiker</li>
              <li>3. Selecteer <strong>Polikliniek</strong> als werkcontext</li>
              <li>4. Je template wordt automatisch geladen!</li>
            </ol>
          </div>
        </TutorialStep>
      </div>

      <Section title="🎉 Gefeliciteerd!">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h4 className="text-xl font-black text-green-900 mb-2">
            Je hebt je eerste template gemaakt!
          </h4>
          <p className="text-green-800">
            Je kunt nu meer templates maken voor andere specialismen en werkcontexten. 
            Experimenteer met verschillende widget combinaties!
          </p>
        </div>
      </Section>
    </div>
  );
}

function ArchitectureSection() {
  return (
    <div className="space-y-6">
      <Section title="Template Systeem Architectuur">
        <p className="text-slate-700 mb-4">
          Het Smart Template systeem bestaat uit meerdere componenten die samenwerken 
          om dynamische dashboards te creëren.
        </p>
      </Section>

      <Section title="Component Overzicht">
        <CodeBlock title="Systeem Architectuur">{`
┌─────────────────────────────────────────────────────────────────────┐
│                     TEMPLATE SYSTEM                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ADMIN DASHBOARD                    PROVIDER DASHBOARD              │
│  ════════════════                   ══════════════════              │
│                                                                      │
│  ┌─────────────────┐                ┌─────────────────┐             │
│  │ Templates Page  │                │ PatientDashboard│             │
│  │ /ui-config/     │                │ (runtime render)│             │
│  │ templates       │                └────────┬────────┘             │
│  └────────┬────────┘                         │                      │
│           │                                   │                      │
│  ┌────────┴────────┐                ┌────────┴────────┐             │
│  │ Template Builder│                │useDashboardLayout│            │
│  │ /templates/[id] │                │ (data fetching) │             │
│  │ (drag & drop)   │                └────────┬────────┘             │
│  └────────┬────────┘                         │                      │
│           │                                   │                      │
│           └────────────────┬─────────────────┘                      │
│                            │                                         │
│                   ┌────────┴────────┐                               │
│                   │   SUPABASE DB   │                               │
│                   │  - ui_templates │                               │
│                   │  - widget_*     │                               │
│                   └─────────────────┘                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
`}</CodeBlock>
      </Section>

      <Section title="Layout Regios">
        <p className="text-slate-700 mb-4">
          Elk template heeft 3 vaste regions waar widgets geplaatst kunnen worden:
        </p>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="border-2 border-slate-300 rounded-xl p-4">
            <h5 className="font-bold text-slate-900 mb-2">left_sidebar</h5>
            <p className="text-xs text-slate-600">Navigatie, patiëntinfo, snelkoppelingen</p>
            <code className="text-xs bg-slate-100 px-2 py-0.5 rounded mt-2 block">col-span-3</code>
          </div>
          <div className="border-2 border-blue-500 rounded-xl p-4">
            <h5 className="font-bold text-blue-900 mb-2">main_content</h5>
            <p className="text-xs text-slate-600">Hoofd widgets, formulieren, data invoer</p>
            <code className="text-xs bg-blue-100 px-2 py-0.5 rounded mt-2 block">col-span-6</code>
          </div>
          <div className="border-2 border-slate-300 rounded-xl p-4">
            <h5 className="font-bold text-slate-900 mb-2">right_sidebar</h5>
            <p className="text-xs text-slate-600">Details, acties, secundaire info</p>
            <code className="text-xs bg-slate-100 px-2 py-0.5 rounded mt-2 block">col-span-3</code>
          </div>
        </div>
      </Section>

      <Section title="Widget Types">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <code className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono">zib_viewer</code>
            <span className="text-sm text-slate-700">Toont ZIB data in read-only modus</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <code className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-mono">zib_editor</code>
            <span className="text-sm text-slate-700">Interactieve ZIB data invoer</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <code className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-mono">chart</code>
            <span className="text-sm text-slate-700">Grafieken voor trends (bloeddruk, gewicht)</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <code className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-mono">static</code>
            <span className="text-sm text-slate-700">Statische content (help teksten, links)</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

function TemplatesSection() {
  return (
    <div className="space-y-6">
      <Section title="Templates Beheren">
        <p className="text-slate-700 mb-4">
          Templates worden beheerd via <code className="bg-slate-100 px-1 rounded">/ui-config/templates</code>.
        </p>
      </Section>

      <Section title="Template Eigenschappen">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-bold text-slate-900">Veld</th>
                <th className="text-left py-2 px-3 font-bold text-slate-900">Type</th>
                <th className="text-left py-2 px-3 font-bold text-slate-900">Beschrijving</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-3"><code>name</code></td>
                <td className="py-2 px-3 text-slate-500">string</td>
                <td className="py-2 px-3">Template naam</td>
              </tr>
              <tr>
                <td className="py-2 px-3"><code>work_context_id</code></td>
                <td className="py-2 px-3 text-slate-500">uuid</td>
                <td className="py-2 px-3">Verplichte koppeling aan werkcontext</td>
              </tr>
              <tr>
                <td className="py-2 px-3"><code>specialty_id</code></td>
                <td className="py-2 px-3 text-slate-500">uuid | null</td>
                <td className="py-2 px-3">Optionele koppeling aan specialisme</td>
              </tr>
              <tr>
                <td className="py-2 px-3"><code>theme_config</code></td>
                <td className="py-2 px-3 text-slate-500">jsonb</td>
                <td className="py-2 px-3">Kleuren: primary, secondary, accent</td>
              </tr>
              <tr>
                <td className="py-2 px-3"><code>is_active</code></td>
                <td className="py-2 px-3 text-slate-500">boolean</td>
                <td className="py-2 px-3">Template actief/inactief</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Template Matching">
        <p className="text-slate-700 mb-4">
          Het Provider Dashboard selecteert automatisch het juiste template op basis van:
        </p>
        
        <CodeBlock title="Selectie Prioriteit">{`// Provider Dashboard: useDashboardLayout.ts

// 1. EERST: Template specifiek voor work_context + specialty
SELECT * FROM ui_templates
WHERE work_context_id = :userWorkContext
  AND specialty_id = :userSpecialty
  AND is_active = true;

// 2. FALLBACK: Template alleen voor work_context
SELECT * FROM ui_templates
WHERE work_context_id = :userWorkContext
  AND specialty_id IS NULL
  AND is_active = true;

// 3. DEFAULT: Standaard template
SELECT * FROM ui_templates
WHERE name = 'Default Dashboard';`}</CodeBlock>
      </Section>
    </div>
  );
}

function WidgetsSection() {
  return (
    <div className="space-y-6">
      <Section title="Widget Architect">
        <p className="text-slate-700 mb-4">
          De <strong>Widget Architect</strong> is de configuratie tool voor widget blueprints. 
          Hier definieer je welke velden en ZIB mappings een widget heeft.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            <AlertCircle size={14} className="inline mr-1" />
            <strong>Let op:</strong> Widget Architect is voor <em>technische beheerders</em>. 
            De meeste gebruikers hoeven hier niet te komen.
          </p>
        </div>
      </Section>

      <Section title="Widget Definitie">
        <CodeBlock title="widget_definitions tabel">{`{
  "id": "uuid",
  "name": "Vitale Parameters",
  "description": "Widget voor bloeddruk, pols en saturatie",
  "engine_type": "zib_viewer",
  "component_key": "vitals_card",
  "default_icon": "Heart"
}`}</CodeBlock>
      </Section>

      <Section title="Widget Secties">
        <p className="text-slate-700 mb-4">
          Elke widget heeft secties die gekoppeld zijn aan ZIBs:
        </p>
        
        <CodeBlock title="widget_sections tabel">{`-- Sectie 1: Bloeddruk
{
  "id": "uuid",
  "widget_definition_id": "vitals-widget-uuid",
  "label": "Bloeddruk",
  "zib_mapping": "nl.zorg.Bloeddruk",
  "ui_control_type": "numeric_pair",
  "selected_fields": ["systolic", "diastolic", "position"],
  "sort_order": 0
}

-- Sectie 2: Pols
{
  "id": "uuid",
  "widget_definition_id": "vitals-widget-uuid",
  "label": "Pols",
  "zib_mapping": "nl.zorg.Polsfrequentie",
  "ui_control_type": "numeric",
  "selected_fields": ["pulse_rate", "regularity"],
  "sort_order": 1
}`}</CodeBlock>
      </Section>

      <Section title="ZIB Mapping Flow">
        <CodeBlock title="Data Flow">{`
Widget Instance          Widget Sections         ZIB Compositions
═══════════════          ═══════════════         ════════════════

┌─────────────┐          ┌─────────────┐         ┌─────────────┐
│ template_id │──────────│ definition_ │────────▶│  zib_id     │
│ region      │          │    id       │         │  (key)      │
│ display_    │          │ zib_mapping │◀────────│  content    │
│   title     │          │             │         │  (jsonb)    │
└─────────────┘          └─────────────┘         └─────────────┘

              JOIN via widget_definition_id
                            │
                            ▼
          widget_sections.zib_mapping = zib_compositions.zib_id
`}</CodeBlock>
      </Section>
    </div>
  );
}

function DatabaseSection() {
  return (
    <div className="space-y-6">
      <Section title="Database Schema">
        <p className="text-slate-700 mb-4">
          Het template systeem gebruikt 4 hoofdtabellen in Supabase:
        </p>
      </Section>

      <Section title="Tabellen Overzicht">
        <CodeBlock title="ERD">{`
┌────────────────────┐       ┌────────────────────┐
│    ui_templates    │       │  widget_definitions│
├────────────────────┤       ├────────────────────┤
│ id (PK)           │       │ id (PK)            │
│ name              │       │ name               │
│ work_context_id   │◀──┐   │ description        │
│ specialty_id      │   │   │ engine_type        │
│ theme_config      │   │   │ component_key      │
│ is_active         │   │   │ default_icon       │
└────────┬───────────┘   │   └─────────┬──────────┘
         │               │             │
         │ 1:N           │             │ 1:N
         ▼               │             ▼
┌────────────────────┐   │   ┌────────────────────┐
│ui_widget_instances │   │   │  widget_sections   │
├────────────────────┤   │   ├────────────────────┤
│ id (PK)           │   │   │ id (PK)            │
│ template_id (FK) ─┘   │   │ widget_definition_ │
│ widget_definition_│───┘   │    id (FK) ────────┘
│    id (FK)        │       │ label              │
│ region            │       │ zib_mapping        │
│ sort_order        │       │ ui_control_type    │
│ display_title     │       │ selected_fields    │
└────────────────────┘       │ sort_order         │
                            └────────────────────┘
`}</CodeBlock>
      </Section>

      <Section title="View: ui_templates_enriched">
        <CodeBlock title="SQL View">{`CREATE VIEW ui_templates_enriched AS
SELECT 
  t.id,
  t.name,
  t.work_context_id,
  wc.code AS work_context_code,
  wc.display_name AS work_context_name,
  t.specialty_id,
  s.code AS specialty_code,
  s.display_name AS specialty_name,
  t.theme_config,
  t.is_active
FROM ui_templates t
LEFT JOIN work_contexts wc ON t.work_context_id = wc.id
LEFT JOIN specialisms s ON t.specialty_id = s.id;`}</CodeBlock>
      </Section>

      <Section title="Handige Queries">
        <CodeBlock title="Templates per Werkcontext">{`-- Alle templates voor Polikliniek
SELECT * FROM ui_templates_enriched
WHERE work_context_code = 'POLI';

-- Template met widgets
SELECT 
  t.name,
  wi.region,
  wi.display_title,
  wd.name AS widget_type
FROM ui_templates t
JOIN ui_widget_instances wi ON wi.template_id = t.id
JOIN widget_definitions wd ON wi.widget_definition_id = wd.id
WHERE t.id = 'template-uuid'
ORDER BY wi.region, wi.sort_order;`}</CodeBlock>
      </Section>
    </div>
  );
}

function APISection() {
  return (
    <div className="space-y-6">
      <Section title="API & Hooks">
        <p className="text-slate-700 mb-4">
          De template data wordt opgehaald via React hooks in het Provider Dashboard.
        </p>
      </Section>

      <Section title="useDashboardLayout Hook">
        <CodeBlock title="hooks/useDashboardLayout.ts">{`import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export interface DashboardLayout {
  template: UITemplate;
  widgets: WidgetInstance[];
  sections: WidgetSection[];
}

export function useDashboardLayout(
  workContextId: string, 
  specialtyId?: string
) {
  const [layout, setLayout] = useState<DashboardLayout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLayout() {
      const supabase = createBrowserClient(...);

      // 1. Zoek matching template
      let query = supabase
        .from('ui_templates')
        .select('*')
        .eq('work_context_id', workContextId)
        .eq('is_active', true);

      if (specialtyId) {
        query = query.eq('specialty_id', specialtyId);
      }

      const { data: template } = await query.single();

      // 2. Haal widget instances op
      const { data: widgets } = await supabase
        .from('ui_widget_instances')
        .select('*, definition:widget_definitions(*)')
        .eq('template_id', template.id)
        .order('sort_order');

      // 3. Haal widget sections op
      const { data: sections } = await supabase
        .from('widget_sections')
        .select('*')
        .in('widget_definition_id', widgets.map(w => w.widget_definition_id));

      setLayout({ template, widgets, sections });
      setLoading(false);
    }

    fetchLayout();
  }, [workContextId, specialtyId]);

  return { layout, loading };
}`}</CodeBlock>
      </Section>

      <Section title="Widget Rendering">
        <CodeBlock title="WidgetRenderer Component">{`// components/dashboard/WidgetRenderer.tsx

interface WidgetRendererProps {
  widget: WidgetInstance;
  sections: WidgetSection[];
  patientId: string;
}

export function WidgetRenderer({ 
  widget, 
  sections, 
  patientId 
}: WidgetRendererProps) {
  // Filter secties voor deze widget
  const widgetSections = sections.filter(
    s => s.widget_definition_id === widget.widget_definition_id
  );

  // Render based on engine_type
  switch (widget.definition.engine_type) {
    case 'zib_viewer':
      return <ZibViewerWidget sections={widgetSections} />;
    case 'zib_editor':
      return <ZibEditorWidget sections={widgetSections} />;
    case 'chart':
      return <ChartWidget sections={widgetSections} />;
    default:
      return <StaticWidget content={widget.display_title} />;
  }
}`}</CodeBlock>
      </Section>
    </div>
  );
}

function TroubleshootingSection() {
  return (
    <div className="space-y-6">
      <Section title="Veelvoorkomende Problemen">
        <div className="space-y-4">
          <TroubleshootItem 
            problem="Template wordt niet geladen in Provider Dashboard"
            solution="Controleer of de work_context_id en specialty_id correct zijn gekoppeld aan de gebruiker. Check user_active_contexts tabel."
          />
          <TroubleshootItem 
            problem="Widgets verschijnen niet na toevoegen"
            solution="Klik op 'Layout Opslaan' in de Template Builder. Widgets worden pas zichtbaar na opslaan."
          />
          <TroubleshootItem 
            problem="ZIB data wordt niet getoond in widget"
            solution="Controleer de zib_mapping in widget_sections. Deze moet exact overeenkomen met de zib_id in zib_compositions."
          />
          <TroubleshootItem 
            problem="Template Builder laadt niet"
            solution="Check browser console voor errors. Mogelijk ontbreekt de template ID in de URL."
          />
        </div>
      </Section>

      <Section title="Debug Queries">
        <CodeBlock title="Template Debug">{`-- Check template koppeling
SELECT 
  t.name,
  wc.display_name AS work_context,
  s.display_name AS specialty
FROM ui_templates t
LEFT JOIN work_contexts wc ON t.work_context_id = wc.id
LEFT JOIN specialisms s ON t.specialty_id = s.id
WHERE t.is_active = true;

-- Check widget configuratie
SELECT 
  wi.display_title,
  wi.region,
  wd.name AS widget_type,
  ws.zib_mapping
FROM ui_widget_instances wi
JOIN widget_definitions wd ON wi.widget_definition_id = wd.id
LEFT JOIN widget_sections ws ON ws.widget_definition_id = wd.id
WHERE wi.template_id = 'your-template-uuid';`}</CodeBlock>
      </Section>

      <Section title="Support">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Meer hulp nodig?</strong><br />
            Check de <code className="bg-blue-100 px-1 rounded">/ui-config/database uitleg widgets en templates.md</code> 
            file voor gedetailleerde database documentatie.
          </p>
        </div>
      </Section>
    </div>
  );
}

function TroubleshootItem({ problem, solution }: { problem: string; solution: string }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertCircle size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-slate-900 mb-1">{problem}</p>
          <p className="text-sm text-slate-600">{solution}</p>
        </div>
      </div>
    </div>
  );
}

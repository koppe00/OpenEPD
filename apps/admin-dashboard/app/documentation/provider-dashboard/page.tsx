'use client';

import React, { useState, useRef } from 'react';
// Import html2pdf.js for PDF export
import html2pdf from 'html2pdf.js';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { 
  BookOpen, 
  Stethoscope,
  LayoutDashboard,
  Mic,
  FileText,
  Activity,
  Brain,
  Settings,
  Inbox,
  Users,
  ClipboardList,
  Workflow,
  AlertCircle
} from 'lucide-react';

export default function ProviderDashboardDocPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'OpenEPD_Provider_Dashboard.pdf',
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
        <h2 className="text-lg font-black text-slate-900 mb-4">Provider Dashboard</h2>
        <nav className="space-y-1">
          <NavItem 
            icon={BookOpen} 
            label="Overzicht" 
            active={activeSection === 'overview'}
            onClick={() => setActiveSection('overview')}
          />
          <NavItem 
            icon={LayoutDashboard} 
            label="Dashboard Layout" 
            active={activeSection === 'layout'}
            onClick={() => setActiveSection('layout')}
          />
          <NavItem 
            icon={Activity} 
            label="ZIB Widgets" 
            active={activeSection === 'widgets'}
            onClick={() => setActiveSection('widgets')}
          />
          <NavItem 
            icon={FileText} 
            label="Smart Template Editor" 
            active={activeSection === 'editor'}
            onClick={() => setActiveSection('editor')}
          />
          <NavItem 
            icon={Mic} 
            label="Voice Assistant" 
            active={activeSection === 'voice'}
            onClick={() => setActiveSection('voice')}
          />
          <NavItem 
            icon={Inbox} 
            label="Triage Module" 
            active={activeSection === 'triage'}
            onClick={() => setActiveSection('triage')}
          />
          <NavItem 
            icon={Brain} 
            label="AI Features" 
            active={activeSection === 'ai'}
            onClick={() => setActiveSection('ai')}
          />
          <NavItem 
            icon={Workflow} 
            label="Workflows" 
            active={activeSection === 'workflows'}
            onClick={() => setActiveSection('workflows')}
          />
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between max-w-4xl mb-4">
          <AdminHeader 
            title="Provider Dashboard Documentatie" 
            subtitle="Complete handleiding voor het zorgverlener werkstation"
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
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'layout' && <LayoutSection />}
          {activeSection === 'widgets' && <WidgetsSection />}
          {activeSection === 'editor' && <EditorSection />}
          {activeSection === 'voice' && <VoiceSection />}
          {activeSection === 'triage' && <TriageSection />}
          {activeSection === 'ai' && <AISection />}
          {activeSection === 'workflows' && <WorkflowsSection />}
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
      <Section title="Provider Dashboard">
        <p className="text-slate-700 mb-4">
          Het Provider Dashboard is het centrale werkstation voor zorgverleners. 
          Artsen en verpleegkundigen gebruiken deze applicatie voor alle klinische taken: 
          van consultvoering tot verslaglegging, van orderentry tot besluitondersteuning.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-blue-900 mb-2">🏥 Toegang</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>URL:</strong> http://localhost:3000</li>
            <li>• <strong>Login:</strong> Supabase Auth (email/password)</li>
            <li>• <strong>Rollen:</strong> md_specialist, nurse, admin</li>
          </ul>
        </div>
      </Section>

      <Section title="Belangrijkste Features">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard 
            icon={LayoutDashboard}
            title="Context-Aware Dashboard"
            description="Dynamische layout op basis van werkcontext (Poli, Kliniek, SEH, OK)"
          />
          <FeatureCard 
            icon={Activity}
            title="ZIB Widgets"
            description="120+ gestandaardiseerde klinische data widgets conform NICTIZ 2024"
          />
          <FeatureCard 
            icon={Mic}
            title="Voice Assistant"
            description="AI-gestuurde spraakherkenning voor hands-free documentatie"
          />
          <FeatureCard 
            icon={FileText}
            title="Smart Template Editor"
            description="Hybride narratieve + gestructureerde verslaglegging"
          />
          <FeatureCard 
            icon={Inbox}
            title="Triage Inbox"
            description="AI-ondersteunde verwerking van inkomende verwijzingen"
          />
          <FeatureCard 
            icon={Brain}
            title="Clinical Decision Support"
            description="Real-time AI suggesties en protocol ondersteuning"
          />
        </div>
      </Section>

      <Section title="Schermindeling">
        <CodeBlock title="Dashboard Layout">{`
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Patient ID │ Werkcontext Selector │ Template │ User Menu  │
├─────────────┬───────────────────────────────────────┬───────────────┤
│             │                                       │               │
│  SIDEBAR    │          MAIN CONTENT                │  RIGHT PANEL  │
│             │                                       │               │
│  - Patient  │  Afhankelijk van context:            │  - Orders     │
│    List     │  - ZIB Widgets                       │  - AI Assist  │
│  - Quick    │  - Template Editor                   │  - Protocols  │
│    Actions  │  - Triage Items                      │  - History    │
│             │  - Workflow Tasks                    │               │
│             │                                       │               │
└─────────────┴───────────────────────────────────────┴───────────────┘
`}</CodeBlock>
      </Section>

      <Section title="Navigatie Structuur">
        <ul className="text-sm text-slate-700 space-y-2">
          <li className="flex items-center gap-2">
            <code className="bg-slate-100 px-2 py-1 rounded">/</code>
            <span>Dashboard homepage met patiëntlijst</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="bg-slate-100 px-2 py-1 rounded">/patient/[id]</code>
            <span>Individueel patiëntdossier</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="bg-slate-100 px-2 py-1 rounded">/triage</code>
            <span>Triage inbox voor verwijzingen</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="bg-slate-100 px-2 py-1 rounded">/workflow</code>
            <span>Workflow taken en checklists</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="bg-slate-100 px-2 py-1 rounded">/login</code>
            <span>Authenticatie pagina</span>
          </li>
        </ul>
      </Section>
    </div>
  );
}

function LayoutSection() {
  return (
    <div className="space-y-6">
      <Section title="Dynamic Dashboard Layout">
        <p className="text-slate-700 mb-4">
          Het dashboard past zich automatisch aan op basis van de actieve werkcontext 
          en het gekozen template. Elk specialisme kan eigen templates definiëren.
        </p>
      </Section>

      <Section title="Werkcontext Switching">
        <p className="text-slate-700 mb-4">
          De werkcontext bepaalt welke templates beschikbaar zijn en welke kleuren/thema's worden gebruikt.
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r">
            <strong className="text-blue-900">POLI</strong>
            <p className="text-sm text-blue-700">Poliklinische spreekuren</p>
          </div>
          <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded-r">
            <strong className="text-green-900">KLINIEK</strong>
            <p className="text-sm text-green-700">Klinische opnames</p>
          </div>
          <div className="border-l-4 border-red-500 bg-red-50 p-3 rounded-r">
            <strong className="text-red-900">SEH</strong>
            <p className="text-sm text-red-700">Spoedeisende hulp</p>
          </div>
          <div className="border-l-4 border-purple-500 bg-purple-50 p-3 rounded-r">
            <strong className="text-purple-900">OK</strong>
            <p className="text-sm text-purple-700">Operatiekamer</p>
          </div>
        </div>
        
        <CodeBlock title="Context Selector Hook">{`// hooks/useWorkContexts.ts

export function useWorkContexts() {
  const [activeContext, setActiveContext] = useState(null);
  
  // Fetch user's available work contexts
  const { data: contexts } = useQuery('work_contexts', ...);
  
  // Fetch active context from user_active_contexts
  const { data: active } = useQuery('user_active_contexts', ...);
  
  // Switch context updates UI theme and available templates
  const switchContext = async (contextId: string) => {
    await supabase
      .from('user_active_contexts')
      .upsert({ user_id, active_work_context_id: contextId });
  };
  
  return { contexts, activeContext, switchContext };
}`}</CodeBlock>
      </Section>

      <Section title="Template System">
        <p className="text-slate-700 mb-4">
          Templates bepalen welke widgets worden getoond en waar. 
          Ze zijn gekoppeld aan werkcontexten en specialismen.
        </p>
        
        <h4 className="font-bold text-slate-900 mb-2">Template Filtering Logic:</h4>
        <CodeBlock title="Template Resolution">{`-- Database function: get_user_templates(p_user_id)

SELECT t.* FROM ui_templates t
WHERE t.is_active = true
AND (
  -- Match work_context
  t.work_context_id = user_active_work_context
  OR t.work_context_id IS NULL
)
AND (
  -- Match specialty
  t.specialty_id = user_active_specialism
  OR t.specialty_id IS NULL  
)
AND (
  -- Match roles
  user_role = ANY(t.allowed_roles)
  OR t.allowed_roles IS NULL
);`}</CodeBlock>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-bold text-amber-900 mb-2">💡 Tip</h4>
          <p className="text-sm text-amber-800">
            Gebruikers moeten zowel een <strong>⭐ primaire werkcontext</strong> als een 
            <strong> ⭐ primair specialisme</strong> hebben ingesteld om templates te zien. 
            Dit kan via Admin Dashboard → Gebruikers → Context tab.
          </p>
        </div>
      </Section>
    </div>
  );
}

function WidgetsSection() {
  return (
    <div className="space-y-6">
      <Section title="ZIB Widgets">
        <p className="text-slate-700 mb-4">
          ZIB (Zorginformatiebouwsteen) widgets zijn herbruikbare UI componenten voor 
          gestandaardiseerde klinische data invoer. Conform NICTIZ 2024 Gold Standard.
        </p>
      </Section>

      <Section title="Widget Architectuur">
        <CodeBlock title="Widget Structure">{`
UniversalZibWidget
├── ZibSummaryCard      # Compacte weergave in sidebar
├── ZibDetailPanel      # Uitgebreide invoer/weergave
├── ZibHistoryTable     # Historische metingen
└── VitalsTrendChart    # Grafische trends

┌─────────────────────────────────────────────────────┐
│  ZIB Widget: Bloeddruk                              │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                │
│  │ Systolisch   │  │ Diastolisch  │                │
│  │    142       │  │     91       │                │
│  │   mmHg       │  │   mmHg       │                │
│  └──────────────┘  └──────────────┘                │
│                                                     │
│  Houding: [Zittend ▼]  Manchet: [Standaard ▼]     │
│                                                     │
│  [+ Nieuwe meting]              [📊 Geschiedenis]  │
└─────────────────────────────────────────────────────┘
`}</CodeBlock>
      </Section>

      <Section title="ZIB Categorieën">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Vitale Parameters</h4>
            <div className="flex flex-wrap gap-2">
              <ZibBadge name="Bloeddruk" code="nl.zorg.Bloeddruk" />
              <ZibBadge name="Pols" code="nl.zorg.Polsfrequentie" />
              <ZibBadge name="Saturatie" code="nl.zorg.O2Saturatie" />
              <ZibBadge name="Temperatuur" code="nl.zorg.Lichaamstemperatuur" />
              <ZibBadge name="Ademhaling" code="nl.zorg.Ademhaling" />
              <ZibBadge name="Gewicht" code="nl.zorg.Lichaamsgewicht" />
              <ZibBadge name="Lengte" code="nl.zorg.Lichaamslengte" />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Laboratorium</h4>
            <div className="flex flex-wrap gap-2">
              <ZibBadge name="Lab Uitslag" code="nl.zorg.LaboratoriumUitslag" />
              <ZibBadge name="Tekst Uitslag" code="nl.zorg.TekstUitslag" />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Klinische Context</h4>
            <div className="flex flex-wrap gap-2">
              <ZibBadge name="Aandoening" code="nl.zorg.AandoeningOfGesteldheid" />
              <ZibBadge name="Allergie" code="nl.zorg.AllergieIntolerantie" />
              <ZibBadge name="Medicatie" code="nl.zorg.MedicatieGebruik" />
              <ZibBadge name="Verrichting" code="nl.zorg.Verrichting" />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Verslaglegging</h4>
            <div className="flex flex-wrap gap-2">
              <ZibBadge name="Anamnese" code="nl.zorg.Anamnese" />
              <ZibBadge name="Lichamelijk Onderzoek" code="nl.zorg.LichamelijkOnderzoek" />
              <ZibBadge name="Evaluatie" code="nl.zorg.Evaluatie" />
              <ZibBadge name="Beleid" code="nl.zorg.Beleid" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Widget Configuratie">
        <p className="text-slate-700 mb-4">
          Widgets worden geconfigureerd in de database en kunnen per template worden aangepast.
        </p>
        
        <CodeBlock title="Widget Definition">{`// widget_definitions table

{
  "id": "uuid",
  "name": "Vitals Overview",
  "component_key": "vitals_grid",
  "engine_type": "form",
  "default_icon": "activity"
}

// widget_sections table (fields in widget)

{
  "widget_definition_id": "...",
  "section_key": "bp",
  "label": "Bloeddruk",
  "zib_mapping": "nl.zorg.Bloeddruk",
  "selected_fields": ["systolic", "diastolic"],
  "ui_control_type": "compact"
}`}</CodeBlock>
      </Section>
    </div>
  );
}

function ZibBadge({ name, code }: { name: string; code: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs">
      <span className="font-semibold text-slate-900">{name}</span>
      <span className="text-slate-500 font-mono">{code.split('.').pop()}</span>
    </span>
  );
}

function EditorSection() {
  return (
    <div className="space-y-6">
      <Section title="Smart Template Editor">
        <p className="text-slate-700 mb-4">
          De Smart Template Editor combineert vrije tekst verslaglegging met gestructureerde 
          data invoer. Ideaal voor SOAP notities met automatische ZIB extractie.
        </p>
      </Section>

      <Section title="Editor Features">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FeatureCard 
            icon={FileText}
            title="Hybride Invoer"
            description="Narratieve tekst + gestructureerde ZIB velden in één editor"
          />
          <FeatureCard 
            icon={Brain}
            title="AI Extractie"
            description="Automatische herkenning van ZIB data uit vrije tekst"
          />
          <FeatureCard 
            icon={ClipboardList}
            title="SOAP Format"
            description="Subjectief, Objectief, Analyse, Plan secties"
          />
          <FeatureCard 
            icon={Settings}
            title="Template Based"
            description="Per specialisme configureerbare secties en velden"
          />
        </div>
      </Section>

      <Section title="SOAP Secties">
        <CodeBlock title="Editor Layout">{`
┌─────────────────────────────────────────────────────┐
│  SMART TEMPLATE EDITOR                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📋 SUBJECTIEF (Anamnese)                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ Patiënt komt met klachten van hoofdpijn    │   │
│  │ sinds 3 dagen, vooral 's ochtends...       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  🔬 OBJECTIEF (Onderzoek)                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ RR 142/91 mmHg, pols 78/min regulair       │   │
│  │ [+ ZIB: Bloeddruk] [+ ZIB: Pols]           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  💭 ANALYSE (Evaluatie)                            │
│  ┌─────────────────────────────────────────────┐   │
│  │ Mogelijk hypertensie-gerelateerde          │   │
│  │ spanningshoofdpijn                          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  📝 PLAN (Beleid)                                  │
│  ┌─────────────────────────────────────────────┐   │
│  │ - Bloeddrukcontrole 1x per week            │   │
│  │ - Start lisinopril 10mg 1dd               │   │
│  │ - Terugkeer over 2 weken                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [💾 Opslaan]  [🎤 Voice Input]  [🤖 AI Extract]  │
└─────────────────────────────────────────────────────┘
`}</CodeBlock>
      </Section>

      <Section title="Auto-Save & Versioning">
        <p className="text-slate-700 mb-4">
          Alle wijzigingen worden automatisch opgeslagen in <code className="bg-slate-100 px-1 rounded">verslagen</code> tabel. 
          Volledige audit trail van bewerkingen.
        </p>
        
        <CodeBlock title="Verslag Opslag">{`// Opslaan in Supabase

await supabase.from('verslagen').insert({
  patient_id: patientId,
  content: {
    subjectief: "...",
    objectief: "...",
    analyse: "...",
    plan: "..."
  },
  source: 'provider-dashboard',
  created_by: userId
});`}</CodeBlock>
      </Section>
    </div>
  );
}

function VoiceSection() {
  return (
    <div className="space-y-6">
      <Section title="Voice Assistant">
        <p className="text-slate-700 mb-4">
          De Voice Assistant maakt hands-free documentatie mogelijk. Spreek het consult in en 
          laat AI de gestructureerde data extraheren.
        </p>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-green-900 mb-2">✅ Production Ready</h4>
          <p className="text-sm text-green-800">
            Voice Assistant is volledig productie-klaar met database persistentie, 
            review workflow en audit trail.
          </p>
        </div>
      </Section>

      <Section title="Audio Pipeline">
        <CodeBlock title="Processing Flow">{`
┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────┐
│  Opname  │───►│ Transcriptie │───►│  Extractie  │───►│  Review  │
│  (WebM)  │    │  (Gemini)    │    │  (Gemini)   │    │  (User)  │
└──────────┘    └──────────────┘    └─────────────┘    └────┬─────┘
                                                            │
                                                            ▼
                                                     ┌──────────┐
                                                     │  Commit  │
                                                     │ (Supabase)│
                                                     └──────────┘

1. MediaRecorder API vangt audio (WebM formaat)
2. Gemini 2.5 transcribeert Nederlands spraak → tekst
3. Gemini 2.5 extraheert ZIB + SOAP + Billing data
4. Arts reviewt en past aan indien nodig
5. Goedgekeurde data wordt gecommit naar database
`}</CodeBlock>
      </Section>

      <Section title="Gebruik">
        <ol className="text-sm text-slate-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">1</span>
            <span>Ga naar Intelligence module in dashboard</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">2</span>
            <span>Klik <strong>"Start Consult Opname"</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">3</span>
            <span>Spreek het consult in (Nederlands)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">4</span>
            <span>Klik <strong>"Stop & Analyseer"</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">5</span>
            <span>Review resultaten in 3-kolommen console (ZIB / SOAP / Billing)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">6</span>
            <span>Vink correcte items aan</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">7</span>
            <span>Klik <strong>"Bevestig & Commit naar Dossier"</strong></span>
          </li>
        </ol>
      </Section>

      <Section title="Database Persistentie">
        <p className="text-slate-700 mb-4">
          Na commit worden data opgeslagen in meerdere tabellen:
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="font-mono text-sm text-slate-900">ai_extractions</code>
            <p className="text-xs text-slate-600 mt-1">Volledige audit trail</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="font-mono text-sm text-slate-900">zib_compositions</code>
            <p className="text-xs text-slate-600 mt-1">Klinische parameters</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="font-mono text-sm text-slate-900">verslagen</code>
            <p className="text-xs text-slate-600 mt-1">SOAP notities</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="font-mono text-sm text-slate-900">billing_items</code>
            <p className="text-xs text-slate-600 mt-1">Financiële codering</p>
          </div>
        </div>
      </Section>

      <Section title="Configuratie">
        <CodeBlock title=".env.local">{`# Voice Assistant API Keys (gescheiden van Live AI)
VOICE_ASSISTANT_GEMINI_KEY=AIzaSy...
VOICE_ASSISTANT_GEMINI_MODEL=gemini-2.5-flash-lite`}</CodeBlock>
      </Section>
    </div>
  );
}

function TriageSection() {
  return (
    <div className="space-y-6">
      <Section title="Triage Module">
        <p className="text-slate-700 mb-4">
          De Triage module verwerkt inkomende verwijzingen en helpt bij prioritering 
          met AI-ondersteuning. Simuleert ZorgDomein/Edifact integratie.
        </p>
      </Section>

      <Section title="Triage Workflow">
        <CodeBlock title="Verwijzing Flow">{`
┌─────────────┐    ┌───────────────┐    ┌─────────────┐    ┌──────────┐
│  Ontvangst  │───►│  AI Triage    │───►│   Review    │───►│ Accepteer│
│  (Inbox)    │    │  (Prioriteit) │    │   (Arts)    │    │  /Wijs   │
└─────────────┘    └───────────────┘    └─────────────┘    └──────────┘

Statusen:
- received     → Nieuw ontvangen
- triaged      → AI heeft prioriteit bepaald
- reviewed     → Arts heeft bekeken
- accepted     → Geaccepteerd, planning
- referred     → Doorverwezen naar ander specialisme
- rejected     → Afgewezen
`}</CodeBlock>
      </Section>

      <Section title="AI Prioritering">
        <p className="text-slate-700 mb-4">
          De AI agent analyseert de verwijsbrief en bepaalt urgentie op basis van:
        </p>
        <ul className="text-sm text-slate-700 space-y-1 mb-4">
          <li>• Beschreven symptomen en duur</li>
          <li>• Vermoeden diagnose van verwijzer</li>
          <li>• Comorbiditeiten en risicofactoren</li>
          <li>• Historische data (indien beschikbaar)</li>
        </ul>
        
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">SPOED</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">HOOG</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">NORMAAL</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">LAAG</span>
        </div>
      </Section>

      <Section title="Referrals Tabel">
        <CodeBlock title="Database Schema">{`CREATE TABLE referrals (
  id UUID PRIMARY KEY,
  patient_bsn TEXT,
  patient_initials TEXT,
  patient_lastname TEXT,
  source_name TEXT,           -- "Huisarts de Vries"
  reason TEXT,                 -- Verwijsreden
  priority TEXT,               -- high/medium/low
  status TEXT,                 -- received/triaged/accepted
  received_at TIMESTAMPTZ,
  triage_notes JSONB,         -- AI triage output
  reviewed_by UUID REFERENCES profiles(id)
);`}</CodeBlock>
      </Section>
    </div>
  );
}

function AISection() {
  return (
    <div className="space-y-6">
      <Section title="AI Features">
        <p className="text-slate-700 mb-4">
          OpenEPD integreert AI op meerdere niveaus voor maximale ondersteuning van zorgverleners.
        </p>
      </Section>

      <Section title="Beschikbare AI Features">
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">FEATURE</span>
              <strong className="text-slate-900">ZIB Extraction</strong>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Extraheert gestructureerde ZIB data uit vrije tekst of spraak transcripties.
            </p>
            <code className="text-xs bg-slate-100 px-2 py-1 rounded">
              "Patiënt heeft bloeddruk 142/91" → nl.zorg.Bloeddruk: systolic=142, diastolic=91
            </code>
          </div>
          
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">FEATURE</span>
              <strong className="text-slate-900">Clinical Summarization</strong>
            </div>
            <p className="text-sm text-slate-600">
              Genereert samenvattingen van complexe dossiers, eerdere consulten of opnames.
            </p>
          </div>
          
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">FEATURE</span>
              <strong className="text-slate-900">Coding Assistant</strong>
            </div>
            <p className="text-sm text-slate-600">
              Suggereert ICD-10, ICPC en DBC codes op basis van consultinhoud.
            </p>
          </div>
          
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">FEATURE</span>
              <strong className="text-slate-900">Clinical Decision Support</strong>
            </div>
            <p className="text-sm text-slate-600">
              Real-time waarschuwingen en suggesties op basis van clinical protocols.
            </p>
          </div>
        </div>
      </Section>

      <Section title="AI Configuratie">
        <p className="text-slate-700 mb-4">
          AI features zijn configureerbaar per specialisme, werkcontext of individuele gebruiker. 
          Zie <strong>AI Configuration</strong> documentatie voor details.
        </p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-bold text-amber-900 mb-2">💡 Hiërarchische Config</h4>
          <p className="text-sm text-amber-800">
            User → Group → Role → Specialisme → Werkcontext → Org → Global
          </p>
        </div>
      </Section>
    </div>
  );
}

function WorkflowsSection() {
  return (
    <div className="space-y-6">
      <Section title="Workflow Engine">
        <p className="text-slate-700 mb-4">
          De workflow engine ondersteunt klinische processen met BPMN-gebaseerde workflows. 
          Dit is momenteel een prototype met basis functionaliteit.
        </p>
        
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-orange-900 mb-2">⚠️ Prototype Status</h4>
          <p className="text-sm text-orange-800">
            De workflow engine is in ontwikkeling. Basis event publishing naar Kafka werkt, 
            maar complexe BPMN execution is nog niet volledig geïmplementeerd.
          </p>
        </div>
      </Section>

      <Section title="Protocol Engine">
        <p className="text-slate-700 mb-4">
          Naast BPMN workflows ondersteunt OpenEPD rule-based clinical protocols voor 
          besluitondersteuning.
        </p>
        
        <CodeBlock title="Protocol Rule Voorbeeld">{`// clinical_protocols + protocol_rules tables

{
  "title": "MDL - Coeliakie",
  "specialty": "MDL",
  "rules": [{
    "logic_type": "AND",
    "condition_json": {
      "zib": "nl.zorg.Diagnose",
      "operator": "contains", 
      "value": "Coeliakie"
    },
    "alert_level": "info",
    "alert_message": "Coeliakie protocol actief!"
  }],
  "actions": [{
    "action_type": "order_lab",
    "label": "Lab aanvragen",
    "action_payload": { "tests": ["tTG-IgA", "DGP"] }
  }]
}`}</CodeBlock>
      </Section>

      <Section title="Workflow Taken">
        <p className="text-slate-700 mb-4">
          Workflow taken kunnen automatisch worden gegenereerd of handmatig aangemaakt:
        </p>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• <strong>Checklists:</strong> Pre-operatieve screening, ontslagcheck</li>
          <li>• <strong>Reminders:</strong> Follow-up afspraken, medicatiecontrole</li>
          <li>• <strong>Approvals:</strong> Verwijzing goedkeuren, order autoriseren</li>
          <li>• <strong>Handoffs:</strong> Overdracht tussen diensten/afdelingen</li>
        </ul>
      </Section>
    </div>
  );
}

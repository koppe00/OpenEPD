'use client';

import React, { useState, useRef } from 'react';
// Import html2pdf.js for PDF export
import html2pdf from 'html2pdf.js';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { 
  BookOpen, 
  Settings, 
  Layers, 
  Users,
  CheckCircle,
  AlertCircle,
  Code,
  Database,
  Star,
  Building2,
  Briefcase,
  MapPin,
  Shield,
  LayoutTemplate,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export default function WorkContextsDocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'OpenEPD_Work_Contexts.pdf',
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
        <h2 className="text-lg font-black text-slate-900 mb-4">Work Contexts</h2>
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
            icon={Users} 
            label="Gebruikersbeheer" 
            active={activeSection === 'user-management'}
            onClick={() => setActiveSection('user-management')}
          />
          <NavItem 
            icon={LayoutTemplate} 
            label="Templates" 
            active={activeSection === 'templates'}
            onClick={() => setActiveSection('templates')}
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
            title="Unified Work Contexts Documentatie" 
            subtitle="Complete handleiding voor het context-gebaseerde template en toegangssysteem"
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
          {activeSection === 'user-management' && <UserManagementSection />}
          {activeSection === 'templates' && <TemplatesSection />}
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

function OverviewSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <div className="space-y-6">
      <Section title="Wat is het Unified Work Contexts Systeem?">
        <p className="text-slate-700 mb-4">
          Het Unified Work Contexts systeem is de centrale architectuur voor het beheren van gebruikerscontexten 
          binnen OpenEPD. Het vervangt het oude ui_contexts systeem en biedt een flexibele, database-gedreven 
          manier om werkcontexten, specialismen, rollen en templates te beheren.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Kernprincipe:</strong> Een gebruiker heeft toegang tot meerdere werkcontexten en specialismen, 
            maar slechts één is op elk moment <strong>actief</strong> (gemarkeerd met ⭐). De actieve context 
            bepaalt welke templates en functies beschikbaar zijn.
          </p>
        </div>
      </Section>

      {/* Quick Start CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <GraduationCap size={24} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Snel aan de slag?</h3>
        </div>
        <p className="text-slate-700 mb-4">
          Volg onze stap-voor-stap tutorial om werkcontexten en specialismen aan een gebruiker toe te wijzen.
        </p>
        <button
          onClick={() => setActiveSection('tutorial')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Tutorial
          <ArrowRight size={16} />
        </button>
      </div>

      <Section title="Belangrijkste Concepten">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard 
            icon={MapPin}
            title="Werkcontext"
            description="Waar werkt de gebruiker? (Polikliniek, Kliniek, SEH, OK, etc.)"
          />
          <FeatureCard 
            icon={Briefcase}
            title="Specialisme"
            description="Welk medisch specialisme? (Interne, Chirurgie, Cardiologie, etc.)"
          />
          <FeatureCard 
            icon={Shield}
            title="Rol"
            description="Systeemrol van de gebruiker (Arts, Verpleegkundige, Admin, etc.)"
          />
          <FeatureCard 
            icon={Building2}
            title="Organisatie"
            description="Aan welke organisatie/afdeling is de gebruiker verbonden?"
          />
        </div>
      </Section>

      <Section title="Hoe werkt het?">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">1</div>
            <div>
              <h4 className="font-bold text-slate-900">Toewijzing (Admin)</h4>
              <p className="text-sm text-slate-600">
                Via de Admin UI → Gebruikers → Contexten tab worden werkcontexten en specialismen aan gebruikers toegewezen.
                Meerdere selecties zijn mogelijk (✓), maar slechts één per categorie kan primair zijn (⭐).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">2</div>
            <div>
              <h4 className="font-bold text-slate-900">Actieve Context (Database)</h4>
              <p className="text-sm text-slate-600">
                De primaire selecties worden opgeslagen in <code className="bg-slate-100 px-1 rounded">user_active_contexts</code>. 
                Dit bepaalt de huidige actieve context van de gebruiker.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">3</div>
            <div>
              <h4 className="font-bold text-slate-900">Template Filtering (Frontend)</h4>
              <p className="text-sm text-slate-600">
                De <code className="bg-slate-100 px-1 rounded">get_user_templates()</code> functie filtert templates op basis 
                van de actieve werkcontext + specialisme. Alleen matching templates worden getoond.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">4</div>
            <div>
              <h4 className="font-bold text-slate-900">Context Switching (Gebruiker)</h4>
              <p className="text-sm text-slate-600">
                Via de sidebar dropdown kan de gebruiker wisselen tussen toegewezen werkcontexten. 
                De templates updaten automatisch.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Implementatie Status">
        <div className="space-y-3">
          <StatusItem status="done" text="Database schema (work_contexts, user_work_contexts, user_active_contexts)" />
          <StatusItem status="done" text="Admin UI voor context toewijzing met ⭐ primaire selectie" />
          <StatusItem status="done" text="Template filtering op werkcontext + specialisme" />
          <StatusItem status="done" text="Context switcher in provider-dashboard sidebar" />
          <StatusItem status="done" text="Theme kleuren per werkcontext" />
          <StatusItem status="done" text="Auto-assign trigger voor nieuwe gebruikers" />
        </div>
      </Section>
    </div>
  );
}

function StatusItem({ status, text }: { status: 'done' | 'pending'; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {status === 'done' ? (
        <CheckCircle size={16} className="text-green-600" />
      ) : (
        <AlertCircle size={16} className="text-amber-500" />
      )}
      <span className={status === 'done' ? 'text-slate-700' : 'text-slate-500'}>{text}</span>
    </div>
  );
}

function TutorialStep({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap size={28} />
          <h2 className="text-2xl font-black">Tutorial: Contexten Toewijzen</h2>
        </div>
        <p className="text-blue-100">
          Leer hoe je werkcontexten en specialismen aan een gebruiker toewijst via de Admin UI.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-200">
          <span>⏱️ Geschatte tijd: 5 minuten</span>
          <span className="mx-2">•</span>
          <span>📋 Vereist: Admin rechten</span>
        </div>
      </div>

      {/* Tutorial Steps */}
      <Section title="Stap-voor-stap handleiding">
        <div className="space-y-8">
          <TutorialStep step={1} title="Open de Gebruikersbeheer pagina">
            <p>
              Navigeer naar <strong>Gebruikers</strong> in de Admin Dashboard sidebar. Je ziet een overzicht 
              van alle gebruikers in het systeem.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-slate-600">
                <strong>💡 Tip:</strong> Gebruik de zoekbalk om snel een gebruiker te vinden op naam of e-mail.
              </p>
            </div>
          </TutorialStep>

          <TutorialStep step={2} title="Selecteer een gebruiker">
            <p>
              Klik op de rij van de gebruiker die je wilt bewerken. Het gebruikersdetail paneel 
              opent aan de rechterkant met meerdere tabs.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Let op:</strong> Je kunt alleen gebruikers bewerken waarvoor je de juiste rechten hebt. 
                Als beheerder heb je toegang tot alle gebruikers.
              </p>
            </div>
          </TutorialStep>

          <TutorialStep step={3} title="Ga naar de Contexten tab">
            <p>
              In het gebruikerspaneel zie je bovenaan tabs: <strong>Profiel</strong>, <strong>Contexten</strong>, 
              <strong>AI Configuratie</strong>. Klik op <strong>Contexten</strong>.
            </p>
            <p>
              Je ziet nu twee secties:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Werkcontexten</strong> - Waar werkt de gebruiker? (Polikliniek, Kliniek, SEH, etc.)</li>
              <li><strong>Specialismen</strong> - Welk medisch specialisme? (Interne, Chirurgie, Cardiologie, etc.)</li>
            </ul>
          </TutorialStep>

          <TutorialStep step={4} title="Wijs werkcontexten toe">
            <p>
              In de <strong>Werkcontexten</strong> sectie zie je een lijst met beschikbare contexten. 
              Elke context heeft twee acties:
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="font-semibold">Toegang (✓)</span>
                </div>
                <p className="text-sm text-slate-600">
                  Klik op het vinkje om de gebruiker toegang te geven tot deze werkcontext.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={18} className="text-amber-500" />
                  <span className="font-semibold">Primair (⭐)</span>
                </div>
                <p className="text-sm text-slate-600">
                  Klik op de ster om deze context als primair/standaard in te stellen.
                </p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-green-800">
                <strong>✅ Best practice:</strong> Een gebruiker kan toegang hebben tot meerdere werkcontexten 
                (bijv. Polikliniek én Kliniek), maar slechts één kan primair zijn. De primaire context 
                wordt automatisch geselecteerd bij inloggen.
              </p>
            </div>
          </TutorialStep>

          <TutorialStep step={5} title="Wijs specialismen toe">
            <p>
              Herhaal hetzelfde proces voor <strong>Specialismen</strong>:
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-2">
              <li>Klik op <strong>✓</strong> naast elk specialisme waar de gebruiker toegang tot moet hebben</li>
              <li>Klik op <strong>⭐</strong> bij het primaire specialisme</li>
            </ol>
            <div className="bg-slate-900 rounded-lg p-4 mt-4">
              <p className="text-sm text-slate-300 font-mono">
                <span className="text-blue-400">Voorbeeld:</span> Een cardioloog die ook algemene interne 
                geneeskunde doet:<br/>
                <span className="text-green-400">✓ Cardiologie</span> <span className="text-amber-400">⭐</span> (primair)<br/>
                <span className="text-green-400">✓ Interne Geneeskunde</span>
              </p>
            </div>
          </TutorialStep>

          <TutorialStep step={6} title="Sla de wijzigingen op">
            <p>
              De wijzigingen worden <strong>automatisch opgeslagen</strong> wanneer je op de iconen klikt. 
              Je ziet een korte bevestigingsmelding rechtsonderin het scherm.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Direct effect:</strong> De gebruiker ziet de nieuwe contexten direct na 
                paginaverversing. Bij de volgende login wordt automatisch de primaire context geladen.
              </p>
            </div>
          </TutorialStep>
        </div>
      </Section>

      {/* What happens behind the scenes */}
      <Section title="Wat gebeurt er achter de schermen?">
        <p className="text-slate-700 mb-4">
          Wanneer je contexten toewijst, worden de volgende database-operaties uitgevoerd:
        </p>
        <CodeBlock title="Database wijzigingen">
{`-- Bij toewijzen van werkcontext met ✓
INSERT INTO user_work_contexts (user_id, work_context_id, is_primary)
VALUES ('user-uuid', 'POLI', false);

-- Bij aanvinken ⭐ als primair
UPDATE user_work_contexts SET is_primary = false 
WHERE user_id = 'user-uuid';  -- Reset alle
UPDATE user_work_contexts SET is_primary = true 
WHERE user_id = 'user-uuid' AND work_context_id = 'POLI';

-- Update actieve context
INSERT INTO user_active_contexts (user_id, active_work_context_id)
VALUES ('user-uuid', 'POLI')
ON CONFLICT (user_id) 
DO UPDATE SET active_work_context_id = 'POLI';`}
        </CodeBlock>
      </Section>

      {/* Template matching explanation */}
      <Section title="Hoe beïnvloedt dit templates?">
        <p className="text-slate-700 mb-4">
          De actieve werkcontext en specialisme bepalen welke templates de gebruiker ziet:
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LayoutTemplate size={20} className="text-blue-600" />
            </div>
            <span className="font-bold text-slate-900">Template Matching Logica</span>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
            <li>Gebruiker logt in → primaire context wordt geladen</li>
            <li>Frontend roept <code className="bg-white px-1 rounded">get_user_templates(user_id)</code> aan</li>
            <li>Functie leest actieve_work_context + actieve_specialism uit user_active_contexts</li>
            <li>Templates worden gefilterd op matching work_context_id en specialism_id</li>
            <li>Alleen relevante templates worden geretourneerd en getoond</li>
          </ol>
        </div>
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>💡 Voorbeeld:</strong> Een arts met actieve context "Polikliniek" + "Cardiologie" 
            ziet alleen templates die gekoppeld zijn aan die combinatie, zoals "Cardiologie Polikliniek Intake".
          </p>
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
        <p className="text-green-800">
          Je weet nu hoe je werkcontexten en specialismen aan gebruikers toewijst. De gebruiker 
          kan nu context-specifieke templates zien en tussen contexten wisselen via de sidebar.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Context toewijzing
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Primaire selectie
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            ✓ Template filtering
          </span>
        </div>
      </div>
    </div>
  );
}

function ArchitectureSection() {
  return (
    <div className="space-y-6">
      <Section title="Database Architectuur">
        <p className="text-slate-700 mb-4">
          Het systeem bestaat uit meerdere tabellen die samen de context-architectuur vormen:
        </p>
        
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 mb-2">Kern Tabellen</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><code className="bg-white px-2 py-0.5 rounded">work_contexts</code> - Definitie van werkcontexten (POLI, KLINIEK, SEH, etc.)</li>
              <li><code className="bg-white px-2 py-0.5 rounded">specialisms</code> - Medische specialismen (CHIR, INT, CARD, etc.)</li>
              <li><code className="bg-white px-2 py-0.5 rounded">roles</code> - Systeemrollen (md_specialist, nurse, admin, etc.)</li>
              <li><code className="bg-white px-2 py-0.5 rounded">organizations</code> - Organisaties en afdelingen</li>
              <li><code className="bg-white px-2 py-0.5 rounded">groups</code> - Teams en groepen</li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 mb-2">Koppeltabellen (Toewijzing)</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><code className="bg-white px-2 py-0.5 rounded">user_work_contexts</code> - Welke werkcontexten heeft een gebruiker (+ is_primary)</li>
              <li><code className="bg-white px-2 py-0.5 rounded">user_specialisms</code> - Welke specialismen heeft een gebruiker (+ is_primary)</li>
              <li><code className="bg-white px-2 py-0.5 rounded">user_roles</code> - Welke rollen heeft een gebruiker</li>
              <li><code className="bg-white px-2 py-0.5 rounded">user_organizations</code> - Aan welke organisaties is verbonden</li>
              <li><code className="bg-white px-2 py-0.5 rounded">user_groups</code> - In welke groepen zit de gebruiker</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 mb-2">Actieve Context Tabel</h4>
            <p className="text-sm text-blue-800 mb-2">
              <code className="bg-white px-2 py-0.5 rounded">user_active_contexts</code> - De huidige actieve selectie per gebruiker
            </p>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• <code>user_id</code> → FK naar profiles.id</li>
              <li>• <code>active_work_context_id</code> → Huidige werkcontext</li>
              <li>• <code>active_specialism_id</code> → Huidig specialisme</li>
              <li>• <code>active_role_id</code> → Huidige rol</li>
              <li>• <code>active_organization_id</code> → Huidige organisatie</li>
              <li>• <code>active_group_id</code> → Huidige groep</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Foreign Key Relaties">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-amber-800">
            <strong>Let op:</strong> Alle user-gerelateerde FK's verwijzen naar <code>profiles.id</code>, niet naar 
            <code>auth.users.id</code>. Bij normale user creatie zijn deze identiek, maar bij legacy data kunnen ze afwijken.
          </p>
        </div>
        
        <CodeBlock title="FK Relaties">{`-- Koppeltabellen
user_work_contexts.user_id → profiles.id
user_specialisms.user_id → profiles.id
user_active_contexts.user_id → profiles.id

-- Work context relaties
work_contexts.id → user_work_contexts.work_context_id
work_contexts.id → user_active_contexts.active_work_context_id
work_contexts.id → ui_templates.work_context_id`}</CodeBlock>
      </Section>

      <Section title="Template Koppeling">
        <p className="text-slate-700 mb-4">
          Templates worden gekoppeld aan werkcontexten en optioneel aan specialismen:
        </p>
        <CodeBlock title="ui_templates structuur">{`ui_templates
├── id (PK)
├── name
├── work_context_id (FK → work_contexts.id)  -- VERPLICHT
├── specialty_id (FK → specialisms.id)       -- OPTIONEEL
├── allowed_roles (UUID[])                   -- Optionele rol-restrictie
└── ...widgets, config, etc.`}</CodeBlock>
        
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="font-bold text-slate-900 mb-2">Filtering Logica</h4>
          <p className="text-sm text-slate-700">
            Een template is zichtbaar als:
          </p>
          <ul className="text-sm text-slate-600 mt-2 space-y-1">
            <li>1. <code>work_context_id</code> matcht de actieve werkcontext</li>
            <li>2. <code>specialty_id</code> is NULL <strong>OF</strong> matcht het actieve specialisme</li>
            <li>3. <code>allowed_roles</code> is NULL <strong>OF</strong> bevat een van de gebruikersrollen</li>
          </ul>
        </div>
      </Section>
    </div>
  );
}

function UserManagementSection() {
  return (
    <div className="space-y-6">
      <Section title="Context Toewijzing via Admin UI">
        <p className="text-slate-700 mb-4">
          De primaire manier om contexten toe te wijzen is via de Admin UI:
        </p>
        
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 mb-2">Stappen</h4>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
              <li>Ga naar <strong>Gebruikersbeheer</strong> → selecteer een gebruiker</li>
              <li>Open de <strong>Contexten</strong> tab in de modal</li>
              <li>Selecteer de gewenste items met het <strong>vinkje ✓</strong> (toewijzing)</li>
              <li>Markeer één item per categorie met het <strong>sterretje ⭐</strong> (primair/actief)</li>
              <li>Klik <strong>Contexten Opslaan</strong></li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-yellow-500" fill="currentColor" />
              <h4 className="font-bold text-blue-900">Verschil ✓ vs ⭐</h4>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>✓ Vinkje:</strong> Gebruiker heeft <em>toegang</em> tot deze context</li>
              <li><strong>⭐ Ster:</strong> Dit is de <em>actieve/primaire</em> context bij inloggen</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Automatische Toewijzing (Nieuwe Gebruikers)">
        <p className="text-slate-700 mb-4">
          Bij het aanmaken van een nieuwe gebruiker worden automatisch standaard contexten toegewezen via een database trigger:
        </p>
        
        <CodeBlock title="Trigger: assign_default_work_contexts">{`-- Deze trigger wordt uitgevoerd na INSERT op profiles
-- Wijst standaard werkcontexten toe op basis van app_role

TRIGGER: trigger_assign_default_work_contexts
ON: profiles (AFTER INSERT)

Logica:
- md_specialist → POLI, KLINIEK (POLI = primary)
- nurse → KLINIEK, SEH (KLINIEK = primary)  
- admin → ADMIN (primary)
- patient → Geen werkcontexten`}</CodeBlock>
      </Section>

      <Section title="Context Switchen (Gebruiker)">
        <p className="text-slate-700 mb-4">
          Gebruikers kunnen hun actieve werkcontext wijzigen via de sidebar in het provider-dashboard:
        </p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="font-bold text-slate-900 mb-2">UnifiedContextNavigator Component</h4>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>• Toont huidige werkcontext met thema-kleuren</li>
            <li>• Dropdown met alle toegewezen werkcontexten</li>
            <li>• Klikken op een context update <code>user_active_contexts</code></li>
            <li>• Templates worden automatisch gefilterd</li>
          </ul>
        </div>
      </Section>
    </div>
  );
}

function TemplatesSection() {
  return (
    <div className="space-y-6">
      <Section title="Template Configuratie">
        <p className="text-slate-700 mb-4">
          Templates worden gekoppeld aan werkcontexten en optioneel aan specialismen via de Admin UI:
        </p>
        
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 mb-2">Template Aanmaken/Bewerken</h4>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
              <li>Ga naar <strong>UI Configuratie</strong> → <strong>Templates</strong></li>
              <li>Maak een nieuwe template of bewerk een bestaande</li>
              <li>Selecteer de <strong>Werkcontext</strong> (verplicht)</li>
              <li>Optioneel: selecteer een <strong>Specialisme</strong> voor specifieke filtering</li>
              <li>Configureer widgets en secties</li>
              <li>Sla op</li>
            </ol>
          </div>
        </div>
      </Section>

      <Section title="Filtering Voorbeelden">
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-900 mb-2">Voorbeeld 1: Generieke Poli Template</h4>
            <CodeBlock>{`Template: "Polikliniek Standaard"
work_context_id: POLI
specialty_id: NULL

→ Zichtbaar voor ALLE specialismen in Polikliniek context`}</CodeBlock>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 mb-2">Voorbeeld 2: Specialisme-specifieke Template</h4>
            <CodeBlock>{`Template: "Chirurgie Standaard"
work_context_id: POLI
specialty_id: CHIR

→ Alleen zichtbaar voor Chirurgen in Polikliniek context`}</CodeBlock>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h4 className="font-bold text-purple-900 mb-2">Voorbeeld 3: Kliniek Template</h4>
            <CodeBlock>{`Template: "Klinische Opname Master"
work_context_id: KLINIEK
specialty_id: INT

→ Alleen zichtbaar voor Internisten in Kliniek context`}</CodeBlock>
          </div>
        </div>
      </Section>

      <Section title="Theme Configuratie">
        <p className="text-slate-700 mb-4">
          Elke werkcontext heeft eigen thema-kleuren die doorwerken in de UI:
        </p>
        
        <CodeBlock title="work_contexts.theme_config">{`{
  "primary": "#2563eb",    // Hoofdkleur (sidebar accent, buttons)
  "secondary": "#dbeafe",  // Achtergrondkleur (sidebar bg)
  "accent": "#3b82f6"      // Highlight kleur
}`}</CodeBlock>

        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="font-bold text-slate-900 mb-2">Standaard Kleuren per Context</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0891b2' }}></div>
              <span>Polikliniek - Cyan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#7c3aed' }}></div>
              <span>Kliniek - Purple</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
              <span>SEH - Red</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#059669' }}></div>
              <span>OK - Green</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

function DatabaseSection() {
  return (
    <div className="space-y-6">
      <Section title="Belangrijke Database Functies">
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 mb-2">get_user_context(p_user_id UUID)</h4>
            <p className="text-sm text-slate-600 mb-2">
              Retourneert de huidige actieve context van een gebruiker.
            </p>
            <CodeBlock>{`SELECT * FROM get_user_context('user-uuid-here');

-- Returns:
-- organization_code, role_code, specialism_code, 
-- group_code, work_context_code`}</CodeBlock>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 mb-2">get_user_templates(p_user_id UUID)</h4>
            <p className="text-sm text-slate-600 mb-2">
              Retourneert alle templates die beschikbaar zijn voor de actieve context van de gebruiker.
            </p>
            <CodeBlock>{`SELECT * FROM get_user_templates('user-uuid-here');

-- Returns templates gefilterd op:
-- 1. Actieve work_context_id
-- 2. Actieve specialism_id (of NULL)
-- 3. Gebruikersrollen (als allowed_roles is ingesteld)`}</CodeBlock>
          </div>
        </div>
      </Section>

      <Section title="Views">
        <CodeBlock title="ui_templates_enriched">{`-- Enriched view met work_context en specialty details
CREATE VIEW ui_templates_enriched AS
SELECT 
  t.*,
  wc.code AS work_context_code,
  wc.display_name AS work_context_name,
  wc.theme_config,
  wc.icon_name,
  s.code AS specialty_code,
  s.display_name AS specialty_name
FROM ui_templates t
LEFT JOIN work_contexts wc ON wc.id = t.work_context_id
LEFT JOIN specialisms s ON s.id = t.specialty_id;`}</CodeBlock>
      </Section>

      <Section title="Migraties">
        <div className="space-y-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <code className="text-sm font-mono">010_unify_work_contexts.sql</code>
            <p className="text-sm text-slate-600 mt-1">
              Hoofd-migratie: work_contexts tabel, koppelingen, views, functies
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <code className="text-sm font-mono">011_user_work_context_auto_assign_v2.sql</code>
            <p className="text-sm text-slate-600 mt-1">
              Trigger voor automatische context toewijzing bij nieuwe gebruikers
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <code className="text-sm font-mono">012_fix_user_active_contexts_fk.sql</code>
            <p className="text-sm text-slate-600 mt-1">
              FK fix: user_active_contexts.user_id → profiles.id
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

function APISection() {
  return (
    <div className="space-y-6">
      <Section title="Frontend Hooks">
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 mb-2">useWorkContexts (provider-dashboard)</h4>
            <CodeBlock>{`import { useWorkContexts } from '@/hooks/useWorkContexts';

const { 
  workContexts,      // Alle toegewezen contexten
  activeContext,     // Huidige actieve context
  isLoading,
  error,
  switchContext,     // Wissel naar andere context
  refreshContexts    // Herlaad data
} = useWorkContexts(userId);`}</CodeBlock>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 mb-2">useContexts (admin-dashboard)</h4>
            <CodeBlock>{`import { useContexts } from '@/hooks/useContexts';

const {
  specialisms,        // Alle specialismen
  groups,             // Alle groepen
  workContexts,       // Alle werkcontexten
  roles,              // Alle rollen
  organizations,      // Alle organisaties
  loading,
  fetchUserContexts,  // Haal contexts op voor specifieke user
  saveUserContexts    // Sla contexts op (inclusief actieve)
} = useContexts();`}</CodeBlock>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-900 mb-2">useDashboardLayout (provider-dashboard)</h4>
            <CodeBlock>{`import { useDashboardLayout } from '@/hooks/useDashboardLayout';

const {
  leftWidgets,
  mainWidgets,
  rightWidgets,
  loading,
  availableTemplates,  // Gefilterd op actieve context!
  activeTemplateId,
  switchTemplate
} = useDashboardLayout({
  workContextId: activeContext?.id,
  specialtyId: null,  // Komt uit user_active_contexts
  userId: authUser?.id
});`}</CodeBlock>
          </div>
        </div>
      </Section>

      <Section title="Supabase RPC Calls">
        <CodeBlock>{`// Haal actieve context op
const { data } = await supabase.rpc('get_user_context', {
  p_user_id: userId
});

// Haal beschikbare templates op
const { data: templates } = await supabase.rpc('get_user_templates', {
  p_user_id: userId
});`}</CodeBlock>
      </Section>
    </div>
  );
}

function TroubleshootingSection() {
  return (
    <div className="space-y-6">
      <Section title="Veelvoorkomende Problemen">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-bold text-red-900 mb-2">"Geen templates beschikbaar"</h4>
            <p className="text-sm text-red-800 mb-2">
              De template dropdown is leeg ondanks dat er templates bestaan.
            </p>
            <div className="bg-white rounded-lg p-3 text-sm">
              <strong>Mogelijke oorzaken:</strong>
              <ul className="list-disc list-inside mt-1 text-slate-700">
                <li><code>active_work_context_id</code> is NULL in user_active_contexts</li>
                <li>Geen template geconfigureerd voor de huidige werkcontext + specialisme combinatie</li>
                <li>Template heeft <code>allowed_roles</code> die niet matchen</li>
              </ul>
              <strong className="block mt-2">Oplossing:</strong>
              <ol className="list-decimal list-inside mt-1 text-slate-700">
                <li>Check: <code>SELECT * FROM get_user_templates('user-id');</code></li>
                <li>Verifieer actieve context in Admin UI → Contexten tab</li>
                <li>Zorg dat er een ⭐ staat bij zowel werkcontext als specialisme</li>
              </ol>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-bold text-red-900 mb-2">FK Constraint Error bij opslaan</h4>
            <p className="text-sm text-red-800 mb-2">
              "violates foreign key constraint user_active_contexts_user_id_fkey"
            </p>
            <div className="bg-white rounded-lg p-3 text-sm">
              <strong>Oorzaak:</strong>
              <p className="text-slate-700">
                De <code>user_id</code> die wordt gebruikt bestaat niet in de <code>profiles</code> tabel, 
                of de FK verwijst naar de verkeerde tabel.
              </p>
              <strong className="block mt-2">Oplossing:</strong>
              <p className="text-slate-700">
                Voer migratie 012 uit om de FK te corrigeren naar <code>profiles.id</code>.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-bold text-red-900 mb-2">Duplicate Profile Records</h4>
            <p className="text-sm text-red-800 mb-2">
              Meerdere profiles met hetzelfde email veroorzaken inconsistente data.
            </p>
            <div className="bg-white rounded-lg p-3 text-sm">
              <strong>Detectie:</strong>
              <CodeBlock>{`SELECT email, COUNT(*) 
FROM profiles 
GROUP BY email 
HAVING COUNT(*) > 1;`}</CodeBlock>
              <strong className="block mt-2">Oplossing:</strong>
              <ol className="list-decimal list-inside mt-1 text-slate-700">
                <li>Identificeer het juiste profile (match met auth.users.id)</li>
                <li>Migreer koppelingen naar het juiste profile</li>
                <li>Verwijder duplicaten</li>
                <li>Voeg UNIQUE constraint toe: <code>ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);</code></li>
              </ol>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Debug Queries">
        <CodeBlock title="Check user's volledige context situatie">{`-- 1. Check profiles
SELECT id, email, full_name FROM profiles WHERE email = 'user@example.com';

-- 2. Check actieve context
SELECT 
  uac.*,
  wc.code as work_context,
  s.code as specialism
FROM user_active_contexts uac
LEFT JOIN work_contexts wc ON wc.id = uac.active_work_context_id
LEFT JOIN specialisms s ON s.id = uac.active_specialism_id
WHERE uac.user_id = 'user-uuid';

-- 3. Check toegewezen contexten
SELECT 
  uwc.is_primary,
  wc.code,
  wc.display_name
FROM user_work_contexts uwc
JOIN work_contexts wc ON wc.id = uwc.work_context_id
WHERE uwc.user_id = 'user-uuid';

-- 4. Check beschikbare templates
SELECT * FROM get_user_templates('user-uuid');`}</CodeBlock>
      </Section>
    </div>
  );
}

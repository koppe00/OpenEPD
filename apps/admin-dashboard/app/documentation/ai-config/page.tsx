'use client';

import React, { useState, useRef } from 'react';
// Import html2pdf.js for PDF export
import html2pdf from 'html2pdf.js';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { 
  BookOpen, 
  Settings, 
  Layers, 
  Zap,
  CheckCircle,
  AlertCircle,
  Code,
  Database,
  Terminal,
  X,
  GraduationCap
} from 'lucide-react';

export default function AIConfigDocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'OpenEPD_AI_Configuration.pdf',
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
        <h2 className="text-lg font-black text-slate-900 mb-4">AI Configuration</h2>
        <nav className="space-y-1">
          <NavItem 
            icon={BookOpen} 
            label="Overzicht" 
            active={activeSection === 'overview'}
            onClick={() => setActiveSection('overview')}
          />
          <NavItem 
            icon={Settings} 
            label="Deployment" 
            active={activeSection === 'deployment'}
            onClick={() => setActiveSection('deployment')}
          />
          <NavItem 
            icon={Layers} 
            label="Architectuur" 
            active={activeSection === 'architecture'}
            onClick={() => setActiveSection('architecture')}
          />
          <NavItem 
            icon={GraduationCap} 
            label="🎓 Tutorial" 
            active={activeSection === 'tutorial'}
            onClick={() => setActiveSection('tutorial')}
          />
          <NavItem 
            icon={Zap} 
            label="Gebruik" 
            active={activeSection === 'usage'}
            onClick={() => setActiveSection('usage')}
          />
          <NavItem 
            icon={Code} 
            label="API" 
            active={activeSection === 'api'}
            onClick={() => setActiveSection('api')}
          />
          <NavItem 
            icon={Database} 
            label="Database" 
            active={activeSection === 'database'}
            onClick={() => setActiveSection('database')}
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
            title="AI Configuration Systeem Documentatie" 
            subtitle="Complete handleiding voor het AI Governance & Configuration systeem"
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
          {activeSection === 'deployment' && <DeploymentSection />}
          {activeSection === 'architecture' && <ArchitectureSection />}
          {activeSection === 'tutorial' && <TutorialSection />}
          {activeSection === 'usage' && <UsageSection setActiveSection={setActiveSection} />}
          {activeSection === 'api' && <APISection />}
          {activeSection === 'database' && <DatabaseSection />}
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

function OverviewSection({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  return (
    <div className="space-y-6">
      <Section title="Wat is het AI Configuration Systeem?">
        <p className="text-slate-700">
          Het AI Configuration systeem biedt een flexibele, hiërarchische manier om AI features te configureren 
          op basis van context (gebruiker, specialisme, werkcontext, etc.). Hiermee kun je per specialisme of 
          zelfs per individuele gebruiker verschillende instellingen gebruiken voor AI-functies zoals ZIB extraction, 
          clinical summarization, en coding assistance.
        </p>
      </Section>

      <Section title="Belangrijkste Features">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard 
            icon={Layers}
            title="Hiërarchische Scopes"
            description="7-niveau prioriteit systeem: User → Group → Role → Specialisme → Werkcontext → Org → Global"
          />
          <FeatureCard 
            icon={Settings}
            title="Feature Management"
            description="Beheer AI features met config schemas en default waarden"
          />
          <FeatureCard 
            icon={Zap}
            title="Dynamic Configuration"
            description="Realtime config resolutie op basis van gebruikerscontext"
          />
          <FeatureCard 
            icon={CheckCircle}
            title="Usage Analytics"
            description="Track welke features gebruikt worden en door wie"
          />
        </div>
      </Section>

      <Section title="Default Configuratie">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-bold text-slate-700 mb-3">
            Het systeem komt met 3 pre-geconfigureerde features:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-900">zib_extraction</span>
                <p className="text-sm text-slate-600">
                  Structured data extraction met configureerbare ZIB sets per specialisme
                </p>
                <code className="text-xs bg-white px-2 py-1 rounded mt-1 inline-block">
                  enabled_zibs: [Bloeddruk, Hartfrequentie, Anamnese, ...]
                </code>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-900">clinical_summarization</span>
                <p className="text-sm text-slate-600">
                  AI-gestuurde clinical summaries met style en length configuratie
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-900">coding_assistant</span>
                <p className="text-sm text-slate-600">
                  ICD-10/ICPC code suggesties met confidence thresholds
                </p>
              </div>
            </li>
          </ul>
        </div>
      </Section>

      <Section title="Wanneer te gebruiken?">
        <ul className="space-y-3">
          <UseCaseItem 
            title="Per Specialisme ZIB Sets"
            description="Cardiologie heeft andere vitals nodig dan Psychiatrie"
          />
          <UseCaseItem 
            title="Organisatie-specifieke Instellingen"
            description="Ziekenhuis A gebruikt andere templates dan Ziekenhuis B"
          />
          <UseCaseItem 
            title="User Overrides"
            description="Individuele zorgverlener wil andere AI settings"
          />
          <UseCaseItem 
            title="Werkcontext Aanpassingen"
            description="Polikliniek vs SEH hebben verschillende urgentie/detail levels"
          />
        </ul>
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
              Leer in 3 eenvoudige stappen hoe je een AI feature configureert voor een specialisme. 
              Geen technische kennis nodig - alleen klikken en typen!
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

function DeploymentSection() {
  return (
    <div className="space-y-6">
      <Section title="Eenmalige Setup (Technisch Beheerder)">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-yellow-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-900 mb-2">Let op: Dit is een eenmalige technische installatie</p>
              <p className="text-sm text-yellow-800">
                Deze stap hoeft maar één keer uitgevoerd te worden door een technisch beheerder. 
                Daarna kun je alles via de grafische interface beheren.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-bold text-blue-900 mb-3">📋 Installatie Checklist</p>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Open Supabase Dashboard → SQL Editor</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Plak het installatie script en klik "Run"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>✅ Klaar! Alle tabellen en default instellingen zijn nu actief</span>
            </li>
          </ol>
        </div>
      </Section>

      <Section title="Gebruik via de Interface">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
            <CheckCircle size={20} />
            Na de installatie: Alles via knoppen en dropdown menus!
          </h4>
          
          <div className="space-y-4">
            <UIActionCard 
              step="1"
              title="Navigeer naar AI Governance"
              description="Klik in de sidebar op System → AI Configuratie"
              color="blue"
            />
            
            <UIActionCard 
              step="2"
              title="Maak een Scope (bijv. Cardiologie)"
              description="Tab 'Scopes' → Knop '+ Nieuwe Scope' → Vul formulier in → Opslaan"
              details={[
                "Type: Kies 'Specialisme' uit dropdown",
                "Naam: Typ 'Cardiologie'",
                "Label: Typ 'Cardiologie'",
                "Prioriteit wordt automatisch ingesteld"
              ]}
              color="purple"
            />
            
            <UIActionCard 
              step="3"
              title="Configureer ZIB Set voor Cardiologie"
              description="Tab 'Configuraties' → Knop '+ Nieuwe Toewijzing'"
              details={[
                "Feature: Selecteer 'zib_extraction' uit dropdown",
                "Scope: Selecteer 'Cardiologie' uit dropdown",
                "ZIB's: Kies gewenste ZIBs uit lijst (checkboxes)",
                "Mode: Kies 'merge' of 'replace'",
                "Klik 'Opslaan'"
              ]}
              color="green"
            />
          </div>
        </div>
      </Section>

      <Section title="Geen Commando's Meer!">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <X size={16} />
              ❌ Niet meer nodig
            </p>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• SQL queries typen</li>
              <li>• Terminal commando's</li>
              <li>• Database tools</li>
              <li>• Code bewerken</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle size={16} />
              ✅ Wel beschikbaar
            </p>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Knoppen en formulieren</li>
              <li>• Dropdown menu's</li>
              <li>• Checkboxes voor ZIB selectie</li>
              <li>• Direct opslaan en testen</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}

function TutorialSection() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-black text-blue-900 mb-2 flex items-center gap-3">
          <GraduationCap size={32} />
          🎯 Stap-voor-Stap Tutorial
        </h2>
        <p className="text-blue-800 text-lg">
          Leer in 3 eenvoudige stappen hoe je een nieuwe AI feature configureert voor een specialisme (bijv. Nucleaire Geneeskunde).
        </p>
      </div>

      <Section title="📋 Wat ga je doen?">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-slate-700 mb-3">
            Je gaat een nieuwe AI feature maken die specifieke ZIB's extraheert voor consulten in de Nucleaire Geneeskunde.
          </p>
          <div className="flex items-start gap-2 text-sm text-green-800">
            <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Resultaat:</strong> Wanneer een arts uit Nucleaire Geneeskunde een consult invoert, 
              stuurt het systeem automatisch alleen de relevante ZIB's mee naar de AI.
            </span>
          </div>
        </div>
      </Section>

      <Section title="🚀 Stap 1: Maak een nieuwe Scope aan (Specialisme)">
        <div className="space-y-4">
          <p className="text-slate-700 font-semibold">
            Een <span className="text-purple-600">Scope</span> = voor wie geldt deze configuratie?
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-bold text-slate-900 mb-3">✨ Wat te doen:</p>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2"><span className="font-bold text-blue-600">1.</span> Open het Admin Dashboard: http://localhost:3002</li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">2.</span> Log in met je admin account</li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">3.</span> Ga naar: Systeem → AI Configuratie</li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">4.</span> Klik op het tabje: <strong>"Scopes"</strong></li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">5.</span> Klik op: <strong>"+ Nieuwe Scope"</strong></li>
            </ol>
          </div>

          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5">
            <p className="font-bold text-purple-900 mb-3">📝 Vul het formulier in:</p>
            
            <div className="space-y-4 bg-white rounded-lg p-4">
              <div className="border-l-4 border-purple-400 pl-4">
                <p className="text-sm font-bold text-purple-900 mb-1">🟣 Kies Type Scope</p>
                <div className="bg-purple-100 px-3 py-2 rounded text-sm font-mono">
                  [Specialisme ▼] (Prioriteit 40)
                </div>
                <p className="text-xs text-slate-600 mt-1">💡 Voor medische specialismen (bijv. Cardiologie, Interne Geneeskunde)</p>
              </div>

              <div className="border-l-4 border-blue-400 pl-4">
                <p className="text-sm font-bold text-blue-900 mb-1">🔵 Label (Weergavenaam) *</p>
                <div className="bg-blue-100 px-3 py-2 rounded text-sm font-mono">
                  Nucleaire Geneeskunde
                </div>
                <p className="text-xs text-slate-600 mt-1">📝 Dit is de naam die je ziet in de interface</p>
              </div>

              <div className="border-l-4 border-green-400 pl-4">
                <p className="text-sm font-bold text-green-900 mb-1">🟢 Waarde (Technische ID) *</p>
                <div className="bg-green-100 px-3 py-2 rounded text-sm font-mono">
                  Nucleaire Geneeskunde
                </div>
                <p className="text-xs text-slate-600 mt-1">📝 Gebruik exact dezelfde waarde als het label</p>
              </div>

              <div className="border-l-4 border-slate-400 pl-4">
                <p className="text-sm font-bold text-slate-900 mb-1">Prioriteit</p>
                <div className="bg-slate-100 px-3 py-2 rounded text-sm font-mono">
                  40 (automatisch ingesteld)
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg font-bold">
                ✅ Opslaan
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">
              <strong>Gelukt!</strong> Je hebt nu een scope "Nucleaire Geneeskunde" aangemaakt!
            </p>
          </div>
        </div>
      </Section>

      <Section title="🎨 Stap 2: Maak een nieuwe AI Feature aan">
        <div className="space-y-4">
          <p className="text-slate-700 font-semibold">
            Een <span className="text-blue-600">Feature</span> = welke AI functionaliteit wil je gebruiken?
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-bold text-slate-900 mb-3">✨ Wat te doen:</p>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2"><span className="font-bold text-blue-600">1.</span> Klik op het tabje: <strong>"Features"</strong></li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">2.</span> Klik op: <strong>"+ Nieuwe Feature"</strong></li>
            </ol>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5">
            <p className="font-bold text-blue-900 mb-3">📝 Vul het formulier in:</p>
            
            <div className="space-y-4 bg-white rounded-lg p-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <p className="text-sm font-bold text-blue-900 mb-1">🔵 Feature ID *</p>
                <div className="bg-blue-100 px-3 py-2 rounded text-sm font-mono">
                  nucleaire_zib_extraction
                </div>
                <p className="text-xs text-slate-600 mt-1">📝 Alleen kleine letters, cijfers en underscores</p>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <p className="text-sm font-bold text-purple-900 mb-1">🟣 Feature Naam *</p>
                <div className="bg-purple-100 px-3 py-2 rounded text-sm font-mono">
                  Nucleaire Geneeskunde ZIB Extract
                </div>
                <p className="text-xs text-slate-600 mt-1">📝 Leesbare naam die in de interface getoond wordt</p>
              </div>

              <div className="border-l-4 border-green-400 pl-4">
                <p className="text-sm font-bold text-green-900 mb-1">🟢 Beschrijving</p>
                <div className="bg-green-100 px-3 py-2 rounded text-sm">
                  Extraheert specifieke ZIB's voor nucleaire geneeskunde consulten
                </div>
                <p className="text-xs text-slate-600 mt-1">📝 Optioneel: uitleg wat deze feature doet</p>
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <p className="text-sm font-bold text-orange-900 mb-1">🟠 Categorie</p>
                <div className="bg-orange-100 px-3 py-2 rounded text-sm font-mono">
                  [Clinical ▼]
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Opties: Clinical, Administrative, Analytics, Support
                </p>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="w-4 h-4" />
                  <span className="text-sm text-slate-700">☑️ Feature is Actief</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" readOnly className="w-4 h-4" />
                  <span className="text-sm text-slate-700">☐ Beta Feature</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
                ✅ Opslaan
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">
              <strong>Gelukt!</strong> Je hebt nu een feature "Nucleaire Geneeskunde ZIB Extract" aangemaakt!
            </p>
          </div>
        </div>
      </Section>

      <Section title="🔗 Stap 3: Koppel Feature aan Scope (Configuratie)">
        <div className="space-y-4">
          <p className="text-slate-700 font-semibold">
            Een <span className="text-green-600">Assignment</span> = welke ZIB's wil je meesturen voor dit specialisme?
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-bold text-slate-900 mb-3">✨ Wat te doen:</p>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2"><span className="font-bold text-blue-600">1.</span> Klik op het tabje: <strong>"Configuraties"</strong></li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">2.</span> Klik op: <strong>"+ Nieuwe Configuratie"</strong></li>
            </ol>
          </div>

          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5">
            <p className="font-bold text-green-900 mb-3">📝 Vul het formulier in:</p>
            
            <div className="space-y-4 bg-white rounded-lg p-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <p className="text-sm font-bold text-blue-900 mb-2">1️⃣ 🔵 Kies AI Feature</p>
                <div className="bg-blue-100 px-3 py-2 rounded text-sm font-mono">
                  [Nucleaire Geneeskunde ZIB Extract ▼]
                </div>
                <p className="text-xs text-slate-600 mt-1">De feature die je net hebt aangemaakt</p>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <p className="text-sm font-bold text-purple-900 mb-2">2️⃣ 🟣 Selecteer Scope</p>
                <div className="bg-purple-100 px-3 py-2 rounded text-sm font-mono">
                  [Nucleaire Geneeskunde ▼]
                </div>
                <p className="text-xs text-slate-600 mt-1">Het specialisme waar dit voor geldt</p>
              </div>

              <div className="border-l-4 border-green-400 pl-4">
                <p className="text-sm font-bold text-green-900 mb-2">3️⃣ 🟢 Selecteer ZIB's</p>
                <div className="bg-green-50 p-3 rounded space-y-3">
                  <div>
                    <p className="font-semibold text-xs text-slate-700 mb-1">Vitale Parameters</p>
                    <div className="space-y-1 text-sm">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked readOnly />
                        <span>nl.zorg.Bloeddruk</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked readOnly />
                        <span>nl.zorg.Hartfrequentie</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-xs text-slate-700 mb-1">Consultatie</p>
                    <div className="space-y-1 text-sm">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked readOnly />
                        <span>nl.zorg.Anamnese</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked readOnly />
                        <span>nl.zorg.LichamelijkOnderzoek</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked readOnly />
                        <span>nl.zorg.Evaluatie</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-xs text-slate-700 mb-1">Klinische Data</p>
                    <div className="space-y-1 text-sm">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked readOnly />
                        <span>nl.zorg.Laboratoriumuitslag</span>
                      </label>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-green-700 mt-2">📊 6/21 ZIBs geselecteerd</p>
                </div>
              </div>

              <div className="border-l-4 border-slate-400 pl-4">
                <p className="text-sm font-bold text-slate-900 mb-2">💬 Extra Instructies (Optioneel)</p>
                <div className="bg-slate-50 px-3 py-2 rounded text-sm italic text-slate-600">
                  Leg nadruk op schildklier parameters en isotopen informatie
                </div>
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <p className="text-sm font-bold text-orange-900 mb-2">4️⃣ 🟠 Override Modus</p>
                <div className="space-y-2">
                  <label className="flex items-start gap-2">
                    <input type="radio" name="override" checked readOnly />
                    <div>
                      <span className="font-semibold text-sm">Merge met standaard configuratie</span>
                      <p className="text-xs text-slate-600">Voegt deze ZIB's toe aan de globale standaard</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="radio" name="override" readOnly />
                    <div>
                      <span className="font-semibold text-sm">Vervang standaard configuratie</span>
                      <p className="text-xs text-slate-600">Gebruikt ALLEEN deze ZIB's (geen andere)</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold">
                ✅ Configuratie Opslaan
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">
              <strong>Gelukt!</strong> Je configuratie is nu actief!
            </p>
          </div>
        </div>
      </Section>

      <Section title="🎉 Klaar! Wat gebeurt er nu?">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-xl p-5">
          <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Zap size={20} className="text-blue-600" />
            Automatische werking:
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">1</div>
              <p className="text-sm text-slate-700 pt-1"><strong>Arts uit Nucleaire Geneeskunde</strong> logt in op het systeem</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-600 font-bold">2</div>
              <p className="text-sm text-slate-700 pt-1"><strong>Systeem detecteert</strong> specialisme = "Nucleaire Geneeskunde"</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 font-bold">3</div>
              <p className="text-sm text-slate-700 pt-1"><strong>AI Feature wordt geladen</strong> met jouw geselecteerde ZIB's</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-600 font-bold">4</div>
              <p className="text-sm text-slate-700 pt-1"><strong>Bij consult invoer:</strong> alleen de 6 geselecteerde ZIB's worden naar de AI gestuurd</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">5</div>
              <p className="text-sm text-slate-700 pt-1"><strong>AI verwerkt</strong> specifiek deze data en extraheert relevante informatie</p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
          <h4 className="font-bold text-purple-900 mb-3">📊 Prioriteit Systeem:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono text-xs">10</span>
              <span className="font-semibold">User</span>
              <span className="text-slate-600">← Hoogste prioriteit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-mono text-xs">20</span>
              <span className="font-semibold">Group</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-mono text-xs">30</span>
              <span className="font-semibold">Role</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-mono text-xs font-bold">40</span>
              <span className="font-semibold">Specialisme</span>
              <span className="text-green-600 font-bold">← Dit heb je net geconfigureerd!</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono text-xs">50</span>
              <span className="font-semibold">Werkcontext</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono text-xs">60</span>
              <span className="font-semibold">Organization</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-xs">100</span>
              <span className="font-semibold">Global</span>
              <span className="text-slate-600">← Standaard fallback</span>
            </div>
          </div>
          <p className="text-xs text-purple-700 mt-3 italic">
            💡 Als een individuele gebruiker een eigen configuratie heeft, gaat die vóór het specialisme!
          </p>
        </div>
      </Section>

      <Section title="💡 Tips & Veelvoorkomende Scenario's">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle size={16} />
              ✅ Best Practices
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Begin met standaard ZIB's van je specialisme</li>
              <li>• Test eerst met klein aantal ZIB's</li>
              <li>• Breid uit als je meer nodig hebt</li>
              <li>• Gebruik "Merge" modus als default</li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <AlertCircle size={16} />
              ⚠️ Let op
            </h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Feature ID kan niet meer worden gewijzigd</li>
              <li>• Scope waarde moet exact overeenkomen</li>
              <li>• Selecteer alleen relevante ZIB's</li>
              <li>• Meer is niet altijd beter voor AI</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-900 mb-2">🔧 Aanpassen</h4>
            <p className="text-sm text-green-800">
              Ga naar Configuraties → Klik ✏️ → Wijzig ZIB selectie → Opslaan. Wijzigingen zijn direct actief!
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-bold text-red-900 mb-2">🗑️ Verwijderen</h4>
            <p className="text-sm text-red-800">
              Ga naar Configuraties → Klik 🗑️ → Bevestig. Feature en Scope blijven bestaan voor hergebruik.
            </p>
          </div>
        </div>
      </Section>

      <Section title="✅ Checklist">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="font-bold text-slate-900 mb-3">Heb je alles gedaan?</p>
          <div className="space-y-2">
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" className="mt-0.5" />
              <span>Scope aangemaakt voor jouw specialisme/user/context</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" className="mt-0.5" />
              <span>Feature aangemaakt met duidelijke naam</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" className="mt-0.5" />
              <span>Feature op "Actief" gezet</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" className="mt-0.5" />
              <span>Assignment gemaakt die Feature + Scope koppelt</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" className="mt-0.5" />
              <span>Relevante ZIB's geselecteerd</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" className="mt-0.5" />
              <span>Getest of configuratie verschijnt in lijst</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" className="mt-0.5" />
              <span>(Optioneel) Extra instructies toegevoegd</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" className="mt-0.5" />
              <span>(Optioneel) Override modus gekozen</span>
            </label>
          </div>
          
          <div className="mt-5 bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300 rounded-lg p-4 text-center">
            <p className="text-lg font-black text-green-900">
              🎉 Gefeliciteerd! Je hebt succesvol een AI configuratie toegevoegd!
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

function ArchitectureSection() {
  return (
    <div className="space-y-6">
      <Section title="Config Resolution Priority">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="space-y-3">
            <PriorityLevel level={1} type="User" priority={10} description="Hoogste prioriteit - individuele gebruiker" />
            <PriorityLevel level={2} type="Group" priority={20} description="Gebruikersgroepen (teams, afdelingen)" />
            <PriorityLevel level={3} type="Role" priority={30} description="Functierollen (physician, nurse, admin)" />
            <PriorityLevel level={4} type="Specialisme" priority={40} description="Medisch specialisme (Cardiologie, etc.)" color="green" />
            <PriorityLevel level={5} type="Werkcontext" priority={50} description="Werklocatie (Polikliniek, SEH)" />
            <PriorityLevel level={6} type="Organization" priority={60} description="Organisatie/ziekenhuis niveau" />
            <PriorityLevel level={7} type="Global" priority={100} description="Laagste prioriteit - fallback default" />
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-4">
          <strong>Let op:</strong> Lagere prioriteitsnummers betekenen <strong>hogere voorrang</strong>. 
          Een User config (10) overschrijft altijd een Specialisme config (40).
        </p>
      </Section>

      <Section title="Override Modes">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-900 mb-2">merge (Samenvoegen)</h4>
            <p className="text-sm text-green-700 mb-3">
              Voegt custom config samen met default config (additief)
            </p>
            <CodeBlock>
{`// Default (Global)
{ "enabled_zibs": ["A", "B"] }

// Custom (Specialisme)
{ "enabled_zibs": ["C", "D"] }

// Result = merge
{ "enabled_zibs": ["A","B","C","D"] }`}
            </CodeBlock>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h4 className="font-bold text-orange-900 mb-2">replace (Vervangen)</h4>
            <p className="text-sm text-orange-700 mb-3">
              Vervangt default config volledig (override)
            </p>
            <CodeBlock>
{`// Default (Global)
{ "enabled_zibs": ["A", "B"] }

// Custom (Specialisme)
{ "enabled_zibs": ["C", "D"] }

// Result = replace
{ "enabled_zibs": ["C", "D"] }`}
            </CodeBlock>
          </div>
        </div>
      </Section>

      <Section title="Data Flow">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="space-y-4">
            <FlowStep from="Voice Assistant" to="extract/route.ts" description="Transcript + user context" />
            <FlowStep from="extract/route.ts" to="extractFromTranscript()" description="Context: specialisme, role" />
            <FlowStep from="extractFromTranscript()" to="resolveExtractionConfig()" description="Fetch AI config" />
            <FlowStep from="resolveExtractionConfig()" to="/api/ai-config/resolve" description="POST with context" />
            <FlowStep from="/api/ai-config/resolve" to="resolve_ai_config() SQL" description="Priority-based lookup" />
            <FlowStep from="resolve_ai_config() SQL" to="extractFromTranscript()" description="Merged config" />
            <FlowStep from="extractFromTranscript()" to="Gemini AI" description="Dynamic prompt" />
            <FlowStep from="Gemini AI" to="ZIB Compositions" description="Structured data" />
          </div>
        </div>
      </Section>
    </div>
  );
}

function UsageSection({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-purple-900 mb-2">
              📚 Nieuw bij AI Configuratie?
            </h3>
            <p className="text-purple-800 mb-3">
              De Tutorial sectie bevat een complete stap-voor-stap handleiding met screenshots en voorbeelden. 
              Perfect voor je eerste configuratie!
            </p>
            <button
              onClick={() => setActiveSection('tutorial')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              🚀 Start de Tutorial →
            </button>
          </div>
        </div>
      </div>

      <Section title="Praktijkvoorbeeld: Cardiologie Instellen">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 space-y-6">
          
          {/* Step 1 */}
          <StepGuide
            step={1}
            title="Open AI Configuratie"
            icon="🖱️"
            actions={[
              "Klik in sidebar: System → AI Configuratie",
              "Je ziet nu 5 tabs bovenaan"
            ]}
          />

          {/* Step 2 */}
          <StepGuide
            step={2}
            title="Maak een Scope voor Cardiologie"
            icon="➕"
            actions={[
              "Klik op tab: 'Scopes & Hiërarchie'",
              "Klik op knop: '+ Nieuwe Scope' (paars, rechtsboven)",
              "Formulier verschijnt - vul in:",
              "  └ Type: Selecteer 'Specialisme' uit dropdown",
              "  └ Value: Typ 'Cardiologie'",
              "  └ Label: Typ 'Cardiologie'",
              "  └ Prioriteit: Staat automatisch op 40",
              "Klik 'Opslaan'"
            ]}
          />

          {/* Step 3 */}
          <StepGuide
            step={3}
            title="Kies ZIBs voor Cardiologie"
            icon="⚙️"
            actions={[
              "Klik op tab: 'Configuraties'",
              "Klik op knop: '+ Nieuwe Toewijzing'",
              "Vul in:",
              "  └ Feature: Selecteer 'ZIB Extraction' uit dropdown",
              "  └ Scope: Selecteer 'Cardiologie' uit dropdown",
              "  └ Override mode: Kies 'merge' of 'replace'",
              "Bewerk JSON config met ZIB lijst:",
              "  └ Kopieer de default lijst",
              "  └ Voeg toe: 'nl.zorg.ECG', 'nl.zorg.Hartritme'",
              "  └ Verwijder: Niet-relevante ZIBs",
              "Klik 'Opslaan'"
            ]}
          />

          {/* Step 4 */}
          <StepGuide
            step={4}
            title="Test de Configuratie"
            icon="✅"
            actions={[
              "Ga naar Provider Dashboard",
              "Zorg dat je profiel specialisme 'Cardiologie' heeft",
              "Open Voice Assistant bij een patiënt",
              "Spreek een consult in met cardiale parameters",
              "Check in console: '[ExtractionEngine] Resolved config for Cardiologie'",
              "Alleen Cardiologie ZIBs worden nu geëxtraheerd!"
            ]}
          />
        </div>
      </Section>

      <Section title="Interface Elementen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InterfaceCard
            title="Dropdown Menus"
            description="Selecteer features, scopes en types uit voorgedefinieerde lijsten"
            icon="📋"
            examples={["Feature selecteren", "Scope type kiezen", "Override mode"]}
          />
          
          <InterfaceCard
            title="Formulieren"
            description="Vul eenvoudige velden in, geen technische kennis nodig"
            icon="📝"
            examples={["Scope naam", "Label invoeren", "Beschrijving"]}
          />
          
          <InterfaceCard
            title="Toggle Switches"
            description="Schakel features en configuraties aan/uit met één klik"
            icon="🔘"
            examples={["Feature activeren", "Assignment actief", "Beta mode"]}
          />
        </div>
      </Section>

      <Section title="Tips & Tricks">
        <div className="space-y-3">
          <TipCard
            type="success"
            title="Merge Mode voor Uitbreidingen"
            description="Gebruik 'merge' als je ZIBs wilt toevoegen aan de standaard set (bijvoorbeeld extra cardiale ZIBs voor Cardiologie)"
          />
          
          <TipCard
            type="warning"
            title="Replace Mode voor Volledige Controle"
            description="Gebruik 'replace' als je een compleet andere ZIB set wilt (bijvoorbeeld alleen psychiatrische ZIBs voor Psychiatrie)"
          />
          
          <TipCard
            type="info"
            title="User Overrides zijn het Krachtigst"
            description="Een configuratie op gebruikersniveau overschrijft altijd een specialisme configuratie"
          />
        </div>
      </Section>
    </div>
  );
}

function APISection() {
  return (
    <div className="space-y-6">
      <Section title="POST /api/ai-config/resolve">
        <p className="text-sm text-slate-600 mb-3">Resolve config voor een feature + context</p>
        <CodeBlock language="bash">
{`curl -X POST http://localhost:3001/api/ai-config/resolve \\
  -H "Content-Type: application/json" \\
  -d '{
    "feature_id": "zib_extraction",
    "user_id": "uuid",
    "specialisme": "Cardiologie",
    "role": "physician"
  }'`}
        </CodeBlock>
        
        <p className="text-sm font-semibold text-slate-700 mt-4 mb-2">Response:</p>
        <CodeBlock language="json">
{`{
  "feature_id": "zib_extraction",
  "config": {
    "enabled_zibs": ["nl.zorg.Bloeddruk", ...],
    "custom_prompt": "..."
  },
  "resolved_from": {
    "scope_type": "specialisme",
    "scope_value": "Cardiologie",
    "priority": 40
  },
  "is_active": true
}`}
        </CodeBlock>
      </Section>

      <Section title="GET /api/ai-config/resolve">
        <p className="text-sm text-slate-600 mb-3">Automatische context extractie uit user session</p>
        <CodeBlock language="bash">
{`curl http://localhost:3001/api/ai-config/resolve?feature_id=zib_extraction \\
  -H "Authorization: Bearer <jwt-token>"`}
        </CodeBlock>

        <p className="text-sm text-slate-600 mt-3">
          Deze endpoint haalt automatisch user_id, role, specialisme uit de sessie en resolved de config.
        </p>
      </Section>
    </div>
  );
}

function DatabaseSection() {
  return (
    <div className="space-y-6">
      <Section title="Tabellen Overzicht">
        <div className="space-y-3">
          <TableCard 
            name="ai_features"
            description="Feature definities met schemas en default configs"
            columns={['feature_id', 'name', 'description', 'category', 'config_schema', 'default_config', 'is_active']}
          />
          <TableCard 
            name="ai_config_scopes"
            description="Hiërarchische scopes met prioriteiten"
            columns={['scope_type', 'scope_value', 'scope_label', 'priority', 'metadata']}
          />
          <TableCard 
            name="ai_config_assignments"
            description="Config toewijzingen aan scopes"
            columns={['feature_id', 'scope_id', 'config', 'override_mode', 'is_active']}
          />
          <TableCard 
            name="ai_config_usage_logs"
            description="Usage tracking voor analytics"
            columns={['feature_id', 'user_id', 'resolved_from_scope_type', 'resolved_config', 'created_at']}
          />
        </div>
      </Section>

      <Section title="resolve_ai_config() Functie">
        <p className="text-sm text-slate-600 mb-3">
          PostgreSQL functie die config resolved op basis van context en prioriteit
        </p>
        <CodeBlock language="sql">
{`SELECT resolve_ai_config(
  'zib_extraction',              -- feature_id
  'user-uuid',                   -- user_id
  ARRAY['group-uuid-1'],         -- group_ids
  'physician',                   -- role
  'Cardiologie',                 -- specialisme
  'Polikliniek',                 -- werkcontext
  'org-uuid'                     -- organization_id
);`}
        </CodeBlock>
      </Section>
    </div>
  );
}

function TroubleshootingSection() {
  return (
    <div className="space-y-6">
      <Section title="Config wordt niet toegepast">
        <TroubleshootItem 
          problem="Voice Assistant gebruikt nog steeds default ZIBs"
          solutions={[
            "Check dat feature active is: SELECT * FROM ai_features WHERE feature_id = 'zib_extraction'",
            "Check dat assignment active is: SELECT * FROM ai_config_assignments WHERE feature_id = 'zib_extraction'",
            "Verifieer user profile heeft specialisme: SELECT specialisme FROM user_profiles WHERE user_id = 'uuid'",
            "Check console logs: [ExtractionEngine] Resolved config for..."
          ]}
        />
      </Section>

      <Section title="Geen logs in usage table">
        <TroubleshootItem 
          problem="ai_config_usage_logs blijft leeg"
          solutions={[
            "Check RLS policies: SELECT * FROM pg_policies WHERE tablename = 'ai_config_usage_logs'",
            "Verifieer dat extract API daadwerkelijk de config resolution aanroept",
            "Check of er errors zijn in de API response"
          ]}
        />
      </Section>

      <Section title="Permission denied errors">
        <TroubleshootItem 
          problem="Users kunnen geen configs zien/bewerken"
          solutions={[
            "Check of user admin role heeft: SELECT role FROM profiles WHERE id = auth.uid()",
            "Verifieer RLS policies voor ai_config_* tabellen",
            "Normale users kunnen alleen lezen, admins kunnen alles beheren"
          ]}
        />
      </Section>

      <Section title="Rollback Procedure">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-bold text-red-900 mb-3">Als je het systeem volledig wilt uitschakelen:</p>
          <CodeBlock language="sql">
{`-- Optie 1: Disable alle features (zachte rollback)
UPDATE ai_features SET is_active = false;

-- Optie 2: Verwijder alles (harde rollback)
DROP TABLE IF EXISTS ai_config_usage_logs CASCADE;
DROP TABLE IF EXISTS ai_config_assignments CASCADE;
DROP TABLE IF EXISTS ai_config_scopes CASCADE;
DROP TABLE IF EXISTS ai_features CASCADE;
DROP FUNCTION IF EXISTS resolve_ai_config;`}
          </CodeBlock>
        </div>
      </Section>
    </div>
  );
}

// Helper Components

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon size={20} className="text-blue-600" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

function UseCaseItem({ title, description }: any) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </li>
  );
}

function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">
      <pre className="text-sm font-mono whitespace-pre">{children}</pre>
    </div>
  );
}

function PriorityLevel({ level, type, priority, description, color = 'blue' }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 bg-${color}-500 text-white rounded-full flex items-center justify-center text-sm font-bold`}>
        {level}
      </div>
      <div className="flex-1 bg-white rounded-lg p-3 border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900">{type}</span>
            <span className="text-slate-500 text-sm ml-2">(prioriteit {priority})</span>
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>
    </div>
  );
}

function FlowStep({ from, to, description }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2">
        <p className="text-sm font-semibold text-slate-900">{from}</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-slate-400">→</div>
        <p className="text-xs text-slate-500 whitespace-nowrap">{description}</p>
      </div>
      <div className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2">
        <p className="text-sm font-semibold text-slate-900">{to}</p>
      </div>
    </div>
  );
}

function TableCard({ name, description, columns }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Database size={16} className="text-blue-600" />
        <h4 className="font-bold text-slate-900">{name}</h4>
      </div>
      <p className="text-sm text-slate-600 mb-3">{description}</p>
      <div className="flex flex-wrap gap-2">
        {columns.map((col: string) => (
          <code key={col} className="text-xs bg-slate-100 px-2 py-1 rounded">
            {col}
          </code>
        ))}
      </div>
    </div>
  );
}

function TroubleshootItem({ problem, solutions }: any) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <div className="flex items-start gap-2 mb-3">
        <AlertCircle size={18} className="text-yellow-700 mt-0.5 flex-shrink-0" />
        <p className="font-semibold text-yellow-900">{problem}</p>
      </div>
      <ul className="space-y-2 ml-6">
        {solutions.map((solution: string, idx: number) => (
          <li key={idx} className="text-sm text-yellow-800">
            {solution.includes('SELECT') || solution.includes('UPDATE') ? (
              <code className="bg-yellow-100 px-2 py-1 rounded text-xs block mt-1">
                {solution}
              </code>
            ) : (
              `• ${solution}`
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// New helper components for UI-focused docs
function UIActionCard({ step, title, description, details, color = 'blue' }: any) {
  return (
    <div className={`bg-white border-2 border-${color}-200 rounded-xl p-4`}>
      <div className="flex items-start gap-3 mb-2">
        <div className={`flex-shrink-0 w-8 h-8 bg-${color}-500 text-white rounded-full flex items-center justify-center font-bold`}>
          {step}
        </div>
        <div>
          <h5 className="font-bold text-slate-900">{title}</h5>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
      {details && (
        <ul className="mt-3 ml-11 space-y-1">
          {details.map((detail: string, idx: number) => (
            <li key={idx} className="text-sm text-slate-700">{detail}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StepGuide({ step, title, icon, actions }: any) {
  return (
    <div className="border-l-4 border-blue-500 pl-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <span className="text-xs font-bold text-blue-600">STAP {step}</span>
          <h4 className="font-bold text-slate-900">{title}</h4>
        </div>
      </div>
      <ul className="space-y-1.5 mt-3">
        {actions.map((action: string, idx: number) => (
          <li key={idx} className="text-sm text-slate-700 pl-3">
            {action.startsWith('  └') ? (
              <span className="text-slate-600 ml-4">{action}</span>
            ) : (
              <span>{action}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InterfaceCard({ title, description, icon, examples }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600 mb-3">{description}</p>
      <div className="space-y-1">
        {examples.map((ex: string, idx: number) => (
          <div key={idx} className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle size={12} className="text-green-500" />
            {ex}
          </div>
        ))}
      </div>
    </div>
  );
}

function TipCard({ type, title, description }: any) {
  const colors = {
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', icon: 'text-green-600' },
    warning: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', icon: 'text-orange-600' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: 'text-blue-600' }
  };
  const c = colors[type as keyof typeof colors];
  
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-4 flex items-start gap-3`}>
      <CheckCircle size={20} className={`${c.icon} flex-shrink-0 mt-0.5`} />
      <div>
        <p className={`font-bold ${c.text} mb-1`}>{title}</p>
        <p className="text-sm text-slate-700">{description}</p>
      </div>
    </div>
  );
}

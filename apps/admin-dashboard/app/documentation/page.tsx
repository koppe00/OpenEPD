'use client';

import React from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { 
  BookOpen, 
  Brain, 
  FileText,
  ArrowRight,
  CheckCircle,
  Hammer,
  MapPin,
  Layers,
  Stethoscope,
  Heart,
  Server,
  Code,
  Database
} from 'lucide-react';

export default function DocumentationIndexPage() {
  return (
    <div className="flex flex-col h-screen bg-slate-50/50 p-8 overflow-y-auto">
      <AdminHeader 
        title="Documentatie" 
        subtitle="Handleidingen en technische documentatie voor het OpenEPD systeem"
      />

      {/* System Architecture Section */}
      <h2 className="text-lg font-black text-slate-900 mb-4 mt-6">🏗️ Systeem Architectuur</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mb-8">
        <DocumentationCard
          href="/documentation/architecture"
          icon={Layers}
          title="Architecture Overview"
          description="Complete architectuur van het OpenEPD monorepo: apps, packages, infrastructure"
          status="available"
          topics={[
            'Monorepo structuur (Turborepo)',
            '3 Next.js applicaties',
            '6 shared packages',
            'Data flow & security'
          ]}
        />

        <DocumentationCard
          href="/documentation/infrastructure"
          icon={Server}
          title="Infrastructure"
          description="Docker, databases en services configuratie: Supabase, EHRbase, Kafka"
          status="available"
          topics={[
            'Supabase setup & migraties',
            'EHRbase (openEHR) configuratie',
            'Kafka event streaming',
            'Development & production'
          ]}
        />

        <DocumentationCard
          href="/documentation/api-reference"
          icon={Code}
          title="API Reference"
          description="Complete API documentatie voor alle endpoints en integraties"
          status="available"
          topics={[
            'REST API endpoints',
            'Authentication & authorization',
            'ZIB API & Supabase queries',
            'SDK\'s en libraries'
          ]}
        />
      </div>

      {/* Applications Section */}
      <h2 className="text-lg font-black text-slate-900 mb-4">💻 Applicaties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mb-8">
        <DocumentationCard
          href="/documentation/provider-dashboard"
          icon={Stethoscope}
          title="Provider Dashboard"
          description="Zorgverlener applicatie voor patiëntbeheer, documentatie en triage"
          status="available"
          topics={[
            'Patiënt dashboard & widgets',
            'Smart Template Editor',
            'Voice Assistant integratie',
            'AI-powered triage'
          ]}
        />

        <DocumentationCard
          href="/documentation/patient-portal"
          icon={Heart}
          title="Patient Portal"
          description="Patiënt-facing applicatie voor zelfmetingen en dossierinzage"
          status="available"
          topics={[
            'Vitale metingen registreren',
            'Medisch dossier inzien',
            'Afspraken beheren',
            'Privacy & consent'
          ]}
        />

        <DocumentationCard
          href="/documentation/templates"
          icon={FileText}
          title="Smart Template Builder"
          description="Template systeem voor klinische documenten met drag & drop widgets"
          status="available"
          topics={[
            'Visuele template editor',
            'Widget Architect systeem',
            'Database schema & API',
            'Tutorial: Template aanmaken'
          ]}
        />
      </div>

      {/* Clinical & Data Section */}
      <h2 className="text-lg font-black text-slate-900 mb-4">🏥 Klinische Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mb-8">
        <DocumentationCard
          href="/documentation/zibs"
          icon={Database}
          title="ZIB Implementatie"
          description="NICTIZ 2024 Gold Standard ZIB implementatie, schemas en validatie"
          status="available"
          topics={[
            '120+ officiële ZIB types',
            'Validatie en preprocessing',
            'Database schema',
            'Best practices'
          ]}
        />

        <DocumentationCard
          href="/documentation/work-contexts"
          icon={MapPin}
          title="Unified Work Contexts"
          description="Context-gebaseerd template en toegangssysteem voor werkcontexten"
          status="available"
          topics={[
            'Werkcontext & specialisme toewijzing',
            'Template filtering per context',
            'Admin UI context beheer',
            'Database architectuur'
          ]}
        />

        <DocumentationCard
          href="/documentation/ai-config"
          icon={Brain}
          title="AI Configuration"
          description="AI Governance & Configuration systeem met hiërarchische scopes"
          status="available"
          topics={[
            'Hiërarchische configuratie (7 niveaus)',
            'Feature management',
            'Dynamic ZIB extraction',
            'Deployment instructies'
          ]}
        />
      </div>
    </div>
  );
}

interface DocumentationCardProps {
  href: string;
  icon: any;
  title: string;
  description: string;
  status: 'available' | 'coming-soon';
  topics: string[];
}

import { useRef } from 'react';
import html2pdf from 'html2pdf.js';

function DocumentationCard({ href, icon: Icon, title, description, status, topics }: DocumentationCardProps) {
  const isAvailable = status === 'available';
  const cardRef = useRef<HTMLDivElement>(null);


  return (
    <div className="relative group">
      <Link
        href={isAvailable ? href : '#'}
        tabIndex={-1}
        className={
          `block bg-white border-2 rounded-2xl p-6 transition-all duration-200 ` +
          (isAvailable 
            ? 'border-slate-200 hover:border-blue-300 hover:shadow-xl cursor-pointer' 
            : 'border-slate-200 opacity-60 cursor-not-allowed')
        }
        ref={cardRef}
        style={{ pointerEvents: isAvailable ? 'auto' : 'none' }}
      >
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {isAvailable ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-1">
              <CheckCircle size={12} />
              Beschikbaar
            </span>
          ) : (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold flex items-center gap-1">
              <Hammer size={12} />
              Binnenkort
            </span>
          )}
        </div>

        {/* Icon */}
        <div className={
          `p-3 rounded-xl inline-block mb-4 ` +
          (isAvailable 
            ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' 
            : 'bg-slate-100 text-slate-400')
        }>
          <Icon size={28} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-4">{description}</p>

        {/* Topics */}
        <div className="space-y-1.5">
          {topics.map((topic, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <ArrowRight size={14} className={`mt-0.5 flex-shrink-0 ${isAvailable ? 'text-blue-500' : 'text-slate-400'}`} />
              <span className="text-slate-700">{topic}</span>
            </div>
          ))}
        </div>

        {/* Arrow indicator for available docs */}
        {isAvailable && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
            Lees documentatie
            <ArrowRight size={16} />
          </div>
        )}
      </Link>
    </div>
  );
}

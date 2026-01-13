'use client';

import React, { useState, useRef } from 'react';
// Import html2pdf.js for PDF export
import html2pdf from 'html2pdf.js';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { 
  BookOpen, 
  Key,
  Database,
  Users,
  FileText,
  Webhook,
  Code,
  Shield,
  Zap,
  Cloud
} from 'lucide-react';

export default function ApiReferenceDocPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'OpenEPD_API_Reference.pdf',
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
        <h2 className="text-lg font-black text-slate-900 mb-4">API Reference</h2>
        <nav className="space-y-1">
          <NavItem 
            icon={BookOpen} 
            label="Overzicht" 
            active={activeSection === 'overview'}
            onClick={() => setActiveSection('overview')}
          />
          <NavItem 
            icon={Key} 
            label="Authenticatie" 
            active={activeSection === 'auth'}
            onClick={() => setActiveSection('auth')}
          />
          <NavItem 
            icon={Users} 
            label="Patiënten API" 
            active={activeSection === 'patients'}
            onClick={() => setActiveSection('patients')}
          />
          <NavItem 
            icon={FileText} 
            label="ZIB API" 
            active={activeSection === 'zibs'}
            onClick={() => setActiveSection('zibs')}
          />
          <NavItem 
            icon={Database} 
            label="Clinical API" 
            active={activeSection === 'clinical'}
            onClick={() => setActiveSection('clinical')}
          />
          <NavItem 
            icon={Webhook} 
            label="Webhooks" 
            active={activeSection === 'webhooks'}
            onClick={() => setActiveSection('webhooks')}
          />
          <NavItem 
            icon={Code} 
            label="SDK's" 
            active={activeSection === 'sdks'}
            onClick={() => setActiveSection('sdks')}
          />
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between max-w-4xl mb-4">
          <AdminHeader 
            title="API Reference" 
            subtitle="Complete API documentatie voor alle endpoints en integraties"
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
          {activeSection === 'auth' && <AuthSection />}
          {activeSection === 'patients' && <PatientsSection />}
          {activeSection === 'zibs' && <ZibsSection />}
          {activeSection === 'clinical' && <ClinicalSection />}
          {activeSection === 'webhooks' && <WebhooksSection />}
          {activeSection === 'sdks' && <SdksSection />}
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

function EndpointCard({ method, path, description, auth = true }: any) {
  const methodColors: Record<string, string> = {
    GET: 'bg-green-100 text-green-700',
    POST: 'bg-blue-100 text-blue-700',
    PUT: 'bg-yellow-100 text-yellow-700',
    PATCH: 'bg-orange-100 text-orange-700',
    DELETE: 'bg-red-100 text-red-700',
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <code className={`px-2 py-1 rounded text-xs font-bold ${methodColors[method] || 'bg-slate-100'}`}>
          {method}
        </code>
        <code className="text-sm text-slate-900">{path}</code>
        {auth && <Shield size={14} className="text-slate-400 ml-auto" />}
      </div>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <Section title="API Overzicht">
        <p className="text-slate-700 mb-4">
          OpenEPD biedt REST API's voor integratie met externe systemen. 
          Alle API's gebruiken Supabase als backend.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-blue-900 mb-2">🔗 Base URL</h4>
          <code className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">
            https://jlatbisropqmrkilphuz.supabase.co
          </code>
        </div>
      </Section>

      <Section title="API Lagen">
        <CodeBlock title="Architecture">{`
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT APPS                              │
│         (Provider Dashboard, Patient Portal, Admin)              │
└─────────────────────────┬────────────────────────────────────────┘
                          │
┌─────────────────────────┴────────────────────────────────────────┐
│                     NEXT.JS API ROUTES                           │
│                  /api/patients, /api/zibs, etc.                  │
└─────────────────────────┬────────────────────────────────────────┘
                          │
┌─────────────────────────┴────────────────────────────────────────┐
│                     SUPABASE CLIENT                              │
│              @supabase/supabase-js                               │
└─────────────────────────┬────────────────────────────────────────┘
                          │
┌─────────────────────────┴────────────────────────────────────────┐
│                  SUPABASE BACKEND                                │
│    - PostgREST (auto-generated REST API)                        │
│    - Auth (JWT tokens)                                          │
│    - Realtime (WebSocket subscriptions)                          │
│    - Storage (files/images)                                      │
└──────────────────────────────────────────────────────────────────┘
`}</CodeBlock>
      </Section>

      <Section title="Response Format">
        <p className="text-slate-700 mb-4">
          Alle API's retourneren JSON responses met consistente structuur:
        </p>
        
        <CodeBlock title="Success Response">{`{
  "data": [...],
  "count": 10,
  "error": null
}`}</CodeBlock>
        
        <CodeBlock title="Error Response">{`{
  "data": null,
  "error": {
    "code": "PGRST116",
    "message": "No rows found",
    "details": null
  }
}`}</CodeBlock>
      </Section>

      <Section title="Rate Limiting">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-50 p-3 rounded-lg">
            <strong className="text-slate-900">Anon Key</strong>
            <p className="text-slate-600">100 req/min</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <strong className="text-slate-900">Authenticated</strong>
            <p className="text-slate-600">1000 req/min</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <strong className="text-slate-900">Service Role</strong>
            <p className="text-slate-600">Unlimited</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <strong className="text-slate-900">Realtime</strong>
            <p className="text-slate-600">200 connections</p>
          </div>
        </div>
      </Section>
    </div>
  );
}

function AuthSection() {
  return (
    <div className="space-y-6">
      <Section title="Authenticatie">
        <p className="text-slate-700 mb-4">
          OpenEPD gebruikt Supabase Auth met JWT tokens. 
          Alle API calls moeten geauthenticeerd zijn.
        </p>
      </Section>

      <Section title="Auth Flow">
        <CodeBlock title="Login met Email/Password">{`import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'arts@openepd.nl',
  password: 'veiligwachtwoord'
});

// data.session.access_token bevat de JWT
console.log(data.session?.access_token);`}</CodeBlock>
      </Section>

      <Section title="JWT Token Gebruik">
        <CodeBlock title="API Call met Authorization Header">{`// De Supabase client doet dit automatisch
// Voor externe API calls:

const response = await fetch('/api/patients', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
});`}</CodeBlock>
      </Section>

      <Section title="Server-side Auth">
        <CodeBlock title="API Route met getUser()">{`// app/api/patients/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Verify user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    );
  }
  
  // User is authenticated, proceed with request
  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .limit(10);
    
  return NextResponse.json({ data: patients });
}`}</CodeBlock>
      </Section>

      <Section title="Token Refresh">
        <p className="text-slate-700 mb-4">
          De Supabase client refresht tokens automatisch. 
          Access tokens zijn 1 uur geldig.
        </p>
        
        <CodeBlock title="Session Listener">{`// Luister naar auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed:', session?.access_token);
  }
  if (event === 'SIGNED_OUT') {
    // Redirect naar login
    window.location.href = '/login';
  }
});`}</CodeBlock>
      </Section>

      <Section title="API Keys">
        <div className="space-y-3">
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Key size={16} className="text-green-600" />
              <strong className="text-slate-900">anon (public) key</strong>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Veilig voor client-side gebruik. Alleen toegang via RLS policies.
            </p>
            <code className="text-xs bg-slate-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          </div>
          
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-red-600" />
              <strong className="text-red-900">service_role key</strong>
            </div>
            <p className="text-sm text-red-700 mb-2">
              <strong>NOOIT</strong> in client-side code! Bypassed RLS policies.
            </p>
            <code className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code>
          </div>
        </div>
      </Section>
    </div>
  );
}

function PatientsSection() {
  return (
    <div className="space-y-6">
      <Section title="Patiënten API">
        <p className="text-slate-700 mb-4">
          API endpoints voor patiëntbeheer en demografische gegevens.
        </p>
      </Section>

      <Section title="Endpoints">
        <div className="space-y-3">
          <EndpointCard 
            method="GET" 
            path="/api/patients" 
            description="Lijst van patiënten (paginated)"
          />
          <EndpointCard 
            method="GET" 
            path="/api/patients/:id" 
            description="Patiënt details ophalen"
          />
          <EndpointCard 
            method="POST" 
            path="/api/patients" 
            description="Nieuwe patiënt aanmaken"
          />
          <EndpointCard 
            method="PATCH" 
            path="/api/patients/:id" 
            description="Patiënt gegevens bijwerken"
          />
        </div>
      </Section>

      <Section title="Query Parameters">
        <CodeBlock title="GET /api/patients">{`// Pagination
?page=1&limit=20

// Search
?search=janssen

// Filter by status
?status=active

// Sort
?sortBy=name&order=asc

// Full example
/api/patients?page=1&limit=20&search=jan&status=active`}</CodeBlock>
      </Section>

      <Section title="Request/Response">
        <CodeBlock title="GET /api/patients/:id Response">{`{
  "data": {
    "id": "uuid-here",
    "bsn": "123456789",
    "firstName": "Jan",
    "lastName": "Janssen",
    "dateOfBirth": "1980-01-15",
    "gender": "male",
    "email": "jan@example.nl",
    "phone": "+31612345678",
    "address": {
      "street": "Hoofdstraat 1",
      "city": "Amsterdam",
      "postalCode": "1000AA"
    },
    "insurance": {
      "company": "Zilveren Kruis",
      "policyNumber": "ZKZZ123456"
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}`}</CodeBlock>
        
        <CodeBlock title="POST /api/patients Request">{`{
  "bsn": "123456789",
  "firstName": "Jan",
  "lastName": "Janssen",
  "dateOfBirth": "1980-01-15",
  "gender": "male",
  "email": "jan@example.nl",
  "phone": "+31612345678"
}`}</CodeBlock>
      </Section>

      <Section title="Supabase Direct Query">
        <CodeBlock title="Via Supabase Client">{`// Lijst patiënten
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_type', 'patient')
  .range(0, 19);

// Zoek patiënt
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .or('first_name.ilike.%jan%,last_name.ilike.%jan%')
  .eq('user_type', 'patient');

// Met gerelateerde data
const { data, error } = await supabase
  .from('profiles')
  .select(\`
    *,
    zib_compositions (*),
    appointments (*)
  \`)
  .eq('id', patientId)
  .single();`}</CodeBlock>
      </Section>
    </div>
  );
}

function ZibsSection() {
  return (
    <div className="space-y-6">
      <Section title="ZIB API">
        <p className="text-slate-700 mb-4">
          API voor zorginformatiebouwstenen (ZIBs) - klinische data volgens NICTIZ standaarden.
        </p>
      </Section>

      <Section title="Endpoints">
        <div className="space-y-3">
          <EndpointCard 
            method="GET" 
            path="/api/patients/:id/zibs" 
            description="Alle ZIBs voor een patiënt"
          />
          <EndpointCard 
            method="GET" 
            path="/api/patients/:id/zibs/:zibType" 
            description="Specifieke ZIB type (bijv. bloeddruk)"
          />
          <EndpointCard 
            method="POST" 
            path="/api/patients/:id/zibs" 
            description="Nieuwe ZIB meting opslaan"
          />
          <EndpointCard 
            method="GET" 
            path="/api/zib-config" 
            description="ZIB configuratie metadata"
            auth={false}
          />
        </div>
      </Section>

      <Section title="ZIB Types">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <code className="bg-slate-50 p-2 rounded">BloodPressure</code>
          <code className="bg-slate-50 p-2 rounded">BodyWeight</code>
          <code className="bg-slate-50 p-2 rounded">BodyHeight</code>
          <code className="bg-slate-50 p-2 rounded">BodyTemperature</code>
          <code className="bg-slate-50 p-2 rounded">HeartRate</code>
          <code className="bg-slate-50 p-2 rounded">O2Saturation</code>
          <code className="bg-slate-50 p-2 rounded">GlucoseLevel</code>
          <code className="bg-slate-50 p-2 rounded">Medication</code>
          <code className="bg-slate-50 p-2 rounded">AllergyIntolerance</code>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Zie <code>/api/zib-config</code> voor complete lijst van 120+ ZIBs
        </p>
      </Section>

      <Section title="Request/Response">
        <CodeBlock title="GET /api/patients/:id/zibs/BloodPressure">{`{
  "data": [
    {
      "id": "uuid-here",
      "patientId": "patient-uuid",
      "zibType": "BloodPressure",
      "data": {
        "systolic": {
          "value": 120,
          "unit": "mmHg"
        },
        "diastolic": {
          "value": 80,
          "unit": "mmHg"
        },
        "position": "sitting",
        "cuffType": "standard"
      },
      "measurementDateTime": "2024-01-15T10:30:00Z",
      "source": "patient_reported",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}`}</CodeBlock>
        
        <CodeBlock title="POST /api/patients/:id/zibs Request">{`{
  "zibType": "BloodPressure",
  "data": {
    "systolic": {
      "value": 125,
      "unit": "mmHg"
    },
    "diastolic": {
      "value": 82,
      "unit": "mmHg"
    },
    "position": "sitting"
  },
  "measurementDateTime": "2024-01-15T14:00:00Z"
}`}</CodeBlock>
      </Section>

      <Section title="Supabase Direct Query">
        <CodeBlock title="Via Supabase Client">{`// Alle ZIBs voor patiënt
const { data, error } = await supabase
  .from('zib_compositions')
  .select('*')
  .eq('patient_id', patientId)
  .order('measurement_date_time', { ascending: false });

// Specifieke ZIB type, laatste 10
const { data, error } = await supabase
  .from('zib_compositions')
  .select('*')
  .eq('patient_id', patientId)
  .eq('zib_type', 'BloodPressure')
  .order('measurement_date_time', { ascending: false })
  .limit(10);

// Realtime subscription
supabase
  .channel('zib-changes')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'zib_compositions',
    filter: \`patient_id=eq.\${patientId}\`
  }, (payload) => {
    console.log('New ZIB:', payload.new);
  })
  .subscribe();`}</CodeBlock>
      </Section>
    </div>
  );
}

function ClinicalSection() {
  return (
    <div className="space-y-6">
      <Section title="Clinical API">
        <p className="text-slate-700 mb-4">
          API endpoints voor klinische workflows: verwijzingen, orders, en documentatie.
        </p>
      </Section>

      <Section title="Referrals (Verwijzingen)">
        <div className="space-y-3 mb-4">
          <EndpointCard 
            method="GET" 
            path="/api/referrals" 
            description="Inkomende verwijzingen lijst"
          />
          <EndpointCard 
            method="GET" 
            path="/api/referrals/:id" 
            description="Verwijzing details"
          />
          <EndpointCard 
            method="POST" 
            path="/api/referrals" 
            description="Nieuwe verwijzing aanmaken"
          />
          <EndpointCard 
            method="PATCH" 
            path="/api/referrals/:id" 
            description="Verwijzing status updaten"
          />
        </div>
        
        <CodeBlock title="Verwijzing Object">{`{
  "id": "uuid",
  "patientId": "patient-uuid",
  "referredBy": {
    "name": "Dr. Huisarts",
    "agbCode": "12345678",
    "organization": "Huisartsenpraktijk Centrum"
  },
  "specialty": "cardiologie",
  "urgency": "routine",
  "reason": "Palpitaties, ECG afwijkend",
  "status": "pending",
  "attachments": [
    {
      "name": "ECG_20240115.pdf",
      "url": "https://..."
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z"
}`}</CodeBlock>
      </Section>

      <Section title="Orders">
        <div className="space-y-3 mb-4">
          <EndpointCard 
            method="GET" 
            path="/api/orders" 
            description="Orders lijst (lab, imaging)"
          />
          <EndpointCard 
            method="POST" 
            path="/api/orders" 
            description="Nieuwe order plaatsen"
          />
          <EndpointCard 
            method="GET" 
            path="/api/orders/:id/results" 
            description="Order resultaten"
          />
        </div>
        
        <CodeBlock title="Order Types">{`// Lab order
{
  "type": "lab",
  "patientId": "uuid",
  "tests": ["bloedbeeld", "glucose", "hba1c"],
  "priority": "routine",
  "clinicalInfo": "Diabetes controle"
}

// Imaging order
{
  "type": "imaging",
  "patientId": "uuid",
  "study": "X-thorax",
  "priority": "STAT",
  "clinicalInfo": "Dyspnoe, hoesten"
}`}</CodeBlock>
      </Section>

      <Section title="Triage">
        <div className="space-y-3 mb-4">
          <EndpointCard 
            method="POST" 
            path="/api/triage/analyze" 
            description="AI triage analyse uitvoeren"
          />
          <EndpointCard 
            method="GET" 
            path="/api/triage/:patientId" 
            description="Triage geschiedenis"
          />
        </div>
        
        <CodeBlock title="Triage Request/Response">{`// Request
POST /api/triage/analyze
{
  "patientId": "uuid",
  "symptoms": "Pijn op de borst, uitstralend naar linkerarm",
  "duration": "30 minuten",
  "severity": 8
}

// Response
{
  "urgency": "U1",
  "category": "cardiaal",
  "recommendation": "Onmiddellijke evaluatie, overweeg ACS",
  "suggestedActions": [
    "ECG afnemen",
    "Troponine bepalen",
    "Cardioloog consulteren"
  ],
  "confidence": 0.92
}`}</CodeBlock>
      </Section>
    </div>
  );
}

function WebhooksSection() {
  return (
    <div className="space-y-6">
      <Section title="Webhooks">
        <p className="text-slate-700 mb-4">
          Ontvang real-time notificaties voor events in OpenEPD.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-yellow-900 mb-2">🚧 In Development</h4>
          <p className="text-sm text-yellow-800">
            Webhook configuratie is nog in ontwikkeling. 
            Gebruik voorlopig Supabase Realtime voor live updates.
          </p>
        </div>
      </Section>

      <Section title="Beschikbare Events">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <code className="font-mono text-sm">patient.created</code>
            <span className="text-xs text-slate-500">Nieuwe patiënt geregistreerd</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <code className="font-mono text-sm">zib.created</code>
            <span className="text-xs text-slate-500">Nieuwe ZIB meting</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <code className="font-mono text-sm">referral.received</code>
            <span className="text-xs text-slate-500">Inkomende verwijzing</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <code className="font-mono text-sm">order.completed</code>
            <span className="text-xs text-slate-500">Order resultaten beschikbaar</span>
          </div>
        </div>
      </Section>

      <Section title="Supabase Realtime (Alternatief)">
        <CodeBlock title="Realtime Subscriptions">{`// Subscribe to new referrals
const channel = supabase
  .channel('referrals')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'referrals'
  }, (payload) => {
    console.log('New referral:', payload.new);
    // Trigger notification, update UI, etc.
  })
  .subscribe();

// Subscribe to ZIB updates for specific patient
const patientChannel = supabase
  .channel(\`patient-\${patientId}\`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'zib_compositions',
    filter: \`patient_id=eq.\${patientId}\`
  }, (payload) => {
    console.log('ZIB change:', payload.eventType, payload.new);
  })
  .subscribe();

// Cleanup
channel.unsubscribe();`}</CodeBlock>
      </Section>
    </div>
  );
}

function SdksSection() {
  return (
    <div className="space-y-6">
      <Section title="SDK's en Libraries">
        <p className="text-slate-700 mb-4">
          OpenEPD biedt packages voor eenvoudige integratie.
        </p>
      </Section>

      <Section title="@openepd/clinical-core">
        <p className="text-slate-700 mb-4">
          Kernbibliotheek met ZIB configuraties en types.
        </p>
        
        <CodeBlock title="Installatie">{`pnpm add @openepd/clinical-core`}</CodeBlock>
        
        <CodeBlock title="Gebruik">{`import { 
  ZIB_CONFIG, 
  getZibLabel, 
  getZibFields,
  validateZibData 
} from '@openepd/clinical-core';

// ZIB metadata
const bpConfig = ZIB_CONFIG['BloodPressure'];
console.log(bpConfig.label); // "Bloeddruk"
console.log(bpConfig.fields); // Field definitions

// Label ophalen
const label = getZibLabel('BloodPressure'); // "Bloeddruk"

// Velden ophalen
const fields = getZibFields('BloodPressure');
// [{ key: 'systolic', label: 'Systolisch', ... }, ...]

// Validatie
const result = validateZibData('BloodPressure', {
  systolic: { value: 120, unit: 'mmHg' },
  diastolic: { value: 80, unit: 'mmHg' }
});
// { valid: true, errors: [] }`}</CodeBlock>
      </Section>

      <Section title="Supabase Client Setup">
        <CodeBlock title="lib/supabase.ts">{`import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server-side client
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}`}</CodeBlock>
      </Section>

      <Section title="Type Definitions">
        <CodeBlock title="types/index.ts">{`// Auto-generated from Supabase schema
import { Database } from '@openepd/clinical-core/types';

export type Patient = Database['public']['Tables']['profiles']['Row'];
export type ZibComposition = Database['public']['Tables']['zib_compositions']['Row'];
export type Referral = Database['public']['Tables']['referrals']['Row'];

// Helper types
export type ZibType = 
  | 'BloodPressure' 
  | 'BodyWeight' 
  | 'BodyTemperature'
  | 'HeartRate'
  | 'GlucoseLevel';

export interface ZibData<T extends ZibType> {
  zibType: T;
  data: ZibDataMap[T];
  measurementDateTime: string;
}`}</CodeBlock>
      </Section>

      <Section title="Externe Integraties">
        <div className="space-y-3">
          <div className="border border-slate-200 rounded-lg p-4">
            <strong className="text-slate-900">FHIR R4</strong>
            <p className="text-sm text-slate-600 mt-1">
              Export naar FHIR formaat via <code>/api/fhir/Patient/:id</code>
            </p>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded mt-2 inline-block">Roadmap</span>
          </div>
          <div className="border border-slate-200 rounded-lg p-4">
            <strong className="text-slate-900">HL7v2</strong>
            <p className="text-sm text-slate-600 mt-1">
              ADT/ORU berichten via Kafka integration
            </p>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded mt-2 inline-block">Roadmap</span>
          </div>
          <div className="border border-slate-200 rounded-lg p-4">
            <strong className="text-slate-900">openEHR</strong>
            <p className="text-sm text-slate-600 mt-1">
              Direct query via EHRbase AQL endpoint
            </p>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded mt-2 inline-block">Beschikbaar</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

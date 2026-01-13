'use client';

import React, { useState, useRef } from 'react';
// Import html2pdf.js for PDF export
import html2pdf from 'html2pdf.js';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { 
  BookOpen, 
  Server,
  Database,
  MessageSquare,
  Container,
  Cloud,
  Terminal,
  Settings,
  Shield,
  Network
} from 'lucide-react';

export default function InfrastructureDocPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'OpenEPD_Infrastructure.pdf',
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
        <h2 className="text-lg font-black text-slate-900 mb-4">Infrastructure</h2>
        <nav className="space-y-1">
          <NavItem 
            icon={BookOpen} 
            label="Overzicht" 
            active={activeSection === 'overview'}
            onClick={() => setActiveSection('overview')}
          />
          <NavItem 
            icon={Cloud} 
            label="Supabase" 
            active={activeSection === 'supabase'}
            onClick={() => setActiveSection('supabase')}
          />
          <NavItem 
            icon={Database} 
            label="EHRbase" 
            active={activeSection === 'ehrbase'}
            onClick={() => setActiveSection('ehrbase')}
          />
          <NavItem 
            icon={MessageSquare} 
            label="Kafka" 
            active={activeSection === 'kafka'}
            onClick={() => setActiveSection('kafka')}
          />
          <NavItem 
            icon={Container} 
            label="Docker" 
            active={activeSection === 'docker'}
            onClick={() => setActiveSection('docker')}
          />
          <NavItem 
            icon={Terminal} 
            label="Development" 
            active={activeSection === 'development'}
            onClick={() => setActiveSection('development')}
          />
          <NavItem 
            icon={Shield} 
            label="Production" 
            active={activeSection === 'production'}
            onClick={() => setActiveSection('production')}
          />
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between max-w-4xl mb-4">
          <AdminHeader 
            title="Infrastructure Documentatie" 
            subtitle="Docker, databases en services configuratie"
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
          {activeSection === 'supabase' && <SupabaseSection />}
          {activeSection === 'ehrbase' && <EhrbaseSection />}
          {activeSection === 'kafka' && <KafkaSection />}
          {activeSection === 'docker' && <DockerSection />}
          {activeSection === 'development' && <DevelopmentSection />}
          {activeSection === 'production' && <ProductionSection />}
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

function ServiceCard({ name, port, status, description }: any) {
  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <strong className="text-slate-900">{name}</strong>
        <div className="flex items-center gap-2">
          {port && <code className="text-xs bg-slate-100 px-2 py-1 rounded">{port}</code>}
          <span className={`w-2 h-2 rounded-full ${status === 'cloud' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
        </div>
      </div>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <Section title="Infrastructure Overzicht">
        <p className="text-slate-700 mb-4">
          OpenEPD draait op een combinatie van cloud services (Supabase) en 
          lokale Docker containers voor development.
        </p>
        
        <CodeBlock title="Services Architecture">{`
┌─────────────────────────────────────────────────────────────────────┐
│                    OPENEPD INFRASTRUCTURE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   CLOUD SERVICES                      LOCAL DOCKER                  │
│   ══════════════                      ════════════                  │
│                                                                      │
│   ┌─────────────────┐                ┌─────────────────┐            │
│   │   Supabase      │                │    EHRbase      │            │
│   │   (Hosted)      │                │    :8080        │            │
│   │                 │                │                 │            │
│   │ - PostgreSQL    │                │ - openEHR CDR   │            │
│   │ - Auth          │                │ - REST API      │            │
│   │ - Realtime      │                │                 │            │
│   │ - Storage       │                └────────┬────────┘            │
│   │ - Edge Funcs    │                         │                     │
│   └────────┬────────┘                ┌────────┴────────┐            │
│            │                         │    PostgreSQL   │            │
│            │                         │    :5432        │            │
│            │                         └─────────────────┘            │
│            │                                                        │
│            │                         ┌─────────────────┐            │
│            │                         │     Kafka       │            │
│            │                         │     :9092       │            │
│            │                         │                 │            │
│            │                         │ - Message Bus   │            │
│            │                         │ - Event Stream  │            │
│            │                         └────────┬────────┘            │
│            │                                  │                     │
│            │                         ┌────────┴────────┐            │
│            │                         │   Zookeeper     │            │
│            │                         │     :2181       │            │
│            │                         └─────────────────┘            │
│            │                                                        │
└────────────┴────────────────────────────────────────────────────────┘
`}</CodeBlock>
      </Section>

      <Section title="Services">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ServiceCard 
            name="Supabase"
            port="Cloud"
            status="cloud"
            description="Primary database, auth, realtime subscriptions"
          />
          <ServiceCard 
            name="EHRbase"
            port=":8080"
            status="docker"
            description="openEHR Clinical Data Repository"
          />
          <ServiceCard 
            name="Kafka"
            port=":9092"
            status="docker"
            description="Event streaming, async processing"
          />
          <ServiceCard 
            name="Zookeeper"
            port=":2181"
            status="docker"
            description="Kafka cluster coordination"
          />
        </div>
      </Section>

      <Section title="Quick Start">
        <CodeBlock title="Start all services">{`# 1. Start Supabase (cloud - geen actie nodig)

# 2. Start EHRbase
cd infrastructure/ehrbase
docker-compose up -d

# 3. Start Kafka
cd infrastructure/kafka
docker-compose up -d

# 4. Start applications
pnpm dev`}</CodeBlock>
      </Section>
    </div>
  );
}

function SupabaseSection() {
  return (
    <div className="space-y-6">
      <Section title="Supabase">
        <p className="text-slate-700 mb-4">
          Supabase is de primaire backend voor OpenEPD. Het biedt PostgreSQL database, 
          authenticatie, realtime subscriptions en file storage in één managed service.
        </p>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-green-900 mb-2">☁️ Cloud Hosted</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>Project:</strong> jlatbisropqmrkilphuz</li>
            <li>• <strong>Region:</strong> eu-central-1 (Frankfurt)</li>
            <li>• <strong>Dashboard:</strong> supabase.com/dashboard</li>
          </ul>
        </div>
      </Section>

      <Section title="Environment Variables">
        <CodeBlock title=".env.local">{`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://jlatbisropqmrkilphuz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (alleen server-side)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</CodeBlock>
        
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <h4 className="font-bold text-red-900 mb-2">⚠️ Security Warning</h4>
          <p className="text-sm text-red-800">
            Service Role Key heeft volledige database toegang en bypassed RLS. 
            <strong> Nooit in client-side code gebruiken!</strong>
          </p>
        </div>
      </Section>

      <Section title="Database Migraties">
        <p className="text-slate-700 mb-4">
          Migraties worden beheerd in <code className="bg-slate-100 px-1 rounded">services/supabase/supabase/migrations/</code>
        </p>
        
        <CodeBlock title="Huidige Migraties">{`services/supabase/supabase/migrations/
├── 010_unify_work_contexts.sql    # Unified work contexts system
├── 011_user_onboarding.sql        # Auto-assign contexts trigger
└── 012_fix_user_active_contexts_fk.sql  # FK fix`}</CodeBlock>

        <h4 className="font-bold text-slate-900 mt-4 mb-2">Migratie Uitvoeren:</h4>
        <CodeBlock title="Via SQL Editor">{`# 1. Open Supabase Dashboard
# 2. Ga naar SQL Editor
# 3. Kopieer migratie SQL
# 4. Voer uit`}</CodeBlock>
      </Section>

      <Section title="Belangrijke Tabellen">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-slate-50 p-2 rounded font-mono">profiles</div>
          <div className="bg-slate-50 p-2 rounded font-mono">zib_compositions</div>
          <div className="bg-slate-50 p-2 rounded font-mono">work_contexts</div>
          <div className="bg-slate-50 p-2 rounded font-mono">specialisms</div>
          <div className="bg-slate-50 p-2 rounded font-mono">ui_templates</div>
          <div className="bg-slate-50 p-2 rounded font-mono">user_active_contexts</div>
          <div className="bg-slate-50 p-2 rounded font-mono">ai_config_scopes</div>
          <div className="bg-slate-50 p-2 rounded font-mono">referrals</div>
        </div>
      </Section>

      <Section title="Row Level Security">
        <p className="text-slate-700 mb-4">
          RLS policies zorgen dat gebruikers alleen hun eigen data kunnen zien.
        </p>
        
        <CodeBlock title="RLS Policy Voorbeeld">{`-- Gebruikers kunnen alleen eigen profiel zien
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Zorgverleners kunnen patiënten zien met behandelrelatie
CREATE POLICY "Caregivers view patients" ON zib_compositions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM care_relationships cr
      WHERE cr.caregiver_user_id = auth.uid()
        AND cr.patient_user_id = zib_compositions.patient_id
    )
  );`}</CodeBlock>
      </Section>
    </div>
  );
}

function EhrbaseSection() {
  return (
    <div className="space-y-6">
      <Section title="EHRbase (openEHR)">
        <p className="text-slate-700 mb-4">
          EHRbase is een open-source openEHR Clinical Data Repository. 
          Het slaat klinische data op volgens openEHR archetypes voor maximale interoperabiliteit.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-blue-900 mb-2">🐳 Docker Container</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Image:</strong> ehrbase/ehrbase:next</li>
            <li>• <strong>Port:</strong> 8080</li>
            <li>• <strong>Database:</strong> PostgreSQL 15</li>
          </ul>
        </div>
      </Section>

      <Section title="Docker Compose">
        <CodeBlock title="infrastructure/ehrbase/docker-compose.yml">{`version: "3.8"
services:
  ehrdb:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: ehrbase
      POSTGRES_USER: ehrbase
      POSTGRES_DB: ehrbase
      LANG: en_US.utf8
      LC_COLLATE: en_US.utf8
    ports:
      - "5432:5432"
    volumes:
      - ./init-db:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ehrbase"]
      interval: 5s
      timeout: 5s
      retries: 5

  ehrbase:
    image: ehrbase/ehrbase:next
    environment:
      DB_URL: jdbc:postgresql://ehrdb:5432/ehrbase
      DB_USER: ehrbase
      DB_PASSWORD: ehrbase
      SERVER_NODENAME: local.ehrbase.org
      SECURITY_AUTH_USER: admin
      SECURITY_AUTH_PASSWORD: password
    ports:
      - "8080:8080"
    depends_on:
      ehrdb:
        condition: service_healthy`}</CodeBlock>
      </Section>

      <Section title="Starten & Stoppen">
        <CodeBlock title="Commands">{`# Start EHRbase
cd infrastructure/ehrbase
docker-compose up -d

# Check status
docker-compose ps

# Logs bekijken
docker-compose logs -f ehrbase

# Stoppen
docker-compose down

# Stoppen + data verwijderen
docker-compose down -v`}</CodeBlock>
      </Section>

      <Section title="API Endpoints">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
            <code className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">GET</code>
            <code>/ehrbase/rest/openehr/v1/definition/template</code>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
            <code className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">POST</code>
            <code>/ehrbase/rest/openehr/v1/ehr</code>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
            <code className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">POST</code>
            <code>/ehrbase/rest/openehr/v1/composition</code>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
            <code className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">GET</code>
            <code>/ehrbase/rest/openehr/v1/query/aql</code>
          </div>
        </div>
        
        <h4 className="font-bold text-slate-900 mt-4 mb-2">Test Connection:</h4>
        <CodeBlock title="curl">{`curl -u admin:password http://localhost:8080/ehrbase/rest/openehr/v1/definition/template`}</CodeBlock>
      </Section>
    </div>
  );
}

function KafkaSection() {
  return (
    <div className="space-y-6">
      <Section title="Apache Kafka">
        <p className="text-slate-700 mb-4">
          Kafka is de message bus voor event-driven architectuur. 
          Het ondersteunt async processing en service-to-service communicatie.
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-purple-900 mb-2">🐳 Docker Container</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• <strong>Image:</strong> confluentinc/cp-kafka:7.4.0</li>
            <li>• <strong>Kafka Port:</strong> 9092</li>
            <li>• <strong>Zookeeper Port:</strong> 2181</li>
          </ul>
        </div>
      </Section>

      <Section title="Docker Compose">
        <CodeBlock title="infrastructure/kafka/docker-compose.yml">{`version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.4.0
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"`}</CodeBlock>
      </Section>

      <Section title="Starten & Stoppen">
        <CodeBlock title="Commands">{`# Start Kafka
cd infrastructure/kafka
docker-compose up -d

# Check status
docker-compose ps

# Logs bekijken
docker-compose logs -f kafka

# Stoppen
docker-compose down`}</CodeBlock>
      </Section>

      <Section title="Topics">
        <p className="text-slate-700 mb-4">
          Kafka topics voor OpenEPD event streams:
        </p>
        
        <div className="space-y-2">
          <div className="border border-slate-200 rounded-lg p-3">
            <code className="font-bold text-slate-900">order-created</code>
            <p className="text-xs text-slate-600 mt-1">
              Nieuwe orders (lab, imaging, medicatie)
            </p>
          </div>
          <div className="border border-slate-200 rounded-lg p-3">
            <code className="font-bold text-slate-900">referral-received</code>
            <p className="text-xs text-slate-600 mt-1">
              Inkomende verwijzingen van externe systemen
            </p>
          </div>
          <div className="border border-slate-200 rounded-lg p-3">
            <code className="font-bold text-slate-900">zib-updated</code>
            <p className="text-xs text-slate-600 mt-1">
              Klinische data wijzigingen (voor CQRS projections)
            </p>
          </div>
        </div>
      </Section>

      <Section title="Producer/Consumer Example">
        <CodeBlock title="packages/workflow-engine/src/runner.ts">{`import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'workflow-engine',
  brokers: ['localhost:9092']
});

// Producer
const producer = kafka.producer();
await producer.connect();
await producer.send({
  topic: 'order-created',
  messages: [{
    key: orderId,
    value: JSON.stringify({
      orderId,
      patientId,
      type: 'ECG',
      priority: 'STAT',
      timestamp: new Date().toISOString()
    })
  }]
});

// Consumer
const consumer = kafka.consumer({ groupId: 'projection-service' });
await consumer.connect();
await consumer.subscribe({ topic: 'order-created' });
await consumer.run({
  eachMessage: async ({ topic, message }) => {
    const order = JSON.parse(message.value.toString());
    console.log('Order received:', order);
  }
});`}</CodeBlock>
      </Section>
    </div>
  );
}

function DockerSection() {
  return (
    <div className="space-y-6">
      <Section title="Docker Overzicht">
        <p className="text-slate-700 mb-4">
          OpenEPD gebruikt Docker voor lokale development services. 
          De Next.js apps draaien direct met Node.js voor snellere hot-reload.
        </p>
      </Section>

      <Section title="Containers">
        <CodeBlock title="Alle containers starten">{`# EHRbase + PostgreSQL
cd infrastructure/ehrbase && docker-compose up -d

# Kafka + Zookeeper
cd infrastructure/kafka && docker-compose up -d

# Check alle containers
docker ps`}</CodeBlock>
      </Section>

      <Section title="Veelgebruikte Commands">
        <CodeBlock title="Docker Commands">{`# Alle containers bekijken
docker ps -a

# Container logs
docker logs <container_id> -f

# Container shell
docker exec -it <container_id> /bin/bash

# PostgreSQL shell (EHRbase)
docker exec -it ehrbase-ehrdb-1 psql -U ehrbase

# Stop alle containers
docker stop $(docker ps -q)

# Verwijder alle stopped containers
docker container prune

# Disk usage
docker system df

# Cleanup ongebruikte images
docker image prune -a`}</CodeBlock>
      </Section>

      <Section title="Troubleshooting">
        <div className="space-y-3">
          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-3 rounded-r">
            <strong className="text-yellow-900">Port conflict</strong>
            <p className="text-sm text-yellow-700 mt-1">
              <code>docker-compose down</code> en check <code>lsof -i :5432</code>
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-3 rounded-r">
            <strong className="text-yellow-900">EHRbase start niet</strong>
            <p className="text-sm text-yellow-700 mt-1">
              Check <code>docker-compose logs ehrbase</code> voor database connection errors
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-3 rounded-r">
            <strong className="text-yellow-900">Kafka consumer hangt</strong>
            <p className="text-sm text-yellow-700 mt-1">
              Restart Kafka: <code>docker-compose restart kafka</code>
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

function DevelopmentSection() {
  return (
    <div className="space-y-6">
      <Section title="Development Setup">
        <p className="text-slate-700 mb-4">
          Complete setup voor lokale development omgeving.
        </p>
      </Section>

      <Section title="Prerequisites">
        <ul className="text-sm text-slate-700 space-y-2">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <strong>Node.js 18+</strong> - JavaScript runtime
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <strong>pnpm 8+</strong> - Package manager
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <strong>Docker Desktop</strong> - Container runtime
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <strong>VS Code</strong> - Recommended IDE
          </li>
        </ul>
      </Section>

      <Section title="Initial Setup">
        <CodeBlock title="Setup Commands">{`# 1. Clone repository
git clone https://github.com/your-org/OpenEPD.git
cd OpenEPD

# 2. Install dependencies
pnpm install

# 3. Setup environment files
cp apps/provider-dashboard/.env.example apps/provider-dashboard/.env.local
cp apps/admin-dashboard/.env.example apps/admin-dashboard/.env.local
cp apps/patient-portal/.env.example apps/patient-portal/.env.local

# 4. Start Docker services
cd infrastructure/ehrbase && docker-compose up -d
cd ../kafka && docker-compose up -d

# 5. Start development servers
cd ../..
pnpm dev`}</CodeBlock>
      </Section>

      <Section title="Development Ports">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="font-bold text-slate-900">:3000</code>
            <p className="text-xs text-slate-600 mt-1">Provider Dashboard</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="font-bold text-slate-900">:3001</code>
            <p className="text-xs text-slate-600 mt-1">Patient Portal</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="font-bold text-slate-900">:3002</code>
            <p className="text-xs text-slate-600 mt-1">Admin Dashboard</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="font-bold text-slate-900">:8080</code>
            <p className="text-xs text-slate-600 mt-1">EHRbase</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="font-bold text-slate-900">:5432</code>
            <p className="text-xs text-slate-600 mt-1">PostgreSQL (EHRbase)</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <code className="font-bold text-slate-900">:9092</code>
            <p className="text-xs text-slate-600 mt-1">Kafka</p>
          </div>
        </div>
      </Section>

      <Section title="VS Code Extensions">
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• ESLint - Linting</li>
          <li>• Prettier - Code formatting</li>
          <li>• Tailwind CSS IntelliSense - CSS autocomplete</li>
          <li>• Docker - Container management</li>
          <li>• GitLens - Git integration</li>
          <li>• Supabase - Database tools</li>
        </ul>
      </Section>
    </div>
  );
}

function ProductionSection() {
  return (
    <div className="space-y-6">
      <Section title="Production Deployment">
        <p className="text-slate-700 mb-4">
          Richtlijnen voor productie deployment van OpenEPD.
        </p>
        
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <h4 className="font-bold text-orange-900 mb-2">⚠️ Work in Progress</h4>
          <p className="text-sm text-orange-800">
            OpenEPD is momenteel in actieve ontwikkeling. 
            Productie deployment vereist extra security hardening en compliance review.
          </p>
        </div>
      </Section>

      <Section title="Deployment Opties">
        <div className="space-y-3">
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cloud size={16} className="text-blue-600" />
              <strong className="text-slate-900">Vercel + Supabase (Recommended)</strong>
            </div>
            <p className="text-sm text-slate-600">
              Next.js apps op Vercel, database op Supabase Cloud. 
              Snelste setup, managed infrastructure.
            </p>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Container size={16} className="text-purple-600" />
              <strong className="text-slate-900">Kubernetes</strong>
            </div>
            <p className="text-sm text-slate-600">
              Volledige controle, self-hosted. Geschikt voor ziekenhuizen 
              met eigen datacenter.
            </p>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Server size={16} className="text-green-600" />
              <strong className="text-slate-900">VPS + Docker</strong>
            </div>
            <p className="text-sm text-slate-600">
              Single server deployment met Docker Compose. 
              Eenvoudig te beheren.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Security Checklist">
        <ul className="text-sm text-slate-700 space-y-2">
          <li className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" readOnly />
            <span>HTTPS/TLS certificaten</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" readOnly />
            <span>Environment variables in secrets manager</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" readOnly />
            <span>Row Level Security policies getest</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" readOnly />
            <span>Audit logging enabled</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" readOnly />
            <span>Backup strategie geconfigureerd</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" readOnly />
            <span>NEN 7510 gap analysis</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" readOnly />
            <span>Penetration test uitgevoerd</span>
          </li>
        </ul>
      </Section>

      <Section title="Environment Variables">
        <CodeBlock title="Production .env">{`# Supabase (use production project)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # Store in secrets manager!

# AI Keys (encrypted/secrets manager)
VOICE_ASSISTANT_GEMINI_KEY=...

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://app.openepd.nl`}</CodeBlock>
      </Section>
    </div>
  );
}

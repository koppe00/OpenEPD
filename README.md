# OpenEPD - Open-Source Elektronisch Patiëntendossier

**🚀 Status: MVP met volledige database setup en reproduceerbare demo**

Dit project bevat nu:
- ✅ Werkende multi-persona applicatie (Provider Dashboard + Patient Portal)
- ✅ Volledige Supabase database schema met seed data
- ✅ Geanonimiseerde testgebruikers voor demo doeleinden
- ✅ Gedetailleerde deployment instructies
- ✅ Agentic AI-layer voor klinische ondersteuning
- ✅ Data sovereignty simulatie met vault sync service
- ✅ Uitgebreide admin documentatie portaal

## Introductie

Dit project beoogt een open-source Elektronisch Patiëntendossier (EPD) te ontwikkelen dat de patiënt centraal stelt en de monopoliepositie van grote leveranciers in de gezondheidszorg uitdaagt. Het EPD is ontworpen om transparantie, interoperabiliteit en patiëntcontrole over hun eigen medische gegevens te bevorderen. Dit project is een oproep aan ontwikkelaars, zorgprofessionals en patiënten om samen te werken aan een toekomst waar gezondheidszorg toegankelijker, veiliger en meer op de patiënt gericht is.

### Doelstellingen

Het creëren van een patiëntgericht EPD waarbij patiënten eigenaar zijn van hun medische gegevens en kunnen kiezen waar deze worden opgeslagen.
Het bevorderen van interoperabiliteit door gebruik te maken van open standaarden zoals FHIR en MedMij, waardoor gegevensuitwisseling tussen verschillende zorginstellingen mogelijk is.
Het stimuleren van innovatie door een open-source model waarbij een gemeenschap van ontwikkelaars kan bijdragen.
Het realiseren van kostenreductie door het minimaliseren van licentiekosten en het bevorderen van open samenwerking.
Het waarborgen van veiligheid en privacy door middel van transparante beveiligingsmaatregelen die door de gemeenschap kunnen worden beoordeeld en verbeterd.
Het maximaal ondersteunen van zorgverleners in het verlenen van zorg met behulp van hedendaagse technieken zoals AI.

### Kernconcepten

**Data Eigenaarschap**: Patiënten hebben volledige controle over de opslaglocatie van hun eigen gegevens, met opties zoals een persoonlijke NAS, cloudopslag of een server van een zorginstelling. Zorgverleners hebben eveneens controle over de opslag van hun eigen data.

**Interoperabiliteit**: Het systeem maakt gebruik van standaarden zoals FHIR en MedMij om gegevens uitwisselbaar te maken.

**Beveiliging en Privacy**: Gegevens worden altijd encrypted opgeslagen en overgedragen. Er wordt gebruik gemaakt van blockchain of een ander gedecentraliseerd systeem voor het beheer van toestemmingen en audit trails.

**Gebruikerservaring**: Een intuïtief portaal waar patiënten hun opslag kunnen kiezen, beheren en toestemmingen verlenen. Automatische real-time synchronisatie van gegevens.

### Functionaliteiten

Het EPD zal onder andere de volgende functionaliteiten bevatten:

Patiëntbeheer: Registratie, identificatie en beheer van medische dossiers.
Klinische zorg: Ondersteuning voor consultatie, diagnose, behandelplannen, medicatiebeheer, opname en ontslag.
Operatieve zorg: Pre-operatieve voorbereiding, operatieverslaglegging en postoperatieve zorg.
Administratie en werkstroombeheer: Afspraakbeheer, bedbeheer, operatiekamerplanning, facturering en rapportage.
Communicatie en samenwerking: Interne communicatie tussen zorgteams, patiëntcommunicatie en interoperabiliteit met andere zorginstellingen.
Ondersteunende diensten: Onderhoud, updates, ondersteuning, training, documentatie en API's.
Innovatieve technologieën: Gebruik van AI, Machine Learning, IoT en Natuurlijke Taalverwerking.

## 📦 Installation & Setup

Voor een volledige lokale development setup, volg de gedetailleerde instructies in [`DEPLOYMENT_STEPS.md`](DEPLOYMENT_STEPS.md).

### Snelle start (voor ervaren gebruikers):

1. **Repository klonen & dependencies installeren:**
   ```bash
   git clone <repo-url>
   cd OpenEPD
   pnpm install
   ```

2. **Omgevingsvariabelen instellen:**
   ```bash
   cp .env.local.voorbeeld .env.local
   # Bewerk .env.local met je Supabase credentials
   ```

3. **Supabase database opzetten:**
   - Maak een nieuw Supabase project aan
   - Importeer `supabase/migrations/20260113_schema.sql` via SQL Editor
   - Importeer `supabase/seeds/20260113_seed.sql` voor testdata
   - Maak testgebruikers aan via Authentication > Users:
     - `testuser@openepd.nl` (wachtwoord: `TestPass123!`) - Admin gebruiker
     - Andere test emails met zelfde wachtwoord

4. **Applicatie starten:**
   ```bash
   pnpm dev
   ```

5. **Login testen:**
   - Ga naar localhost:3000
   - Login met `testuser@openepd.nl` / `TestPass123!`

### Database delen & reproduceerbaarheid

Dit project bevat volledige database schema's en seed data voor reproduceerbare setups:
- **`supabase/migrations/20260113_schema.sql`**: Complete database structuur
- **`supabase/seeds/20260113_seed.sql`**: Geanonimiseerde testdata met gebruikers, rollen, specialismen en UI-templates
- **`.env.local.voorbeeld`**: Template voor omgevingsvariabelen (nooit committen!)

## 🛠 Hoe de demo te draaien

Start de frontend: `pnpm dev`

Start de Vault Sync Service in een aparte terminal:
```bash
npx tsx ./packages/vault-sync-service.ts
```

Voer een meting in op localhost:3000 en kijk hoe de status real-time verspringt van "Syncing" naar "Stored in Local Vault".

## 📚 Belangrijkste Features & Componenten

Dit project bevat nu:
- ✅ Werkende multi-persona applicatie (Provider Dashboard + Patient Portal)
- ✅ Volledige Supabase database schema met seed data
- ✅ Geanonimiseerde testgebruikers voor demo doeleinden
- ✅ Gedetailleerde deployment instructies
- ✅ Agentic AI-layer voor klinische ondersteuning
- ✅ Data sovereignty simulatie met vault sync service
- ✅ Uitgebreide admin documentatie portaal

### 🏗️ Systeem Architectuur
- **Monorepo Setup**: Turborepo met 3 Next.js apps en 6 shared packages
- **Database**: Supabase met PostgreSQL, inclusief volledige schema en seed data
- **Infrastructure**: Docker containers voor EHRbase (openEHR) en Kafka event streaming
- **API Layer**: Complete REST API met authentication, ZIB integraties en real-time updates

### 💻 Applicaties
- **Provider Dashboard**: Klinische interface voor zorgverleners met patiënt dashboard, Smart Template Editor, Voice Assistant integratie, en AI-powered triage
- **Patient Portal**: Patiënt-facing app voor zelfmetingen en dossierinzage
- **Admin Dashboard**: Beheerportaal met uitgebreide documentatie sectie

### 🏥 Klinische Functionaliteiten
- **ZIB Implementatie**: 120+ officiële NICTIZ 2024 Gold Standard ZIB types
- **Smart Templates**: Visuele template builder met drag & drop widgets
- **Work Contexts**: Context-gebaseerd systeem (Polikliniek, Kliniek, SEH, IC, etc.)
- **AI Configuration**: Hiërarchische AI governance met 7 configuratie niveaus
- **Unified Data Model**: Centrale database die alle applicaties voedt

### 🤖 AI & Intelligent Features
- **Agentic Layer**: AI-agent die klinische invoer onderschept en context genereert
- **Dynamic ZIB Extraction**: Automatische extractie van gestructureerde medische data
- **Clinical Decision Support**: Real-time waarschuwingen en inzichten
- **Voice Assistant**: Spraakgestuurde klinische documentatie

### 🔒 Data Sovereignty & Security
- **Vault Sync Service**: Simulatie van lokale data opslag bij patiënt
- **Encryption**: End-to-end encryptie voor medische data
- **Consent Management**: Patiënt controle over data delen
- **Audit Trails**: Complete logging van alle data operaties

## 🎯 Doelstellingen & Visie

Dit project beoogt een patiëntgericht EPD te ontwikkelen waarbij:
- **Data Eigenaarschap**: Patiënten eigenaar zijn van hun medische gegevens
- **Interoperabiliteit**: Gebruik van open standaarden zoals FHIR en MedMij
- **Innovatie**: Open-source model voor gemeenschap bij te dragen
- **Kostenreductie**: Minimaliseren van licentiekosten
- **Veiligheid**: Transparante beveiligingsmaatregelen door gemeenschap
- **AI Ondersteuning**: Maximaliseren van zorgverlening met hedendaagse technieken

## 🏛️ Architectuur

Het systeem is opgebouwd uit de volgende lagen:
- **Applicatielaag**: Frontend (gebruikersinterfaces) en Backend (API Gateway en microservices)
- **Datalaag**: Data services (Data Gateway, Consent Management Service, Encryptie)
- **Opslaglaag**: Patiëntgekozen opslag (NAS, cloudservices) en zorginstelling keuze

## 📋 Release Notes

### Versie 2.3: Van MVP naar Context-Aware EPD
- Dynamic Template Switching en Context-Aware Care Settings
- Administratie & Logistiek module met Referral Inbox
- Klinische Deep-Dive met Smart Template Editor v2
- Visual Template Builder in Admin Portaal

### Versie 2.2: Dutch Connectors & Local Bridge
- Vertical Slice (Read Model) gerealiseerd
- Multi-Persona Architectuur met Provider Dashboard en Patient Portal
- CQRS Implementatie voor data-verwerking en -consumptie

## 🤝 Bijdragen & Community

Dit project groeit dankzij bijdragers uit de zorg en tech gemeenschap. Huidige focusgebieden:
- **Database & Backend**: Uitbreiding van het schema met nieuwe medische entiteiten
- **Frontend Components**: Meer specialisme-specifieke widgets en templates
- **AI & Machine Learning**: Verbetering van klinische besluitondersteuning
- **Interoperabiliteit**: FHIR/MedMij integraties
- **Testing & Documentation**: Meer test coverage en gebruikershandleidingen

### Voor nieuwe bijdragers:
1. Volg de [`DEPLOYMENT_STEPS.md`](DEPLOYMENT_STEPS.md) voor lokale setup
2. Bekijk openstaande Issues voor taken
3. Start met kleine verbeteringen of bugfixes
4. Test je changes met de seed data gebruikers

**Persoonlijke noot:** Dit is mijn eerste open source project. Hulp bij het opzetten en aanpakken van dit project is van harte welkom!

## 📖 Meer Informatie

- **Conceptueel Ontwerp**: [Google Docs](https://docs.google.com/document/d/15OIgRELi9W2JiKSvtPuIYkrDO_uVW-5yt_5gboskDFY/edit?usp=drivesdk)
- **Functionele Onderdelen**: [Google Docs](https://docs.google.com/document/d/1jHxhrscqeIHNaKtjN7-xYYRcE04447KPPdBOw3F999I/edit?usp=drivesdk)

## 📄 Licentie

Dit project is gelicenseerd onder GNU General Public License versie 3 (GPL V3). Zie het LICENSE bestand voor meer details.


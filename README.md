Project: Open-Source Elektronisch Patiëntendossier (EPD)

--

Introductie: Dit project beoogt een open-source Elektronisch Patiëntendossier (EPD) te ontwikkelen dat de patiënt centraal stelt en de monopoliepositie van grote leveranciers in de gezondheidszorg uitdaagt. Het EPD is ontworpen om transparantie, interoperabiliteit en patiëntcontrole over hun eigen medische gegevens te bevorderen. Dit project is een oproep aan ontwikkelaars, zorgprofessionals en patiënten om samen te werken aan een toekomst waar gezondheidszorg toegankelijker, veiliger en meer op de patiënt gericht is.

Doelstellingen:

Het creëren van een patiëntgericht EPD waarbij patiënten eigenaar zijn van hun medische gegevens en kunnen kiezen waar deze worden opgeslagen.
Het bevorderen van interoperabiliteit door gebruik te maken van open standaarden zoals FHIR en MedMij, waardoor gegevensuitwisseling tussen verschillende zorginstellingen mogelijk is.
Het stimuleren van innovatie door een open-source model waarbij een gemeenschap van ontwikkelaars kan bijdragen.
Het realiseren van kostenreductie door het minimaliseren van licentiekosten en het bevorderen van open samenwerking.
Het waarborgen van veiligheid en privacy door middel van transparante beveiligingsmaatregelen die door de gemeenschap kunnen worden beoordeeld en verbeterd.
Het maximaal ondersteunen van zorgverleners in het verlenen van zorg met behulp van hedendaagse technieken zoals AI.
Kernconcepten:

Data Eigenaarschap: Patiënten hebben volledige controle over de opslaglocatie van hun eigen gegevens, met opties zoals een persoonlijke NAS, cloudopslag of een server van een zorginstelling. Zorgverleners hebben eveneens controle over de opslag van hun eigen data.
Interoperabiliteit: Het systeem maakt gebruik van standaarden zoals FHIR en MedMij om gegevens uitwisselbaar te maken.
Beveiliging en Privacy: Gegevens worden altijd encrypted opgeslagen en overgedragen. Er wordt gebruik gemaakt van blockchain of een ander gedecentraliseerd systeem voor het beheer van toestemmingen en audit trails.
Gebruikerservaring: Een intuïtief portaal waar patiënten hun opslag kunnen kiezen, beheren en toestemmingen verlenen. Automatische real-time synchronisatie van gegevens.
Functionaliteiten: Het EPD zal onder andere de volgende functionaliteiten bevatten:

Patiëntbeheer: Registratie, identificatie en beheer van medische dossiers.
Klinische zorg: Ondersteuning voor consultatie, diagnose, behandelplannen, medicatiebeheer, opname en ontslag.
Operatieve zorg: Pre-operatieve voorbereiding, operatieverslaglegging en postoperatieve zorg.
Administratie en werkstroombeheer: Afspraakbeheer, bedbeheer, operatiekamerplanning, facturering en rapportage.
Communicatie en samenwerking: Interne communicatie tussen zorgteams, patiëntcommunicatie en interoperabiliteit met andere zorginstellingen.
Ondersteunende diensten: Onderhoud, updates, ondersteuning, training, documentatie en API’s.
Innovatieve technologieën: Gebruik van AI, Machine Learning, IoT en Natuurlijke Taalverwerking.
Architectuur: Het systeem is opgebouwd uit de volgende lagen:

Applicatielaag: Frontend (gebruikersinterfaces voor patiënten en zorgverleners) en Backend (API Gateway en microservices).
Datalaag: Data services (Data Gateway, Consent Management Service, Encryptie en Decryptie Service).
Opslaglaag: Patiëntgekozen opslag (NAS, cloudservices of zorginstelling server) en Zorginstelling keuze voor opslag.
Hoe bijdragen: We nodigen ontwikkelaars, zorgprofessionals en patiënten uit om bij te dragen aan dit project. [nog in opstart:] Kijk op de "Issues" pagina voor openstaande taken, dien pull requests in met verbeteringen, of start een discussie op het forum. Richtlijnen voor bijdragen zijn te vinden in het CONTRIBUTING.md bestand.

Persoonlijke noot: Dit is mijn eerste open source project. Hulp bij het opzetten en aanpakken van dit project is van harte welkom!

Licentie: Dit project is gelicenseerd onder GNU General Public License versie 3 (GPL V3). Zie het LICENSE bestand voor meer details.

meer informatie: Uigebreid conceptueel ontwerp: https://docs.google.com/document/d/15OIgRELi9W2JiKSvtPuIYkrDO_uVW-5yt_5gboskDFY/edit?usp=drivesdk Functionele onderdelen voor een open-source Elektronisch Patiëntendossier (EPD) https://docs.google.com/document/d/1jHxhrscqeIHNaKtjN7-xYYRcE04447KPPdBOw3F999I/edit?usp=drivesdk

--
Versie 2.3 Release Notes: Van MVP naar Context-Aware EPD:

1. Architectuur & Workflow (Core)
Dynamic Template Switching: Implementatie van een LayoutTemplate selector in de header. Gebruikers kunnen nu realtime wisselen tussen verschillende dashboard-inrichtingen (bijv. 'Standaard Poli' vs 'Vasculair Risico').

Context-Aware Care Settings: Het systeem herkent nu drie hoofdomgevingen: Poli (Polyclinic), Kliniek (Clinical) en Administratie & Logistiek (Admin).

Real-time Data Sync: Verbeterde onDataChange triggers in alle widgets, waardoor invoer in de 'Smart Editor' direct reflecteert in trendlijsten en de AI-copilot zonder pagina-refresh.

2. Administratie & Logistiek (Nieuwe Module)
Instroom-beheer: Introductie van de Referral Inbox, een werklijst voor inkomende verwijzingen (simulatie van ZorgDomein/Edifact).

Patiëntregistratie & Inschrijving: Voorbereiding voor de inschrijf-wizard om de 'Front-Office' flow uit het functioneel ontwerp te ondersteunen.

Wachtkamer & Planning: Implementatie van de Appointment Scheduler, inclusief status-tracking van patiënten (Gepland, In Wachtkamer, In Consult).

3. Klinische Deep-Dive (Specialismen)
Internisten-Layouts: Specifieke SQL-injecties voor de vakgroep Interne Geneeskunde, inclusief layouts voor metabole consulten en klinische visites.

Smart Template Editor v2: Geoptimaliseerde hybride editor die narratieve verslaglegging (Anamnese/Decursus) combineert met gestructureerde ZIB-data velden.

Zib History Table: Verbeterde weergave van historische metingen met dynamische kolom-detectie op basis van ZIB-content.

4. Beheer & Configuratie (Admin Portaal)
Visual Template Builder: Volledige UI voor het ontwerpen van dashboards.

ZibSorter Component: Nieuwe interactieve component voor beheerders om de volgorde van ZIB-velden binnen een widget te bepalen via 'Up/Down' controls.

Template Management: Functionaliteit toegevoegd voor het bewerken van template-namen, omschrijvingen en specialisme-koppelingen.

5. Code Quality & Bugfixes (Technical Debt)
Strict Typing: Fixes voor TypeScript errors rondom ExtendedWorkflowMode en UseDashboardLayoutProps.

React Optimization: Oplossen van 'cascading renders' in de useDashboardLayout hook door asynchrone state-updates te groeperen.

Lucide-React Update: Integratie van nieuwe iconen voor betere visuele herkenbaarheid van administratieve vs. klinische widgets.


--
Architectuur versie 2.2 - Inclusief Dutch Connectors & Local Bridge
Status:

🚀 Mijlpaal: Vertical Slice (Read Model) Gerealiseerd
De technische fundering van OpenEPD staat. We hebben een end-to-end "Vertical Slice" opgeleverd die de kern van de architectuur bewijst.

Belangrijkste resultaten:

Single Source of Truth: Eén centrale database (Supabase) voedt real-time meerdere frontends; wijzigingen zijn direct overal zichtbaar.

Multi-Persona Architectuur:

Provider Dashboard: Een efficiënte, klinische interface voor de zorgverlener.

Patient Portal: Een laagdrempelige, persoonlijke interface voor de patiënt.

CQRS Implementatie: Succesvolle scheiding tussen data-verwerking (Projection Service) en data-consumptie (Read Models).

Tech Stack: Stabiele monorepo setup met Turborepo, Next.js 16 (App Router), Tailwind CSS en Supabase.

🚀 Mijlpaal: he Agentic & Sovereign Data Loop
In deze fase hebben we de kernbelofte van OpenEPD bewezen: Medische intelligentie gecombineerd met data-soevereiniteit.

🧠 The Brain (Agentic Layer)
Wanneer een zorgverlener data invoert in het provider-dashboard, wordt deze niet passief opgeslagen.

Bestand: apps/provider-dashboard/app/page.tsx

Werking: Een AI-agent onderschept de invoer en genereert direct een agent_note.

Resultaat: De arts krijgt direct klinische context (bijv. waarschuwingen bij hypertensie) in plaats van alleen ruwe cijfers.

🔒 The Storage Bridge (Data Sovereignty)
OpenEPD gebruikt de cloud slechts als transitstation. De patiënt is de uiteindelijke eigenaar van de data.

Bestand: packages/vault-sync-service.ts

Werking: Een gesimuleerde Local Gateway monitort de cloud op nieuwe records met de status sync_pending.

Proces:

Data landt in de cloud (sync_pending).

De Vault Service "eist de data op", simuleert lokale encryptie en verplaatst de status naar local_vault_only.

De database wordt bijgewerkt met een uniek local_vault_id, wat bewijst dat de data nu in de persoonlijke kluis van de patiënt staat.

🛠 Hoe de demo te draaien
Start de frontend: pnpm dev

Start de Vault Sync Service in een aparte terminal:

Bash

npx tsx ./packages/vault-sync-service.ts
Voer een meting in op localhost:3000 en kijk hoe de status real-time verspringt van "Syncing" naar "Stored in Local Vault".


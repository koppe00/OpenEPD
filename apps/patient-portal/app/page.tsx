// apps/patient-portal/app/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import {
  Shield,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  Search,
  UserCircle,
  HeartPulse,
  Activity,
  Stethoscope,
  Pill,
  Accessibility,
  FileText,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

// === 1. ZIB TABEL CONFIGURATIE (De kolommen) ===
const ZIB_TABLE_CONFIG: Record<string, { key: string; label: string; transform?: (val: any) => string }[]> = {
  // METINGEN
  'nl.zorg.Bloeddruk': [
    { key: 'systolic', label: 'Bovendruk', transform: (v) => `${v} mmHg` },
    { key: 'diastolic', label: 'Onderdruk', transform: (v) => `${v} mmHg` },
    { key: 'position', label: 'Houding' },
    { key: 'recorded_by', label: 'Door' }
  ],
  'nl.zorg.Lichaamsgewicht': [
    { key: 'weight', label: 'Gewicht', transform: (v) => `${v} kg` },
    { key: 'clothing_status', label: 'Kleding' },
    { key: 'recorded_by', label: 'Door' }
  ],
  'nl.zorg.Polsfrequentie': [
    { key: 'value', label: 'Hartslag', transform: (v) => `${v} bpm` },
    { key: 'regularity', label: 'Regelmaat' },
    { key: 'recorded_by', label: 'Door' }
  ],
  'nl.zorg.Lichaamstemperatuur': [
    { key: 'value', label: 'Temp', transform: (v) => `${v} °C` },
    { key: 'measurement_location', label: 'Locatie' }
  ],

  // KLINISCHE CONTEXT (Diagnoses & Problemen)
  'nl.zorg.AandoeningOfGesteldheid': [
    { key: 'problem_name', label: 'Aandoening / Diagnose' },
    { key: 'clinical_status', label: 'Status', transform: (v) => v === 'Active' ? 'Actief' : (v === 'Resolved' ? 'Genezen' : v) },
    { key: 'onset_date', label: 'Startdatum', transform: (v) => v ? format(new Date(v), 'dd-MM-yyyy') : '-' },
    { key: 'verification_status', label: 'Zekerheid', transform: (v) => v === 'Confirmed' ? 'Bevestigd' : v }
  ],
  'nl.zorg.Alert': [
    { key: 'alert_name', label: 'Waarschuwing' },
    { key: 'start_date', label: 'Datum', transform: (v) => v ? format(new Date(v), 'dd-MM-yyyy') : '-' }
  ],
  'nl.zorg.AllergieIntolerantie': [
    { key: 'causative_agent', label: 'Oorzaak / Stof' },
    { key: 'criticality', label: 'Ernst' },
    { key: 'reaction_description', label: 'Reactie' },
    { key: 'clinical_status', label: 'Status' }
  ],

  // MEDICATIE
  'nl.zorg.Medicatieafspraak': [
    { key: 'product_name', label: 'Medicijn' },
    { key: 'dosage', label: 'Dosering' },
    { key: 'reason', label: 'Reden gebruik' },
    { key: 'start_date', label: 'Startdatum', transform: (v) => v ? format(new Date(v), 'dd-MM-yyyy') : '-' }
  ],
  'nl.zorg.MedicatieGebruik2': [
    { key: 'product_name', label: 'Medicijn' },
    { key: 'usage_description', label: 'Omschrijving gebruik' },
    { key: 'prescriber', label: 'Voorgeschreven door' }
  ],

  // BEHANDELING
  'nl.zorg.Verrichting': [
    { key: 'procedure_name', label: 'Ingreep' },
    { key: 'location', label: 'Locatie' },
    { key: 'performer', label: 'Uitgevoerd door' },
    { key: 'status', label: 'Status' }
  ],
  'nl.zorg.Behandeldoel': [
    { key: 'goal_description', label: 'Doelomschrijving' },
    { key: 'target_date', label: 'Streefdatum', transform: (v) => v ? format(new Date(v), 'dd-MM-yyyy') : '-' },
    { key: 'progress', label: 'Voortgang' }
  ],

  // VERSLAGEN
  'nl.zorg.ContactVerslag': [
    { key: 'contact_type', label: 'Type Contact' },
    { key: 'author', label: 'Auteur' },
    { key: 'summary', label: 'Samenvatting' }
  ]
};

// === 2. LEESBARE LABELS (Vertaling van ZIB ID naar Mensentaal) ===
const ZIB_LABELS: Record<string, string> = {
  'nl.zorg.Patient': 'Basisgegevens',
  'nl.zorg.Bloeddruk': 'Bloeddruk',
  'nl.zorg.Lichaamsgewicht': 'Gewicht',
  'nl.zorg.Medicatieafspraak': 'Medicijn Afspraak',
  'nl.zorg.LaboratoriumUitslag': 'Labuitslag',
  'nl.zorg.AandoeningOfGesteldheid': 'Diagnose',
  'nl.zorg.Verrichting': 'Ingreep',
  'nl.zorg.AllergieIntolerantie': 'Allergie',
  'nl.zorg.Alert': 'Waarschuwing',
  'nl.zorg.Behandeldoel': 'Behandeldoel'
};

// === 3. DE NAVIGATIE STRUCTUUR (Types en Data) ===
interface NavigationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  subsections: {
    title: string;
    zibs: string[];
  }[];
}

const NAVIGATION_STRUCTURE: NavigationCategory[] = [
  {
    id: 'MIJN_GEGEVENS',
    title: 'Mijn Gegevens',
    description: 'Persoonlijke informatie en contacten',
    icon: UserCircle,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    subsections: [
      { title: 'Persoonlijke Info', zibs: ['nl.zorg.Patient', 'nl.zorg.Naamgegevens', 'nl.zorg.Adresgegevens', 'nl.zorg.BurgerlijkeStaat', 'nl.zorg.Nationaliteit', 'nl.zorg.Levensovertuiging'] },
      { title: 'Familie & Omgeving', zibs: ['nl.zorg.Contactpersoon', 'nl.zorg.Gezinssituatie', 'nl.zorg.GezinssituatieKind', 'nl.zorg.Woonsituatie', 'nl.zorg.HulpVanAnderen'] },
      { title: 'Levensstijl', zibs: ['nl.zorg.AlcoholGebruik', 'nl.zorg.TabakGebruik', 'nl.zorg.DrugsGebruik', 'nl.zorg.Opleiding', 'nl.zorg.ParticipatieInMaatschappij', 'nl.zorg.Taalvaardigheid'] },
      { title: 'Juridisch', zibs: ['nl.zorg.Wilsverklaring', 'nl.zorg.JuridischeSituatie'] },
      { title: 'Zorgcontacten', zibs: ['nl.zorg.Zorgverlener', 'nl.zorg.Zorgaanbieder', 'nl.zorg.ZorgTeam', 'nl.zorg.Betaler', 'nl.zorg.Contact'] }
    ]
  },
  {
    id: 'MIJN_GEZONDHEID',
    title: 'Mijn Gezondheid',
    description: 'Diagnoses, allergieën en problemen',
    icon: HeartPulse,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    subsections: [
      { title: 'Aandoeningen & Diagnoses', zibs: ['nl.zorg.AandoeningOfGesteldheid', 'nl.zorg.Diagnose', 'nl.zorg.VerpleegkundigeDiagnose', 'nl.zorg.Zwangerschap', 'nl.zorg.OntwikkelingKind', 'nl.zorg.Familieanamnese'] },
      { title: 'Symptomen & Klachten', zibs: ['nl.zorg.Symptoom', 'nl.zorg.Ziektebeleving', 'nl.zorg.Klachtbeleving', 'nl.zorg.Pijnkenmerken', 'nl.zorg.Reactie'] },
      { title: 'Allergieën & Alerts', zibs: ['nl.zorg.OvergevoeligheidIntolerantie', 'nl.zorg.Alert', 'nl.zorg.Signalering', 'nl.zorg.Uitsluiting'] },
      { title: 'Lichaamsfuncties', zibs: ['nl.zorg.FunctieHoren', 'nl.zorg.FunctieZien', 'nl.zorg.Blaasfunctie', 'nl.zorg.Darmfunctie', 'nl.zorg.FunctioneleOfMentaleStatus', 'nl.zorg.Huidaandoening'] },
      { title: 'Wonden & Hulpmiddelen', zibs: ['nl.zorg.Wond', 'nl.zorg.DecubitusWond', 'nl.zorg.Brandwond', 'nl.zorg.Infuus', 'nl.zorg.SondeSysteem', 'nl.zorg.Stoma', 'nl.zorg.MedischHulpmiddel'] },
      { title: 'Medische Verslagen', zibs: ['nl.zorg.Anamnese', 'nl.zorg.LichamelijkOnderzoek', 'nl.zorg.Evaluatie'] }
    ]
  },
  {
    id: 'MIJN_METINGEN',
    title: 'Mijn Metingen',
    description: 'Meetwaarden, labuitslagen en scores',
    icon: Activity,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    subsections: [
      { title: 'Vitale Waarden', zibs: ['nl.zorg.Ademhaling', 'nl.zorg.O2Saturatie', 'nl.zorg.Bloeddruk', 'nl.zorg.Lichaamsgewicht', 'nl.zorg.Lichaamslengte', 'nl.zorg.Lichaamstemperatuur', 'nl.zorg.Schedelomvang', 'nl.zorg.Polsfrequentie', 'nl.zorg.Hartfrequentie', 'nl.zorg.Vochtbalans'] },
      { title: 'Zintuigen & Metingen', zibs: ['nl.zorg.Visus', 'nl.zorg.Refractie', 'nl.zorg.DAS'] },
      { title: 'Lab & Testen', zibs: ['nl.zorg.LaboratoriumUitslag', 'nl.zorg.TekstUitslag'] },
      { title: 'Scorelijsten', zibs: ['nl.zorg.ApgarScore', 'nl.zorg.DOSScore', 'nl.zorg.BarthelIndex', 'nl.zorg.GlasgowComaScale', 'nl.zorg.MUSTScore', 'nl.zorg.TNMTumorClassificatie', 'nl.zorg.StrongKidsScore'] }
    ]
  },
  {
    id: 'MIJN_BEHANDELINGEN',
    title: 'Mijn Behandelingen',
    description: 'Ingrepen, afspraken en doelen',
    icon: Stethoscope,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    subsections: [
      { title: 'Behandelingen', zibs: ['nl.zorg.Verrichting', 'nl.zorg.VerpleegkundigeInterventie', 'nl.zorg.VrijheidsbeperkendeInterventie', 'nl.zorg.BehandelAanwijzing2'] },
      { title: 'Doelen & Uitkomsten', zibs: ['nl.zorg.Behandeldoel', 'nl.zorg.UitkomstVanZorg'] },
      { title: 'Afspraken & Episodes', zibs: ['nl.zorg.ZorgAfspraak', 'nl.zorg.ZorgEpisode', 'nl.zorg.BewakingBesluit', 'nl.zorg.Patientbespreking', 'nl.zorg.Opname', 'nl.zorg.ContactVerslag', 'nl.zorg.SOEPVerslag'] },
      { title: 'Voeding & Preventie', zibs: ['nl.zorg.Vaccinatie', 'nl.zorg.Voedingsadvies', 'nl.zorg.VoedingspatroonZuigeling'] },
      { title: 'Procesgegevens', zibs: ['nl.zorg.AanvraagGegevens', 'nl.zorg.AfnameGegevens', 'nl.zorg.RegistratieGegevens', 'nl.zorg.Beleid'] }
    ]
  },
  {
    id: 'MIJN_MEDICIJNEN',
    title: 'Mijn Medicijnen',
    description: 'Medicatiegebruik en voorschriften',
    icon: Pill,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    subsections: [
      { title: 'Afspraken & Gebruik', zibs: ['nl.zorg.Medicatieafspraak', 'nl.zorg.MedicatieGebruik2', 'nl.zorg.Toedieningsafspraak', 'nl.zorg.GebruiksInstructie'] },
      { title: 'Verstrekkingen', zibs: ['nl.zorg.Medicatieverstrekking', 'nl.zorg.Verstrekkingsverzoek', 'nl.zorg.MedicatieToediening2'] },
      { title: 'Schema', zibs: ['nl.zorg.TijdsInterval'] }
    ]
  },
  {
    id: 'MIJN_ZELFZORG',
    title: 'Mijn Zelfzorg',
    description: 'Wat ik zelf kan en doe',
    icon: Accessibility,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    subsections: [
      { title: 'Beweging', zibs: ['nl.zorg.Mobiliteit'] },
      { title: 'Persoonlijke Hygiëne', zibs: ['nl.zorg.VermogenTotZichWassen', 'nl.zorg.VermogenTotZichKleden', 'nl.zorg.VermogenTotUiterlijkeVerzorging', 'nl.zorg.VermogenTotMondverzorging', 'nl.zorg.VermogenTotToiletgang'] },
      { title: 'Eten & Drinken', zibs: ['nl.zorg.VermogenTotEten', 'nl.zorg.VermogenTotDrinken'] },
      { title: 'Vaardigheden', zibs: ['nl.zorg.VermogenTotZelfstandigMedicatiegebruik', 'nl.zorg.VermogenTotVerpleegtechnischeHandelingen'] }
    ]
  },
  {
    id: 'MIJN_VERSLAGEN',
    title: 'Mijn Verslagen',
    description: 'Dossiernotities en brieven',
    icon: FileText,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    subsections: [
      { title: 'Volledige Verslagen', zibs: ['nl.zorg.Decursus', 'nl.zorg.ContactVerslag', 'nl.zorg.SOEPVerslag'] },
      { title: 'Evaluaties', zibs: ['nl.zorg.Evaluatie'] }
    ]
  }
];

interface ZibComposition {
  id: string;
  zib_id: string;
  content: Record<string, any>;
  recorded_at: string;
  storage_status: string;
}

export default function PatientPortal() {
  const [zibs, setZibs] = useState<ZibComposition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State voor open/dicht klappen
  const [openMainCategories, setOpenMainCategories] = useState<Set<string>>(new Set(['MIJN_METINGEN']));
  const [openZibs, setOpenZibs] = useState<Set<string>>(new Set());

  const supabase = useMemo(
    () => createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase
        .from('zib_compositions')
        .select('id, zib_id, content, recorded_at, storage_status')
        .order('recorded_at', { ascending: false });

      if (data) setZibs(data as ZibComposition[]);
      setLoading(false);
    };
    init();
  }, [supabase]);

  // === DATA MAPPING ===
  // We indexeren de opgehaalde ZIBs op ZIB-ID voor snelle lookup
  const zibsMap = useMemo(() => {
    const map: Record<string, ZibComposition[]> = {};
    zibs.forEach(zib => {
      if (!map[zib.zib_id]) map[zib.zib_id] = [];
      map[zib.zib_id].push(zib);
    });
    return map;
  }, [zibs]);

  // Functie om leesbare naam te krijgen
  const getReadableName = (zibId: string) => {
    if (ZIB_LABELS[zibId]) return ZIB_LABELS[zibId];
    return zibId.replace('nl.zorg.', '').replaceAll('.', ' ').replace(/([A-Z])/g, ' $1').trim();
  };

  const toggleMainCategory = (id: string) => {
    const next = new Set(openMainCategories);
    if (next.has(id)) next.delete(id); else next.add(id);
    setOpenMainCategories(next);
  };

  const toggleZib = (uniqueKey: string) => {
    const next = new Set(openZibs);
    if (next.has(uniqueKey)) next.delete(uniqueKey); else next.add(uniqueKey);
    setOpenZibs(next);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
       <p className="text-slate-400 font-medium animate-pulse">Uw dossier wordt opgehaald...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b p-6 sticky top-0 z-50 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-slate-900 p-2.5 rounded-2xl text-white shadow-lg">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none">MyEPD</h1>
            <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Persoonlijke Omgeving</span>
          </div>
        </div>

        {/* Zoekbalk */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Zoek op meting, medicijn of verslag..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all text-sm font-medium outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={() => supabase.auth.signOut()} className="hidden md:block bg-slate-50 p-3 rounded-2xl hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition">
          <LogOut size={20} />
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 mt-4">
        
        {/* Render de Navigatie Structuur */}
        {NAVIGATION_STRUCTURE.map(category => {
          // Check of er uberhaupt data is in deze hele hoofdcategorie (rekening houdend met zoekterm)
          const hasData = category.subsections.some(sub => 
            sub.zibs.some(zibId => {
              const items = zibsMap[zibId];
              if (!items) return false;
              // Filter op zoekterm
              if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const name = getReadableName(zibId).toLowerCase();
                return name.includes(term);
              }
              return true;
            })
          );

          if (!hasData) return null;

          const Icon = category.icon;
          const isOpen = openMainCategories.has(category.id);

          return (
            <div key={category.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
              
              {/* Hoofd Categorie Header */}
              <button 
                onClick={() => toggleMainCategory(category.id)}
                className="w-full px-6 py-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-2xl ${category.bg} ${category.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-slate-800">{category.title}</h2>
                    <p className="text-xs text-slate-400 font-medium">{category.description}</p>
                  </div>
                </div>
                <div className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? 'bg-slate-100 rotate-180' : ''}`}>
                  <ChevronDown size={20} className="text-slate-400" />
                </div>
              </button>

              {/* Subsecties */}
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/30 px-6 py-2 pb-8 animate-in slide-in-from-top-2 fade-in duration-200">
                  
                  {category.subsections.map(subsection => {
                    // Filter de ZIBs voor deze subsectie
                    const visibleZibs = subsection.zibs.filter(zibId => {
                       const items = zibsMap[zibId];
                       if (!items) return false;
                       if (searchTerm) return getReadableName(zibId).toLowerCase().includes(searchTerm.toLowerCase());
                       return true;
                    });

                    if (visibleZibs.length === 0) return null;

                    return (
                      <div key={subsection.title} className="mt-6">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3 pl-2 border-l-2 border-slate-200 ml-1">
                          {subsection.title}
                        </h3>

                        <div className="space-y-3">
                          {visibleZibs.map(zibId => {
                            const items = zibsMap[zibId];
                            const uniqueKey = `${category.id}-${zibId}`;
                            const isZibOpen = openZibs.has(uniqueKey);
                            const readableName = getReadableName(zibId);
                            const config = ZIB_TABLE_CONFIG[zibId];

                            return (
                              <div key={zibId} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                
                                {/* ZIB Kaartje */}
                                <div 
                                  onClick={() => toggleZib(uniqueKey)}
                                  className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg transition-colors ${isZibOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                      {isZibOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </div>
                                    <span className="font-semibold text-slate-700">{readableName}</span>
                                  </div>
                                  <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md text-[10px] font-bold">
                                    {items.length}
                                  </span>
                                </div>

                                {/* De Tabel */}
                                {isZibOpen && (
                                  <div className="border-t border-slate-100 bg-slate-50/50 overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                      <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                                        <tr>
                                          <th className="px-5 py-3 font-semibold w-40">Datum</th>
                                          {config ? (
                                            config.map(col => <th key={col.key} className="px-5 py-3 font-semibold whitespace-nowrap">{col.label}</th>)
                                          ) : (
                                            <th className="px-5 py-3 font-semibold">Details</th>
                                          )}
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 bg-white">
                                        {items.map(item => (
                                          <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                                            <td className="px-5 py-3 align-top whitespace-nowrap">
                                               <div className="font-medium text-slate-700">
                                                 {format(new Date(item.recorded_at), 'dd-MM-yyyy', { locale: nl })}
                                               </div>
                                               <div className="text-[10px] text-slate-400">
                                                 {format(new Date(item.recorded_at), 'HH:mm')}
                                               </div>
                                            </td>
                                            
                                            {config ? (
                                              config.map(col => {
                                                const val = item.content[col.key];
                                                const display = col.transform ? col.transform(val) : val;
                                                
                                                return (
                                                  <td key={col.key} className="px-5 py-3 align-top text-slate-600">
                                                    {val !== undefined && val !== null ? (
                                                       col.key === 'recorded_by' ? 
                                                       <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 flex items-center gap-1 w-fit"><User size={10}/> {display}</span> 
                                                       : display
                                                    ) : <span className="text-slate-300">-</span>}
                                                  </td>
                                                );
                                              })
                                            ) : (
                                              // Fallback voor onbekende ZIBs
                                              <td className="px-5 py-3 text-xs text-slate-600 leading-relaxed">
                                                {Object.entries(item.content)
                                                  .filter(([k]) => !['resourceType', 'id', 'status', 'meta'].includes(k))
                                                  .map(([k, v]) => (
                                                    <span key={k} className="mr-2 inline-flex items-center bg-slate-100 border border-slate-200 px-2 py-1 rounded mb-1">
                                                      <span className="opacity-50 mr-1 uppercase text-[9px]">{k}:</span> {String(v)}
                                                    </span>
                                                  ))}
                                              </td>
                                            )}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Lege staat */}
        {zibs.length === 0 && !loading && (
          <div className="text-center py-24 px-6 bg-white rounded-[2rem] border border-dashed border-slate-300">
             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info size={32} className="text-slate-300" />
             </div>
             <h3 className="text-slate-900 font-bold text-lg mb-1">Nog geen gegevens</h3>
             <p className="text-slate-500">Er zijn nog geen medische gegevens beschikbaar in uw kluis.</p>
          </div>
        )}

      </main>
    </div>
  );
}
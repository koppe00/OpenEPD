'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { 
  Users, 
  Stethoscope, 
  Pill, 
  Building2, 
  Globe,
  Database,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { SpecialismManager } from '@/components/users/context/SpecialismManager';
import { GroupManager } from '@/components/users/context/GroupManager';
import { WorkContextManager } from '@/components/users/context/WorkContextManager';

// Type definitions
interface ReferenceTable {
  id: string;
  name: string;
  source: string;
  ntsReady: boolean;
  description: string;
  component?: string;
  planned?: boolean;
  cost?: string;
}

interface ReferenceCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  tables: ReferenceTable[];
}

// Categorieën van referentiedata conform Nederlandse zorgstandaarden
const referenceCategories: ReferenceCategory[] = [
  {
    id: 'identification',
    name: 'Identificatie & Autorisatie',
    description: 'Wie?',
    icon: Users,
    color: 'blue',
    tables: [
      {
        id: 'specialisms',
        name: 'Specialismen',
        source: 'AGB COD016 / DHD / Nictiz',
        component: 'SpecialismManager',
        ntsReady: true,
        description: 'Medische specialismen volgens officiële Nederlandse standaarden'
      },
      {
        id: 'agb-zorgverleners',
        name: 'AGB Zorgverleners',
        source: 'Vektis',
        ntsReady: false,
        planned: true,
        description: 'Identificatie van individuele artsen/behandelaars'
      },
      {
        id: 'agb-instellingen',
        name: 'AGB Instellingen',
        source: 'Vektis',
        ntsReady: false,
        planned: true,
        description: 'Identificatie van praktijken en ziekenhuizen'
      },
      {
        id: 'big-register',
        name: 'BIG Register',
        source: 'CIBG',
        ntsReady: false,
        planned: true,
        description: 'Controle bevoegdheid zorgverleners'
      }
    ]
  },
  {
    id: 'organizational',
    name: 'Organisatorische Entiteiten',
    description: 'Teams, afdelingen & locaties',
    icon: Building2,
    color: 'purple',
    tables: [
      {
        id: 'groups',
        name: 'Teams & Groepen',
        source: 'Lokaal',
        component: 'GroupManager',
        ntsReady: false,
        description: 'Teams, diensten, werkgroepen en projecten'
      },
      {
        id: 'work_contexts',
        name: 'Werkcontexten',
        source: 'Lokaal',
        component: 'WorkContextManager',
        ntsReady: false,
        description: 'Locaties, afdelingen, diensten en shifts'
      }
    ]
  },
  {
    id: 'medical',
    name: 'Medische Registratie',
    description: 'Wat?',
    icon: Stethoscope,
    color: 'emerald',
    tables: [
      {
        id: 'snomed',
        name: 'SNOMED CT',
        source: 'Nictiz',
        ntsReady: true,
        planned: true,
        description: 'Diagnoses, klachten, symptomen en verrichtingen'
      },
      {
        id: 'loinc',
        name: 'LOINC',
        source: 'Nictiz / MLDS',
        ntsReady: true,
        planned: true,
        description: 'Labuitslagen en klinische metingen'
      },
      {
        id: 'icd',
        name: 'ICD-10 / ICD-11',
        source: 'WHO / DHD',
        ntsReady: false,
        planned: true,
        description: 'Statistische verwerking diagnoses'
      },
      {
        id: 'gender',
        name: 'Codelijst Geslacht',
        source: 'HL7 / Nictiz',
        ntsReady: true,
        planned: true,
        description: 'Standaardisatie geslacht (M, V, O, U)'
      }
    ]
  },
  {
    id: 'medication',
    name: 'Medicatie & Apotheek',
    description: 'Welke middelen?',
    icon: Pill,
    color: 'rose',
    tables: [
      {
        id: 'g-standaard',
        name: 'G-Standaard',
        source: 'Z-Index',
        ntsReady: false,
        planned: true,
        cost: 'Betaald',
        description: 'Medicatie, interacties, allergieën en contra-indicaties'
      },
      {
        id: 'atc',
        name: 'ATC-codes',
        source: 'WHO',
        ntsReady: false,
        planned: true,
        description: 'Basale classificatie geneesmiddelen'
      },
      {
        id: 'l-standaard',
        name: 'L-Standaard',
        source: 'Z-Index',
        ntsReady: false,
        planned: true,
        cost: 'Betaald',
        description: 'Hulpmiddelen (verband, spuiten, etc.)'
      }
    ]
  },
  {
    id: 'administrative',
    name: 'Administratief & Financieel',
    description: 'Facturatie & verzekeraars',
    icon: Database,
    color: 'amber',
    tables: [
      {
        id: 'uzovi',
        name: 'UZOVI Register',
        source: 'Vektis',
        ntsReady: false,
        planned: true,
        description: 'Codes Nederlandse zorgverzekeraars'
      },
      {
        id: 'zorgactiviteiten',
        name: 'Zorgactiviteiten (ZA)',
        source: 'NZa',
        ntsReady: false,
        planned: true,
        description: 'Declaratiecodes verrichtingen'
      },
      {
        id: 'postcodes',
        name: 'Postcodes / BAG',
        source: 'Kadaster',
        ntsReady: false,
        planned: true,
        description: 'Validatie patiëntadressen'
      },
      {
        id: 'landen',
        name: 'Landencodes',
        source: 'ISO',
        ntsReady: false,
        planned: true,
        description: 'Gestandaardiseerde herkomstlanden'
      }
    ]
  },
  {
    id: 'interoperability',
    name: 'Interoperabiliteit',
    description: 'Communicatie & uitwisseling',
    icon: Globe,
    color: 'indigo',
    tables: [
      {
        id: 'zib',
        name: 'ZIB Waardelijsten',
        source: 'Nictiz',
        ntsReady: true,
        planned: true,
        description: 'Verzameling voor Zorginformatiebouwstenen'
      },
      {
        id: 'fhir',
        name: 'FHIR Resource Types',
        source: 'HL7',
        ntsReady: true,
        planned: true,
        description: 'Structuur medische berichten'
      }
    ]
  }
];

export default function ReferenceDataPage() {
  const [activeCategory, setActiveCategory] = useState('identification');
  const [activeTable, setActiveTable] = useState<string | null>('specialisms');

  const currentCategory = referenceCategories.find(c => c.id === activeCategory);
  const currentTable = currentCategory?.tables.find(t => t.id === activeTable);

  const renderTableComponent = () => {
    if (!currentTable?.component) {
      return (
        <div className="text-center py-16">
          <AlertCircle className="mx-auto mb-4 text-slate-300" size={48} />
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            {currentTable?.planned ? 'Gepland voor implementatie' : 'Nog niet beschikbaar'}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {currentTable?.description}
          </p>
          {currentTable?.ntsReady && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
              <ExternalLink size={14} />
              NTS-integratie voorbereid
            </div>
          )}
        </div>
      );
    }

    switch (currentTable.component) {
      case 'SpecialismManager':
        return <SpecialismManager />;
      case 'GroupManager':
        return <GroupManager />;
      case 'WorkContextManager':
        return <WorkContextManager />;
      default:
        return null;
    }
  };

  return (
    <>
      <AdminHeader
        title="Referentiedata"
        subtitle="Stamtabellen & Terminologie"
      />
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar met categorieën */}
        <div className="col-span-2 space-y-1.5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-3">
            Categorieën
          </h3>
          {referenceCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            const colorClasses = {
              blue: 'bg-blue-500',
              purple: 'bg-purple-500',
              emerald: 'bg-emerald-500',
              rose: 'bg-rose-500',
              amber: 'bg-amber-500',
              indigo: 'bg-indigo-500'
            }[category.color];

            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setActiveTable(category.tables[0]?.id || null);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-lg ${colorClasses} ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    <Icon size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs">{category.name}</div>
                    <div className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {category.description}
                    </div>
                    <div className={`text-[9px] mt-1 font-bold ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                      {category.tables.length} tabel{category.tables.length !== 1 ? 'len' : ''}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Hoofd content gebied */}
        <div className="col-span-10">
          {/* Tabel selector */}
          {currentCategory && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-4">
              <div className="p-3 border-b border-slate-100">
                <h2 className="font-bold text-sm text-slate-900">{currentCategory.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Selecteer een tabel om te beheren</p>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {currentCategory.tables.map((table) => {
                  const isActive = activeTable === table.id;
                  return (
                    <button
                      key={table.id}
                      onClick={() => setActiveTable(table.id)}
                      className={`text-left p-3 rounded-lg border-2 transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="font-bold text-xs text-slate-900">{table.name}</div>
                        {table.component ? (
                          <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                        ) : table.planned ? (
                          <Clock size={14} className="text-amber-500 shrink-0" />
                        ) : (
                          <AlertCircle size={14} className="text-slate-300 shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-600 mb-1.5">{table.description}</div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
                          {table.source}
                        </span>
                        {table.ntsReady && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-bold">
                            NTS
                          </span>
                        )}
                        {table.cost && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-bold">
                            {table.cost}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tabel component */}
          {currentTable && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-base text-slate-900">{currentTable.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{currentTable.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold">
                      Bron: {currentTable.source}
                    </span>
                    {currentTable.ntsReady && (
                      <span className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold flex items-center gap-1">
                        <ExternalLink size={10} />
                        NTS Gereed
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                {renderTableComponent()}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// packages/clinical-core/src/constants/zibConfig.ts

// --- TYPES ---
export interface ZibOption {
  value: string;
  label: string;
}

export interface ZibField {
  name: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'date' | 'datetime';
  options?: ZibOption[];
  label: string;
  unit?: string;
  placeholder?: string;
}

// --- CONFIGURATIE ---
export const ZIB_CONFIG: Record<string, ZibField[]> = {
  
  // ===========================================================================
  // GROEP 1: METINGEN (Vitals & Fysieke waarden)
  // ===========================================================================

  // 1. Ademhaling
  'nl.zorg.Ademhaling': [
    { name: 'respiratory_rate', label: 'Ademfrequentie', type: 'number', unit: '/min' },
    { 
      name: 'rhythm', label: 'Patroon', type: 'select', 
      options: [
        { value: 'Regular', label: 'Regelmatig' },
        { value: 'Irregular', label: 'Onregelmatig' },
        { value: 'Cheyne-Stokes', label: 'Cheyne-Stokes' },
        { value: 'Kussmaul', label: 'Kussmaul' },
        { value: 'Gasps', label: 'Gaspen' }
      ] 
    },
    { name: 'extra_oxygen_administration', label: 'Extra zuurstof?', type: 'boolean' }
  ],

  // 2. Saturatie
  'nl.zorg.O2Saturatie': [
    { name: 'spo2', label: 'SpO2', type: 'number', unit: '%' },
    { name: 'measurement_method', label: 'Methode', type: 'select', options: [{ value: 'Pulse oximetry', label: 'Polsoximetrie' }, { value: 'Arterial blood gas', label: 'Arterieel Bloedgas' }] },
    { name: 'probe_location', label: 'Locatie', type: 'select', options: [{ value: 'Finger', label: 'Vinger' }, { value: 'Ear', label: 'Oor' }, { value: 'Toe', label: 'Teen' }] }
  ],

  // 3. Bloeddruk
  'nl.zorg.Bloeddruk': [
    { name: 'systolic', label: 'Systolisch', type: 'number', unit: 'mmHg' },
    { name: 'diastolic', label: 'Diastolisch', type: 'number', unit: 'mmHg' },
    { name: 'position', label: 'Houding', type: 'select', options: [{ value: 'Sitting', label: 'Zittend' }, { value: 'Lying', label: 'Liggend' }, { value: 'Standing', label: 'Staand' }] },
    { name: 'cuff_size', label: 'Manchet', type: 'select', options: [{ value: 'Standard', label: 'Standaard' }, { value: 'Large', label: 'Groot' }] }
  ],

  // 4. Gewicht
  'nl.zorg.Lichaamsgewicht': [
    { name: 'weight_value', label: 'Gewicht', type: 'number', unit: 'kg' },
    { name: 'clothing_status', label: 'Kleding', type: 'select', options: [{ value: 'Undressed', label: 'Ontkleed' }, { value: 'Lightly dressed', label: 'Licht gekleed' }] }
  ],

  // 5. Lengte
  'nl.zorg.Lichaamslengte': [
    { name: 'length_value', label: 'Lengte', type: 'number', unit: 'cm' },
    { name: 'position', label: 'Positie', type: 'select', options: [{ value: 'Standing', label: 'Staand' }, { value: 'Lying', label: 'Liggend' }] }
  ],

  // 6. Temperatuur
  'nl.zorg.Lichaamstemperatuur': [
    { name: 'temperature_value', label: 'Temperatuur', type: 'number', unit: '°C' },
    { name: 'location', label: 'Locatie', type: 'select', options: [{ value: 'Tympanic', label: 'Oor' }, { value: 'Oral', label: 'Mond' }, { value: 'Rectal', label: 'Rectaal' }, { value: 'Axillary', label: 'Oksel' }] }
  ],

  // 7. Schedelomvang
  'nl.zorg.Schedelomvang': [
    { name: 'head_circumference', label: 'Omvang', type: 'number', unit: 'cm' }
  ],

  // 8. Pols
  'nl.zorg.Polsfrequentie': [
    { name: 'pulse_rate', label: 'Pols', type: 'number', unit: '/min' },
    { name: 'regularity', label: 'Regelmaat', type: 'select', options: [{ value: 'Regular', label: 'Regelmatig' }, { value: 'Irregular', label: 'Onregelmatig' }] }
  ],

  // 9. Hartfrequentie
  'nl.zorg.Hartfrequentie': [
    { name: 'heart_rate', label: 'Hartslag (Monitor)', type: 'number', unit: '/min' },
    { name: 'measurement_method', label: 'Bron', type: 'select', options: [{ value: 'Monitor', label: 'Monitor' }, { value: 'ECG', label: 'ECG' }, { value: 'Auscultation', label: 'Auscultatie' }] }
  ],

  // 10. Laboratorium
  'nl.zorg.LaboratoriumUitslag': [
    { name: 'test_code', label: 'Test Code (LOINC)', type: 'text', placeholder: 'Bijv. 718-7 (Hb)' },
    { name: 'result_value', label: 'Uitslag (Numeriek)', type: 'number' },
    { name: 'result_unit', label: 'Eenheid', type: 'text', placeholder: 'mmol/l' },
    { name: 'abnormality_flag', label: 'Interpretatie', type: 'select', options: [{ value: 'Normal', label: 'Normaal' }, { value: 'High', label: 'Hoog' }, { value: 'Low', label: 'Laag' }] },
    { name: 'status', label: 'Status', type: 'select', options: [{ value: 'Final', label: 'Definitief' }, { value: 'Preliminary', label: 'Voorlopig' }] }
  ],

  // 11. TekstUitslag
  'nl.zorg.TekstUitslag': [
    { name: 'test_name', label: 'Onderzoek', type: 'text', placeholder: 'Bijv. Echografie Abdomen' },
    { name: 'result_text', label: 'Verslag', type: 'text', placeholder: 'Typ het verslag...' },
    { name: 'effective_date', label: 'Datum onderzoek', type: 'date' }
  ],

  // 12. Visus
  'nl.zorg.Visus': [
    { name: 'visual_acuity', label: 'Visus', type: 'number', unit: 'decimaal (1.0)' },
    { name: 'eye', label: 'Oog', type: 'select', options: [{ value: 'Left', label: 'Links (OS)' }, { value: 'Right', label: 'Rechts (OD)' }, { value: 'Both', label: 'Beide (OU)' }] },
    { name: 'correction', label: 'Correctie', type: 'select', options: [{ value: 'None', label: 'Geen' }, { value: 'Glasses', label: 'Bril' }, { value: 'Contact lenses', label: 'Lenzen' }] }
  ],

  // 13. Refractie
  'nl.zorg.Refractie': [
    { name: 'eye', label: 'Oog', type: 'select', options: [{ value: 'Left', label: 'Links (OS)' }, { value: 'Right', label: 'Rechts (OD)' }] },
    { name: 'sphere', label: 'Sfeer (S)', type: 'number', unit: 'dpt' },
    { name: 'cylinder', label: 'Cilinder (C)', type: 'number', unit: 'dpt' },
    { name: 'axis', label: 'As', type: 'number', unit: '°' }
  ],

  // 14. DAS (Reuma)
  'nl.zorg.DAS': [
    { name: 'das28_score', label: 'DAS28 Totaal', type: 'number' },
    { name: 'tender_joint_count', label: 'Pijnlijke gewrichten', type: 'number', unit: '0-28' },
    { name: 'swollen_joint_count', label: 'Gezwollen gewrichten', type: 'number', unit: '0-28' },
    { name: 'general_health_vas', label: 'Algemene gezondheid', type: 'number', unit: 'VAS 0-100' }
  ],

  // 15. Vochtbalans
  'nl.zorg.Vochtbalans': [
    { name: 'total_input', label: 'Totaal In', type: 'number', unit: 'ml' },
    { name: 'total_output', label: 'Totaal Uit', type: 'number', unit: 'ml' },
    { name: 'balance', label: 'Balans', type: 'number', unit: 'ml' },
    { name: 'start_time', label: 'Starttijd', type: 'datetime' },
    { name: 'end_time', label: 'Eindtijd', type: 'datetime' }
  ],

// ===========================================================================
  // GROEP 2: KLINISCHE CONTEXT (33 Items - Nictiz ZIB 2024 Gold Standard)
  // ===========================================================================

  // --- 1. PROBLEMEN & DIAGNOSES ---
  'nl.zorg.AandoeningOfGesteldheid': [
    { name: 'problem_name', label: 'Naam Aandoening', type: 'text', placeholder: 'Bijv. Diabetes Mellitus type 2' },
    { 
      name: 'problem_type', label: 'Type', type: 'select', 
      options: [
        { value: 'Diagnosis', label: 'Diagnose' },
        { value: 'Symptom', label: 'Symptoom' },
        { value: 'Complaint', label: 'Klacht' },
        { value: 'Finding', label: 'Bevinding' },
        { value: 'Functional limitation', label: 'Functiebeperking' },
        { value: 'Complication', label: 'Complicatie' }
      ] 
    },
    { 
      name: 'clinical_status', label: 'Klinische Status', type: 'select', 
      options: [
        { value: 'Active', label: 'Actief' },
        { value: 'Inactive', label: 'Inactief / Historie' },
        { value: 'Resolved', label: 'Hersteld' },
        { value: 'Relapse', label: 'Recidief' }
      ] 
    },
    { 
      name: 'verification_status', label: 'Verificatie', type: 'select', 
      options: [
        { value: 'Confirmed', label: 'Bevestigd' },
        { value: 'Probable', label: 'Waarschijnlijk' },
        { value: 'Suspected', label: 'Verdenking' },
        { value: 'Refuted', label: 'Uitgesloten' }
      ] 
    },
    { name: 'onset_date', label: 'Startdatum', type: 'date' },
    { name: 'end_date', label: 'Einddatum (indien hersteld)', type: 'date' },
    { name: 'anatomical_location', label: 'Anatomische Locatie', type: 'text', placeholder: 'Bijv. Bovenbeen' },
    { 
      name: 'laterality', label: 'Zijde', type: 'select', 
      options: [
        { value: 'Left', label: 'Links' },
        { value: 'Right', label: 'Rechts' },
        { value: 'Bilateral', label: 'Beiderzijds' },
        { value: 'Unilateral', label: 'Eenzijdig' }
      ] 
    },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.Diagnose': [
    { name: 'diagnosis_code', label: 'Code (ICD10/ICPC)', type: 'text' },
    { name: 'diagnosis_type', label: 'Type Diagnose', type: 'text' },
    { name: 'date', label: 'Datum vaststelling', type: 'date' },
    { name: 'anatomical_location', label: 'Locatie', type: 'text' },
    { name: 'laterality', label: 'Zijde', type: 'select', options: [{value:'Left', label:'Links'}, {value:'Right', label:'Rechts'}, {value:'Bilateral', label:'Beiderzijds'}] }
  ],

  'nl.zorg.Symptoom': [
    { name: 'symptom_name', label: 'Symptoom', type: 'text' },
    { name: 'date', label: 'Datum', type: 'date' },
    { name: 'severity', label: 'Ernst', type: 'select', options: [{value:'Light', label:'Licht'}, {value:'Moderate', label:'Matig'}, {value:'Severe', label:'Ernstig'}] },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.VerpleegkundigeDiagnose': [
    { name: 'diagnosis_name', label: 'Diagnose Titel (NANDA)', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [{value:'Active', label:'Actief'}, {value:'Resolved', label:'Opgelost'}] },
    { name: 'etiology', label: 'Etiologie (Oorzaak)', type: 'text' },
    { name: 'signs_symptoms', label: 'Kenmerken (Signs/Symptoms)', type: 'text' },
    { name: 'date', label: 'Datum vaststelling', type: 'date' }
  ],

  // --- 2. ALLERGIEËN & ALERTS ---
  'nl.zorg.OvergevoeligheidIntolerantie': [
    { name: 'causative_agent', label: 'Stof / Allergeen', type: 'text', placeholder: 'Bijv. Amoxicilline' },
    { 
      name: 'category', label: 'Categorie', type: 'select', 
      options: [
        { value: 'Medication', label: 'Medicatie' },
        { value: 'Food', label: 'Voeding' },
        { value: 'Environment', label: 'Omgeving' },
        { value: 'Biologic', label: 'Biologisch' },
        { value: 'Other', label: 'Overig' }
      ] 
    },
    { 
      name: 'criticality', label: 'Kritiek?', type: 'select', 
      options: [
        { value: 'Low', label: 'Laag / Niet-kritiek' },
        { value: 'High', label: 'Hoog / Kritiek' },
        { value: 'Unable to assess', label: 'Niet te bepalen' }
      ] 
    },
    { 
      name: 'severity', label: 'Ernst reactie', type: 'select', 
      options: [
        { value: 'Mild', label: 'Mild' },
        { value: 'Moderate', label: 'Matig' },
        { value: 'Severe', label: 'Ernstig' }
      ] 
    },
    { name: 'reaction_description', label: 'Beschrijving Reactie', type: 'text' },
    { name: 'onset_date', label: 'Datum eerste keer', type: 'date' }
  ],

  'nl.zorg.Alert': [
    { name: 'alert_name', label: 'Naam Waarschuwing', type: 'text', placeholder: 'Bijv. MRSA positief' },
    { 
      name: 'alert_type', label: 'Type', type: 'select', 
      options: [
        { value: 'Condition', label: 'Aandoening' },
        { value: 'Social', label: 'Sociaal' },
        { value: 'Behavioral', label: 'Gedrag' }
      ] 
    },
    { name: 'start_date', label: 'Startdatum', type: 'date' },
    { name: 'end_date', label: 'Einddatum', type: 'date' },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.Signalering': [
    { name: 'signal_type', label: 'Type Signaal', type: 'text' },
    { name: 'description', label: 'Omschrijving', type: 'text' },
    { name: 'date', label: 'Datum', type: 'date' }
  ],

  'nl.zorg.Uitsluiting': [
    { name: 'excluded_item', label: 'Uitgesloten Aandoening', type: 'text', placeholder: 'Bijv. Geen Diabetes' },
    { name: 'date', label: 'Datum uitsluiting', type: 'date' },
    { name: 'author', label: 'Vastgelegd door', type: 'text' }
  ],

  // --- 3. WONDEN & HUID ---
  'nl.zorg.Wond': [
    { 
      name: 'wound_type', label: 'Soort Wond', type: 'select', 
      options: [
        { value: 'Surgical', label: 'Chirurgisch' },
        { value: 'Traumatic', label: 'Traumatisch' },
        { value: 'Pressure ulcer', label: 'Decubitus' },
        { value: 'Burn', label: 'Brandwond' },
        { value: 'Oncological', label: 'Oncologisch' },
        { value: 'Diabetic ulcer', label: 'Diabetisch ulcus' },
        { value: 'Venous ulcer', label: 'Veneus ulcus' },
        { value: 'Arterial ulcer', label: 'Arterieel ulcus' }
      ] 
    },
    { name: 'anatomical_location', label: 'Locatie', type: 'text' },
    { name: 'onset_date', label: 'Ontstaan op', type: 'date' },
    { name: 'length_value', label: 'Lengte', type: 'number', unit: 'cm' },
    { name: 'width_value', label: 'Breedte', type: 'number', unit: 'cm' },
    { name: 'depth_value', label: 'Diepte', type: 'number', unit: 'cm' },
    { 
      name: 'wound_tissue', label: 'Wondbed (Kleur)', type: 'select', 
      options: [
        { value: 'Granulating', label: 'Rood (Granulerend)' },
        { value: 'Epithelializing', label: 'Roze (Epithelialiserend)' },
        { value: 'Sloughy', label: 'Geel (Beslag)' },
        { value: 'Necrotic', label: 'Zwart (Necrose)' },
        { value: 'Infected', label: 'Geïnfecteerd' }
      ] 
    },
    { 
      name: 'exudate', label: 'Vochtproductie', type: 'select', 
      options: [
        { value: 'None', label: 'Geen' },
        { value: 'Light', label: 'Licht' },
        { value: 'Moderate', label: 'Matig' },
        { value: 'Heavy', label: 'Veel' }
      ] 
    },
    { name: 'comment', label: 'Opmerkingen', type: 'text' }
  ],

  'nl.zorg.DecubitusWond': [
    { 
      name: 'category', label: 'Categorie', type: 'select', 
      options: [
        { value: 'Cat 1', label: 'Cat 1: Roodheid' },
        { value: 'Cat 2', label: 'Cat 2: Blaar' },
        { value: 'Cat 3', label: 'Cat 3: Oppervlakkig' },
        { value: 'Cat 4', label: 'Cat 4: Diep' },
        { value: 'DTI', label: 'DTI: Diepe weefselschade' },
        { value: 'Unstageable', label: 'Niet te classificeren' }
      ] 
    },
    { name: 'anatomical_location', label: 'Locatie', type: 'text' },
    { name: 'length_value', label: 'Lengte', type: 'number', unit: 'cm' },
    { name: 'width_value', label: 'Breedte', type: 'number', unit: 'cm' },
    { name: 'date_last_change', label: 'Laatste wissel', type: 'date' }
  ],

  'nl.zorg.Brandwond': [
    { name: 'extent_percentage', label: 'Totaal Oppervlak (TBSA)', type: 'number', unit: '%' },
    { 
      name: 'depth', label: 'Diepte', type: 'select', 
      options: [
        { value: 'First degree', label: '1e graads' },
        { value: 'Second degree superficial', label: '2e graads oppervlakkig' },
        { value: 'Second degree deep', label: '2e graads diep' },
        { value: 'Third degree', label: '3e graads' }
      ] 
    },
    { name: 'anatomical_location', label: 'Locatie', type: 'text' }
  ],

  'nl.zorg.Huidaandoening': [
    { name: 'condition_name', label: 'Naam Aandoening', type: 'text' },
    { name: 'anatomical_location', label: 'Locatie', type: 'text' },
    { name: 'onset_date', label: 'Ontstaan op', type: 'date' },
    { name: 'description', label: 'Beschrijving', type: 'text' }
  ],

  // --- 4. LIJNEN & HULPMIDDELEN ---
  'nl.zorg.Infuus': [
    { 
      name: 'catheter_type', label: 'Type Infuus', type: 'select', 
      options: [
        { value: 'Peripheral', label: 'Perifeer (Venflon)' },
        { value: 'Central', label: 'CVC (Centraal)' },
        { value: 'Port-a-cath', label: 'PAC (Port-a-cath)' },
        { value: 'PICC', label: 'PICC-lijn' },
        { value: 'Arterial', label: 'Arterielijn' }
      ] 
    },
    { name: 'location', label: 'Locatie', type: 'text' },
    { name: 'lumen_count', label: 'Aantal lumen', type: 'number' },
    { name: 'insertion_date', label: 'Ingebracht op', type: 'date' },
    { name: 'dressing_date', label: 'Laatste verzorging', type: 'date' },
    { name: 'removal_date', label: 'Verwijderd op', type: 'date' }
  ],

  'nl.zorg.SondeSysteem': [
    { 
      name: 'probe_type', label: 'Soort Sonde', type: 'select', 
      options: [
        { value: 'Nasogastric', label: 'Neus-maagsonde' },
        { value: 'Nasoduodenal', label: 'Neus-darmsonde' },
        { value: 'PEG', label: 'PEG-sonde' },
        { value: 'Suprapubic', label: 'Suprapubische katheter' }
      ] 
    },
    { name: 'insertion_date', label: 'Ingebracht op', type: 'date' },
    { name: 'gauge', label: 'Dikte (Ch)', type: 'number' },
    { name: 'insertion_length', label: 'Ingebrachte lengte', type: 'number', unit: 'cm' },
    { name: 'removal_date', label: 'Verwijderd op', type: 'date' }
  ],

  'nl.zorg.Stoma': [
    { 
      name: 'stoma_type', label: 'Type Stoma', type: 'select', 
      options: [
        { value: 'Colostomy', label: 'Colostoma (Dikke darm)' },
        { value: 'Ileostomy', label: 'Ileostoma (Dunne darm)' },
        { value: 'Urostomy', label: 'Urostoma (Urine)' },
        { value: 'Tracheostomy', label: 'Tracheostoma (Luchtpijp)' }
      ] 
    },
    { name: 'location', label: 'Locatie', type: 'text' },
    { name: 'material', label: 'Materiaal', type: 'text' },
    { name: 'insertion_date', label: 'Aanlegdatum', type: 'date' }
  ],

  'nl.zorg.MedischHulpmiddel': [
    { name: 'product_name', label: 'Hulpmiddel', type: 'text', placeholder: 'Bijv. Rolstoel, Pacemaker' },
    { name: 'product_type', label: 'Type', type: 'text' },
    { name: 'start_date', label: 'Startdatum', type: 'date' },
    { name: 'end_date', label: 'Einddatum', type: 'date' },
    { name: 'indication', label: 'Indicatie', type: 'text' }
  ],

  // --- 5. FUNCTIES ---
  'nl.zorg.FunctieHoren': [
    { 
      name: 'status', label: 'Status Gehoor', type: 'select', 
      options: [
        { value: 'Good', label: 'Goed' },
        { value: 'Impaired', label: 'Beperkt' },
        { value: 'Deaf', label: 'Doof' }
      ] 
    },
    { name: 'aid_used', label: 'Hoortoestel in gebruik?', type: 'boolean' },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.FunctieZien': [
    { 
      name: 'status', label: 'Status Visus', type: 'select', 
      options: [
        { value: 'Good', label: 'Goed' },
        { value: 'Impaired', label: 'Beperkt' },
        { value: 'Blind', label: 'Blind' }
      ] 
    },
    { name: 'aid_used', label: 'Bril/Lenzen in gebruik?', type: 'boolean' },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.Blaasfunctie': [
    { 
      name: 'continence_status', label: 'Status', type: 'select', 
      options: [
        { value: 'Continent', label: 'Continent' },
        { value: 'Incontinent', label: 'Incontinent' },
        { value: 'Catheter', label: 'Katheter' },
        { value: 'Urostomy', label: 'Urostoma' }
      ] 
    },
    { 
      name: 'incontinence_frequency', label: 'Frequentie Incontinentie', type: 'select', 
      options: [
        { value: 'Daily', label: 'Dagelijks' },
        { value: 'Weekly', label: 'Wekelijks' },
        { value: 'Occasionally', label: 'Af en toe' }
      ] 
    },
    { name: 'aid_used', label: 'Materiaal gebruikt?', type: 'boolean' }
  ],

  'nl.zorg.Darmfunctie': [
    { 
      name: 'continence_status', label: 'Status', type: 'select', 
      options: [
        { value: 'Continent', label: 'Continent' },
        { value: 'Incontinent', label: 'Incontinent' },
        { value: 'Stoma', label: 'Stoma' }
      ] 
    },
    { name: 'last_defecation_date', label: 'Laatste ontlasting', type: 'datetime' },
    { name: 'color', label: 'Kleur', type: 'text' }
  ],

  'nl.zorg.FunctioneleOfMentaleStatus': [
    { name: 'status_name', label: 'Naam Status', type: 'text', placeholder: 'Bijv. Oriëntatie in tijd' },
    { name: 'value', label: 'Waarde', type: 'text' },
    { name: 'date', label: 'Datum', type: 'date' }
  ],

  'nl.zorg.Pijnkenmerken': [
    { name: 'pain_location', label: 'Locatie Pijn', type: 'text' },
    { 
      name: 'pain_type', label: 'Soort Pijn', type: 'select', 
      options: [
        { value: 'Nociceptive', label: 'Nociceptief (Weefsel)' },
        { value: 'Neuropathic', label: 'Neuropathisch (Zenuw)' },
        { value: 'Visceral', label: 'Visceraal (Orgaan)' }
      ] 
    },
    { name: 'radiation', label: 'Uitstraling naar', type: 'text' },
    { name: 'provoking_factors', label: 'Provocatie factoren', type: 'text' }
  ],

  // --- 6. VERSLAGEN ---
  'nl.zorg.SOEPVerslag': [
    { name: 'date', label: 'Datum', type: 'date' },
    { name: 'subjective', label: 'S (Subjectief)', type: 'text', placeholder: 'Klacht en beleving patiënt...' },
    { name: 'objective', label: 'O (Objectief)', type: 'text', placeholder: 'Waarneming arts/onderzoek...' },
    { name: 'evaluation', label: 'E (Evaluatie)', type: 'text', placeholder: 'Conclusie/Diagnose...' },
    { name: 'plan', label: 'P (Plan)', type: 'text', placeholder: 'Beleid en afspraken...' },
    { name: 'author', label: 'Auteur', type: 'text' }
  ],

  'nl.zorg.ContactVerslag': [
    { name: 'date', label: 'Datum', type: 'date' },
    { 
      name: 'contact_type', label: 'Type Contact', type: 'select', 
      options: [
        { value: 'Consultation', label: 'Fysiek Consult' },
        { value: 'Visit', label: 'Visite (Aan huis)' },
        { value: 'Phone', label: 'Telefonisch' },
        { value: 'Email', label: 'E-mail / Bericht' },
        { value: 'Video', label: 'Beeldbellen' }
      ] 
    },
    { name: 'notes', label: 'Verslag', type: 'text' },
    { name: 'author', label: 'Auteur', type: 'text' }
  ],

  'nl.zorg.ZorgEpisode': [
    { name: 'episode_name', label: 'Naam Episode', type: 'text' },
    { name: 'start_date', label: 'Startdatum', type: 'date' },
    { name: 'end_date', label: 'Einddatum', type: 'date' }
  ],

  'nl.zorg.Patientbespreking': [
    { name: 'date', label: 'Datum', type: 'date' },
    { 
      name: 'discussion_type', label: 'Type Bespreking', type: 'select', 
      options: [
        { value: 'MDO', label: 'MDO (Multidisciplinair)' },
        { value: 'Handover', label: 'Overdracht' },
        { value: 'Consult', label: 'Collegiaal Consult' }
      ] 
    },
    { name: 'outcome', label: 'Besluit / Uitkomst', type: 'text' },
    { name: 'attendees', label: 'Aanwezigen', type: 'text' }
  ],

  'nl.zorg.BewakingBesluit': [
    { name: 'decision', label: 'Besluit Bewaking', type: 'text', placeholder: 'Bijv. Continue saturatiemeting' },
    { name: 'start_date', label: 'Startdatum', type: 'date' },
    { name: 'end_date', label: 'Einddatum', type: 'date' }
  ],

  // --- 7. ZWANGERSCHAP & KIND ---
  'nl.zorg.Zwangerschap': [
    { name: 'due_date', label: 'Datum à Terme', type: 'date' },
    { name: 'gravidity', label: 'Graviditeit (G)', type: 'number', placeholder: 'Aantal zwangerschappen' },
    { name: 'parity', label: 'Pariteit (P)', type: 'number', placeholder: 'Aantal bevallingen' },
    { name: 'status', label: 'Status', type: 'select', options: [{value:'Current', label:'Actueel'}, {value:'Completed', label:'Voltooid'}, {value:'Aborted', label:'Afgebroken'}] },
    { name: 'multiple_birth', label: 'Meerling?', type: 'boolean' }
  ],

  'nl.zorg.OntwikkelingKind': [
    { name: 'milestone', label: 'Mijlpaal (Van Wiechen)', type: 'text' },
    { name: 'date', label: 'Datum observatie', type: 'date' },
    { 
      name: 'status', label: 'Status', type: 'select', 
      options: [
        { value: 'Achieved', label: 'Behaald' },
        { value: 'Not yet', label: 'Nog niet' },
        { value: 'Assistance needed', label: 'Hulp nodig' }
      ] 
    },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.VoedingspatroonZuigeling': [
    { 
      name: 'feeding_type', label: 'Type Voeding', type: 'select', 
      options: [
        { value: 'Breastfeeding', label: 'Borstvoeding' },
        { value: 'Formula', label: 'Kunstvoeding' },
        { value: 'Mixed', label: 'Gemengd' }
      ] 
    },
    { name: 'frequency', label: 'Aantal keer per dag', type: 'number' },
    { name: 'quantity_per_feed', label: 'Hoeveelheid per keer', type: 'number', unit: 'ml' }
  ],

  // --- 8. OVERIG ---
  'nl.zorg.Vaccinatie': [
    { name: 'product_name', label: 'Naam Vaccin', type: 'text' },
    { name: 'administration_date', label: 'Datum Toediening', type: 'date' },
    { name: 'dose', label: 'Dosis', type: 'text' },
    { name: 'batch_number', label: 'Batchnummer', type: 'text' },
    { name: 'performer', label: 'Uitvoerende (Arts/GGD)', type: 'text' }
  ],

  'nl.zorg.Voedingsadvies': [
    { name: 'advice_text', label: 'Inhoud Advies', type: 'text' },
    { 
      name: 'type', label: 'Type Dieet', type: 'select', 
      options: [
        { value: 'Energy enriched', label: 'Energieverrijkt' },
        { value: 'Protein enriched', label: 'Eiwitverrijkt' },
        { value: 'Salt restricted', label: 'Zoutbeperkt' },
        { value: 'Fluid restricted', label: 'Vochtbeperkt' },
        { value: 'Allergen free', label: 'Allergeenvrij' }
      ] 
    },
    { name: 'start_date', label: 'Startdatum', type: 'date' }
  ],

  'nl.zorg.Reactie': [
    { name: 'reaction_text', label: 'Beschrijving Reactie', type: 'text' },
    { name: 'date', label: 'Datum', type: 'date' },
    { name: 'clinician', label: 'Zorgverlener', type: 'text' }
  ],
  // ===========================================================================
  // GROEP 3: BEHANDELING & PROCES (Gold Standard 2024)
  // ===========================================================================

  'nl.zorg.BehandelAanwijzing2': [
    { 
      name: 'treatment_type', label: 'Behandeling', type: 'select', 
      options: [
        { value: 'Resuscitation', label: 'Reanimatie' },
        { value: 'Intubation', label: 'Intubatie' },
        { value: 'Artificial ventilation', label: 'Beademing' },
        { value: 'Admission to ICU', label: 'IC Opname' },
        { value: 'Surgery', label: 'Operatie' },
        { value: 'Blood transfusion', label: 'Bloedtransfusie' }
      ] 
    },
    { 
      name: 'permission', label: 'Toestemming', type: 'select', 
      options: [
        { value: 'Yes', label: 'Ja, uitvoeren' },
        { value: 'No', label: 'Nee, niet uitvoeren (DNR)' },
        { value: 'With limitations', label: 'Ja, met beperkingen' }
      ] 
    },
    { name: 'start_date', label: 'Ingangsdatum', type: 'date' },
    { name: 'limitations', label: 'Specifieke beperkingen', type: 'text' },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.Behandeldoel': [
    { name: 'goal_description', label: 'Doelstelling', type: 'text', placeholder: 'Bijv. Binnen 2 weken weer zelfstandig traplopen' },
    { 
      name: 'status', label: 'Status', type: 'select', 
      options: [
        { value: 'Active', label: 'Actueel' },
        { value: 'Achieved', label: 'Behaald' },
        { value: 'Not achieved', label: 'Niet behaald' },
        { value: 'Discontinued', label: 'Gestopt' }
      ] 
    },
    { name: 'start_date', label: 'Startdatum', type: 'date' },
    { name: 'target_date', label: 'Streefdatum', type: 'date' }
  ],

  'nl.zorg.Verrichting': [
    { name: 'procedure_name', label: 'Verrichting / Operatie', type: 'text' },
    { 
      name: 'status', label: 'Status', type: 'select', 
      options: [
        { value: 'Planned', label: 'Gepland' },
        { value: 'In progress', label: 'In uitvoering' },
        { value: 'Completed', label: 'Afgerond' },
        { value: 'Cancelled', label: 'Geannuleerd' }
      ] 
    },
    { name: 'start_date', label: 'Datum/Tijd', type: 'datetime' },
    { name: 'location', label: 'Anatomische locatie', type: 'text' },
    { name: 'performer', label: 'Uitvoerende', type: 'text' }
  ],

  'nl.zorg.VerpleegkundigeInterventie': [
    { name: 'intervention_name', label: 'Interventie', type: 'text', placeholder: 'Bijv. Wondverzorging volgens protocol' },
    { name: 'start_time', label: 'Starttijd', type: 'datetime' },
    { name: 'frequency', label: 'Frequentie', type: 'text', placeholder: 'Bijv. 3x daags' },
    { name: 'indication', label: 'Indicatie', type: 'text' }
  ],

  'nl.zorg.VrijheidsbeperkendeInterventie': [
    { 
      name: 'intervention_type', label: 'Type Beperking', type: 'select', 
      options: [
        { value: 'Mechanical restraint', label: 'Mechanisch (Onrusthekken/Zitband)' },
        { value: 'Electronic monitoring', label: 'Electronisch (GPS/Sensor)' },
        { value: 'Pharmacological restraint', label: 'Farmacologisch (Medicatie)' },
        { value: 'Seclusion', label: 'Isolatie' }
      ] 
    },
    { name: 'intervention_name', label: 'Specifieke maatregel', type: 'text' },
    { 
      name: 'legal_status', label: 'Juridische Status', type: 'select', 
      options: [
        { value: 'Voluntary', label: 'Vrijwillig' },
        { value: 'Involuntary (Wvggz)', label: 'Onvrijwillig (Wvggz)' },
        { value: 'Involuntary (Wzd)', label: 'Onvrijwillig (Wzd)' }
      ] 
    },
    { name: 'start_date', label: 'Startdatum', type: 'date' },
    { name: 'reason', label: 'Reden/Indicatie', type: 'text' }
  ],

  'nl.zorg.UitkomstVanZorg': [
    { name: 'description', label: 'Uitkomst / Resultaat', type: 'text' },
    { name: 'observation_date', label: 'Datum waarneming', type: 'date' },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.ZorgAfspraak': [
    { name: 'appointment_type', label: 'Type Afspraak', type: 'text', placeholder: 'Bijv. Poliklinisch consult' },
    { name: 'start_time', label: 'Begin Datum/Tijd', type: 'datetime' },
    { name: 'location', label: 'Locatie/Kamer', type: 'text' },
    { name: 'health_professional', label: 'Zorgverlener', type: 'text' }
  ],

// ===========================================================================
  // GROEP 4: MEDICATIE (Gold Standard 2024)
  // ===========================================================================

  'nl.zorg.Medicatieafspraak': [
    { name: 'medicine_name', label: 'Medicament', type: 'text', placeholder: 'Bijv. Metformine 500mg' },
    { name: 'dosage_text', label: 'Doseringsinstructie', type: 'text', placeholder: 'Bijv. 1 dd 1 tablet' },
    { name: 'dosage_value', label: 'Dosis (Numeriek)', type: 'number' },
    { name: 'dosage_unit', label: 'Eenheid', type: 'text', placeholder: 'bijv. mg of stuks' },
    { name: 'route_of_administration', label: 'Toedieningsweg', type: 'text', placeholder: 'Oraal, IV, IM, etc.' },
    { name: 'frequency', label: 'Frequentie', type: 'text', placeholder: 'Bijv. 2 x daags' },
    { name: 'start_date', label: 'Ingangsdatum', type: 'date' },
    { name: 'end_date', label: 'Einddatum', type: 'date' },
    { 
      name: 'status', label: 'Status', type: 'select', 
      options: [
        { value: 'Active', label: 'Actief' },
        { value: 'Discontinued', label: 'Gestopt' },
        { value: 'On hold', label: 'Opgeschort' }
      ] 
    },
    { name: 'indication', label: 'Indicatie', type: 'text' }
  ],

  'nl.zorg.MedicatieToediening2': [
    { name: 'medicine_name', label: 'Medicament', type: 'text' },
    { name: 'administration_time', label: 'Tijd van toediening', type: 'datetime' },
    { name: 'administered_amount', label: 'Hoeveelheid', type: 'number' },
    { name: 'administered_unit', label: 'Eenheid', type: 'text' },
    { name: 'performer', label: 'Toegediend door', type: 'text' },
    { 
      name: 'status', label: 'Status', type: 'select', 
      options: [
        { value: 'Completed', label: 'Toegediend' },
        { value: 'Aborted', label: 'Onderbroken' },
        { value: 'Not done', label: 'Niet gedaan/Geweigerd' }
      ] 
    }
  ],

  'nl.zorg.MedicatieGebruik2': [
    { name: 'medicine_name', label: 'Medicament', type: 'text' },
    { name: 'dosage_text', label: 'Gebruik volgens patiënt', type: 'text' },
    { name: 'as_needed', label: 'Zo nodig (PRN)', type: 'boolean' },
    { name: 'start_date', label: 'Datum sinds', type: 'date' }
  ],

  'nl.zorg.Medicatieverstrekking': [
    { name: 'medicine_name', label: 'Medicament', type: 'text' },
    { name: 'dispense_date', label: 'Datum verstrekking', type: 'date' },
    { name: 'quantity', label: 'Aantal verstrekt', type: 'number' },
    { name: 'batch_number', label: 'Batch/Lot nummer', type: 'text' },
    { name: 'expiry_date', label: 'Vervaldatum', type: 'date' }
  ],

  'nl.zorg.Verstrekkingsverzoek': [
    { name: 'medicine_name', label: 'Medicament', type: 'text' },
    { name: 'quantity', label: 'Aanvraag aantal', type: 'number' },
    { name: 'refills_remaining', label: 'Aantal herhalingen', type: 'number' },
    { name: 'request_date', label: 'Datum aanvraag', type: 'date' }
  ],

  'nl.zorg.Toedieningsafspraak': [
    { name: 'medicine_name', label: 'Medicament', type: 'text' },
    { name: 'dosage_instruction', label: 'Instructie voor toediener', type: 'text' },
    { 
      name: 'distribution_form', label: 'Distributievorm', type: 'select', 
      options: [
        { value: 'Manual', label: 'Handmatige uitzet' },
        { value: 'GDS (Baxter)', label: 'GDS (Baxter-rol)' },
        { value: 'Pump', label: 'Infuuspomp' }
      ] 
    },
    { name: 'start_date', label: 'Ingangsdatum', type: 'date' }
  ],


  // ===========================================================================
  // GROEP: PATIËNTEN CONTEXT (18 ITEMS - GOLD STANDARD 2024)
  // ===========================================================================

  'nl.zorg.AlcoholGebruik': [
    { name: 'usage_status', label: 'Gebruik Status', type: 'select', options: [{value:'Current', label:'Huidig gebruik'}, {value:'Former', label:'Gestopt'}, {value:'Never', label:'Nooit gedronken'}] },
    { name: 'amount', label: 'Glazen per dag', type: 'number', unit: 'glazen' },
    { name: 'frequency', label: 'Frequentie', type: 'text', placeholder: 'Bijv. 3x per week' },
    { name: 'start_date', label: 'Startdatum gebruik', type: 'date' },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.TabakGebruik': [
    { name: 'usage_status', label: 'Rook Status', type: 'select', options: [{value:'Current', label:'Rookt'}, {value:'Former', label:'Ex-roker'}, {value:'Never', label:'Nooit gerookt'}] },
    { name: 'type', label: 'Type Tabak', type: 'select', options: [{value:'Cigarettes', label:'Sigaretten'}, {value:'Cigars', label:'Sigaren'}, {value:'Pipe', label:'Pijp'}, {value:'E-cigarette', label:'E-sigaret'}] },
    { name: 'amount', label: 'Aantal per dag', type: 'number' },
    { name: 'pack_years', label: 'Pack Years', type: 'number' },
    { name: 'start_date', label: 'Startdatum', type: 'date' },
    { name: 'end_date', label: 'Stopdatum', type: 'date' }
  ],

  'nl.zorg.DrugsGebruik': [
    { name: 'usage_status', label: 'Gebruik Status', type: 'select', options: [{value:'Current', label:'Huidig'}, {value:'Former', label:'Gestopt'}, {value:'Never', label:'Nooit'}] },
    { name: 'drug_type', label: 'Soort Drugs', type: 'text', placeholder: 'Bijv. Cannabis, Cocaïne' },
    { name: 'route', label: 'Toedieningsweg', type: 'text', placeholder: 'Bijv. Roken, Snuiven' },
    { name: 'start_date', label: 'Startdatum', type: 'date' }
  ],

  'nl.zorg.Wilsverklaring': [
    { name: 'type', label: 'Type Verklaring', type: 'select', options: [{value:'Living will', label:'Wilsverklaring'}, {value:'Euthanasia request', label:'Euthanasieverzoek'}, {value:'Non-resuscitation', label:'Niet-reanimeren penning'}, {value:'Representative', label:'Vertegenwoordiging'}] },
    { name: 'status', label: 'Status', type: 'select', options: [{value:'Present', label:'Aanwezig'}, {value:'Not present', label:'Niet aanwezig'}, {value:'Unknown', label:'Onbekend'}] },
    { name: 'date', label: 'Datum ondertekening', type: 'date' },
    { name: 'location', label: 'Vindplaats origineel', type: 'text' },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.JuridischeSituatie': [
    { name: 'legal_status', label: 'Juridische Status', type: 'select', options: [{value:'Voluntary', label:'Vrijwillig'}, {value:'Involuntary (Wvggz)', label:'Onvrijwillig (Wvggz)'}, {value:'Involuntary (Wzd)', label:'Onvrijwillig (Wzd)'}, {value:'Judicial', label:'Strafrechtelijk'}] },
    { name: 'representation', label: 'Vertegenwoordiging', type: 'select', options: [{value:'Guardian', label:'Curator'}, {value:'Mentor', label:'Mentor'}, {value:'Power of attorney', label:'Gevolmachtigde'}, {value:'None', label:'Geen'}] },
    { name: 'start_date', label: 'Ingangsdatum', type: 'date' },
    { name: 'end_date', label: 'Einddatum', type: 'date' }
  ],

  'nl.zorg.Gezinssituatie': [
    { name: 'household_type', label: 'Type Huishouden', type: 'select', options: [{value:'Alone', label:'Alleenwonend'}, {value:'With partner', label:'Met partner'}, {value:'With partner and children', label:'Met partner en kinderen'}, {value:'Institution', label:'In instelling'}] },
    { name: 'number_of_children', label: 'Aantal kinderen', type: 'number' },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.GezinssituatieKind': [
    { name: 'living_situation', label: 'Woonsituatie Kind', type: 'select', options: [{value:'With parents', label:'Bij ouders'}, {value:'Foster care', label:'Pleeggezin'}, {value:'Institution', label:'Instelling'}] },
    { name: 'care_form', label: 'Zorgvorm', type: 'text' }
  ],

  'nl.zorg.Woonsituatie': [
    { name: 'housing_type', label: 'Type Woning', type: 'select', options: [{value:'House', label:'Woonhuis'}, {value:'Apartment', label:'Appartement'}, {value:'Nursing home', label:'Verpleeghuis'}, {value:'Homeless', label:'Dakloos'}] },
    { name: 'barriers', label: 'Belemmeringen', type: 'text', placeholder: 'Bijv. trappen, drempels' }
  ],

  'nl.zorg.BurgerlijkeStaat': [
    { name: 'status', label: 'Burgerlijke Staat', type: 'select', options: [{value:'Married', label:'Gehuwd'}, {value:'Single', label:'Ongehuwd'}, {value:'Divorced', label:'Gescheiden'}, {value:'Widowed', label:'Weduwe/Weduwnaar'}] }
  ],

  'nl.zorg.Nationaliteit': [
    { name: 'country_code', label: 'Land (ISO Code)', type: 'text', placeholder: 'Bijv. NL' },
    { name: 'nationality', label: 'Nationaliteit', type: 'text', placeholder: 'Bijv. Nederlandse' }
  ],

  'nl.zorg.Opleiding': [
    { name: 'level', label: 'Niveau', type: 'select', options: [{value:'None', label:'Geen'}, {value:'Primary', label:'Basisonderwijs'}, {value:'Secondary', label:'Voortgezet onderwijs'}, {value:'Vocational', label:'MBO'}, {value:'Bachelor', label:'HBO/Bachelor'}, {value:'Master', label:'WO/Master'}] },
    { name: 'status', label: 'Status', type: 'select', options: [{value:'Completed', label:'Afgerond'}, {value:'In progress', label:'Bezig'}, {value:'Dropped out', label:'Niet afgerond'}] }
  ],

  'nl.zorg.ParticipatieInMaatschappij': [
    { name: 'occupation', label: 'Beroep/Bezigheid', type: 'text' },
    { name: 'work_status', label: 'Werk Status', type: 'select', options: [{value:'Employed', label:'Werkend'}, {value:'Unemployed', label:'Werkloos'}, {value:'Retired', label:'Gepensioneerd'}, {value:'Disabled', label:'Arbeidsongeschikt'}] }
  ],

  'nl.zorg.HulpVanAnderen': [
    { name: 'care_type', label: 'Type Hulp', type: 'select', options: [{value:'Informal care (Mantelzorg)', label:'Mantelzorg'}, {value:'Professional care', label:'Professionele hulp'}, {value:'Volunteer', label:'Vrijwilliger'}] },
    { name: 'help_description', label: 'Beschrijving hulp', type: 'text' }
  ],

  'nl.zorg.Taalvaardigheid': [
    { name: 'language', label: 'Taal', type: 'text', placeholder: 'Bijv. Nederlands' },
    { name: 'proficiency', label: 'Vaardigheid', type: 'select', options: [{value:'Good', label:'Goed'}, {value:'Moderate', label:'Matig'}, {value:'Poor', label:'Slecht'}] },
    { name: 'interpreter_required', label: 'Tolk nodig?', type: 'boolean' }
  ],

  'nl.zorg.Levensovertuiging': [
    { name: 'religion', label: 'Overtuiging', type: 'text', placeholder: 'Bijv. Rooms-Katholiek' },
    { name: 'restrictions', label: 'Wensen/Beperkingen', type: 'text' }
  ],

  'nl.zorg.Ziektebeleving': [
    { name: 'insight', label: 'Ziekte-inzicht', type: 'text' },
    { name: 'coping_style', label: 'Copingstijl', type: 'text' }
  ],

  'nl.zorg.Klachtbeleving': [
    { name: 'concern_level', label: 'Bezorgdheid', type: 'select', options: [{value:'Not concerned', label:'Niet bezorgd'}, {value:'Somewhat concerned', label:'Enszins bezorgd'}, {value:'Very concerned', label:'Heel bezorgd'}] }
  ],

  'nl.zorg.Familieanamnese': [
    { name: 'disorder_name', label: 'Aandoening familielid', type: 'text' },
    { name: 'relationship', label: 'Relatie', type: 'text', placeholder: 'Bijv. Vader' },
    { name: 'onset_age', label: 'Leeftijd bij openbaring', type: 'number' }
  ],

// ===========================================================================
  // GROEP 6: ADMINISTRATIEF (Gold Standard 2024)
  // ===========================================================================

  'nl.zorg.Patient': [
    { name: 'ssn_number', label: 'BSN', type: 'text', placeholder: '9 cijfers' },
    { name: 'given_name', label: 'Voornaam', type: 'text' },
    { name: 'initials', label: 'Initialen', type: 'text' },
    { name: 'surname_prefix', label: 'Tussenvoegsel', type: 'text' },
    { name: 'surname', label: 'Achternaam', type: 'text' },
    { name: 'birth_date', label: 'Geboortedatum', type: 'date' },
    { 
      name: 'gender', label: 'Geslacht', type: 'select', 
      options: [
        { value: 'Male', label: 'Man' },
        { value: 'Female', label: 'Vrouw' },
        { value: 'Other', label: 'Overig' },
        { value: 'Unknown', label: 'Onbekend' }
      ] 
    },
    { name: 'address', label: 'Adres (Straat + Nr)', type: 'text' },
    { name: 'postal_code', label: 'Postcode', type: 'text' },
    { name: 'city', label: 'Woonplaats', type: 'text' },
    { name: 'phone_number', label: 'Telefoon', type: 'text' },
    { name: 'email', label: 'E-mailadres', type: 'text' }
  ],

  'nl.zorg.Contactpersoon': [
    { 
      name: 'relationship', label: 'Relatie', type: 'select', 
      options: [
        { value: 'Partner', label: 'Partner' },
        { value: 'Child', label: 'Kind' },
        { value: 'Parent', label: 'Ouder' },
        { value: 'Guardian', label: 'Voogd/Curator' },
        { value: 'Neighbor', label: 'Buurman/Buurvrouw' },
        { value: 'Other', label: 'Overig' }
      ] 
    },
    { name: 'given_name', label: 'Voornaam', type: 'text' },
    { name: 'surname', label: 'Achternaam', type: 'text' },
    { name: 'phone_number', label: 'Telefoonnummer', type: 'text' },
    { name: 'is_emergency_contact', label: 'Eerste contactpersoon?', type: 'boolean' }
  ],

  'nl.zorg.Zorgverlener': [
    { name: 'provider_id', label: 'BIG / UZI nummer', type: 'text' },
    { name: 'name', label: 'Naam Zorgverlener', type: 'text' },
    { name: 'specialty', label: 'Specialisme', type: 'text', placeholder: 'Bijv. Huisarts, Oncoloog' },
    { name: 'organization', label: 'Zorgaanbieder / Instelling', type: 'text' }
  ],

  'nl.zorg.Zorgaanbieder': [
    { name: 'organization_id', label: 'URA / KvK nummer', type: 'text' },
    { name: 'organization_name', label: 'Naam Organisatie', type: 'text' },
    { 
      name: 'organization_type', label: 'Type Instelling', type: 'select', 
      options: [
        { value: 'Hospital', label: 'Ziekenhuis' },
        { value: 'General Practice', label: 'Huisartsenpraktijk' },
        { value: 'Nursing Home', label: 'Verpleeghuis' },
        { value: 'Home Care', label: 'Thuiszorg' },
        { value: 'Pharmacy', label: 'Apotheek' }
      ] 
    },
    { name: 'city', label: 'Plaats', type: 'text' }
  ],

  'nl.zorg.Contact': [
    { name: 'contact_date_time', label: 'Datum en Tijd', type: 'datetime' },
    { 
      name: 'contact_type', label: 'Type Contact', type: 'select', 
      options: [
        { value: 'Outpatient', label: 'Poliklinisch' },
        { value: 'Inpatient', label: 'Klinisch (tijdens opname)' },
        { value: 'Emergency', label: 'Spoed (SEH)' },
        { value: 'Home visit', label: 'Visite thuis' },
        { value: 'Teleconsultation', label: 'Teleconsult/Beeldbellen' }
      ] 
    },
    { name: 'location', label: 'Locatie / Afdeling', type: 'text' },
    { name: 'reason', label: 'Reden van contact', type: 'text' }
  ],

  'nl.zorg.Opname': [
    { name: 'admission_date_time', label: 'Opname start', type: 'datetime' },
    { name: 'discharge_date_time', label: 'Ontslag datum/tijd', type: 'datetime' },
    { name: 'admission_location', label: 'Afdeling/Kamer', type: 'text' },
    { 
      name: 'admission_source', label: 'Herkomst', type: 'select', 
      options: [
        { value: 'Home', label: 'Thuis' },
        { value: 'Other hospital', label: 'Ander ziekenhuis' },
        { value: 'Emergency department', label: 'SEH' }
      ] 
    },
    { name: 'specialty', label: 'Specialisme', type: 'text' }
  ],

  'nl.zorg.ZorgTeam': [
    { name: 'team_name', label: 'Naam Team', type: 'text', placeholder: 'Bijv. Wijkteam Noord' },
    { name: 'members', label: 'Leden', type: 'text', placeholder: 'Namen van betrokkenen' },
    { name: 'start_date', label: 'Startdatum teamzorg', type: 'date' }
  ],

  'nl.zorg.Betaler': [
    { name: 'payer_name', label: 'Verzekeraar', type: 'text' },
    { name: 'insurance_id', label: 'Verzekerdennummer', type: 'text' },
    { 
      name: 'policy_type', label: 'Polis Type', type: 'select', 
      options: [
        { value: 'Basic', label: 'Basisverzekering' },
        { value: 'Supplementary', label: 'Aanvullend' },
        { value: 'Other', label: 'Overig' }
      ] 
    },
    { name: 'start_date', label: 'Startdatum polis', type: 'date' }
  ],
// ===========================================================================
  // GROEP 7: ZELFZORG (Gold Standard 2024)
  // ===========================================================================

  'nl.zorg.Mobiliteit': [
    { 
      name: 'mobility_status', label: 'Mobiliteit', type: 'select', 
      options: [
        { value: 'Lopen', label: 'Zelfstandig lopen' },
        { value: 'Met hulpmiddel', label: 'Lopen met hulpmiddel (stok/rollator)' },
        { value: 'Rolstoel', label: 'Gebruik van rolstoel' },
        { value: 'Bedlegerig', label: 'Bedlegerig' }
      ] 
    },
    { name: 'walking_distance', label: 'Loopafstand', type: 'number', unit: 'meters' },
    { name: 'aid_used', label: 'Hulpmiddel', type: 'text', placeholder: 'Bijv. Vierpootstok' },
    { name: 'start_date', label: 'Ingangsdatum', type: 'date' },
    { name: 'comment', label: 'Toelichting', type: 'text' }
  ],

  'nl.zorg.VermogenTotZichWassen': [
    { 
      name: 'washing_status', label: 'Algemeen wassen', type: 'select', 
      options: [
        { value: 'Onafhankelijk', label: 'Onafhankelijk' },
        { value: 'Hulp nodig', label: 'Hulp nodig' },
        { value: 'Afhankelijk', label: 'Volledig afhankelijk' }
      ] 
    },
    { 
      name: 'washing_upper_body', label: 'Bovenlichaam wassen', type: 'select', 
      options: [
        { value: 'Zelfstandig', label: 'Zelfstandig' },
        { value: 'Hulp nodig', label: 'Hulp nodig' },
        { value: 'Overgenomen', label: 'Wordt gewassen' }
      ] 
    },
    { name: 'aid_used', label: 'Hulpmiddelen', type: 'text', placeholder: 'Douchestoel, lange steel spons' }
  ],

  'nl.zorg.VermogenTotZichKleden': [
    { 
      name: 'dressing_status', label: 'Algemeen kleden', type: 'select', 
      options: [
        { value: 'Onafhankelijk', label: 'Onafhankelijk' },
        { value: 'Hulp nodig', label: 'Hulp nodig' },
        { value: 'Afhankelijk', label: 'Volledig afhankelijk' }
      ] 
    },
    { name: 'comment', label: 'Specifieke problemen', type: 'text', placeholder: 'Bijv. moeite met veters of knopen' }
  ],

  'nl.zorg.VermogenTotToiletgang': [
    { name: 'toileting_status', label: 'Zelfstandigheid toilet', type: 'select', options: [{value:'Onafhankelijk', label:'Onafhankelijk'}, {value:'Hulp nodig', label:'Hulp nodig'}, {value:'Afhankelijk', label:'Afhankelijk'}] },
    { name: 'aid_used', label: 'Hulpmiddelen', type: 'text', placeholder: 'Verhoogd toilet, postoel' }
  ],

  'nl.zorg.VermogenTotEten': [
    { name: 'eating_status', label: 'Zelfstandig eten', type: 'select', options: [{value:'Onafhankelijk', label:'Onafhankelijk'}, {value:'Hulp nodig', label:'Hulp nodig'}, {value:'Afhankelijk', label:'Afhankelijk'}] },
    { name: 'food_preparation', label: 'Eten bereiden (snijden)', type: 'select', options: [{value:'Zelfstandig', label:'Zelfstandig'}, {value:'Hulp nodig', label:'Hulp nodig'}, {value:'Overgenomen', label:'Overgenomen'}] }
  ],

  'nl.zorg.VermogenTotDrinken': [
    { name: 'drinking_status', label: 'Zelfstandig drinken', type: 'select', options: [{value:'Onafhankelijk', label:'Onafhankelijk'}, {value:'Hulp nodig', label:'Hulp nodig'}, {value:'Afhankelijk', label:'Afhankelijk'}] }
  ],

  'nl.zorg.VermogenTotMondverzorging': [
    { name: 'oral_hygiene_status', label: 'Mondverzorging', type: 'select', options: [{value:'Onafhankelijk', label:'Onafhankelijk'}, {value:'Hulp nodig', label:'Hulp nodig'}, {value:'Afhankelijk', label:'Afhankelijk'}] },
    { name: 'denture_care', label: 'Gebitsprothese', type: 'select', options: [{value:'N.v.t.', label:'N.v.t.'}, {value:'Zelfstandig', label:'Zelfstandig'}, {value:'Hulp nodig', label:'Hulp nodig'}, {value:'Overgenomen', label:'Overgenomen'}] }
  ],

  'nl.zorg.VermogenTotZelfstandigMedicatiegebruik': [
    { 
      name: 'medication_management', label: 'Medicatiebeheer', type: 'select', 
      options: [
        { value: 'Zelfstandig', label: 'Volledig zelfstandig' },
        { value: 'Hulp bij klaarzetten', label: 'Hulp bij klaarzetten' },
        { value: 'Hulp bij inname', label: 'Hulp bij inname' },
        { value: 'Volledig afhankelijk', label: 'Wordt volledig toegediend' }
      ] 
    }
  ],

  'nl.zorg.VermogenTotVerpleegtechnischeHandelingen': [
    { name: 'nursing_tasks_status', label: 'Verpleegtechniek', type: 'select', options: [{value:'Zelfstandig', label:'Zelfstandig'}, {value:'Hulp nodig', label:'Hulp onder toezicht'}, {value:'Volledig overgenomen', label:'Volledig overgenomen'}] },
    { name: 'tasks_description', label: 'Welke handelingen?', type: 'text', placeholder: 'Bijv. injecteren insuline, sondevoeding aankoppelen' }
  ],

  'nl.zorg.VermogenTotUiterlijkeVerzorging': [
    { name: 'grooming_status', label: 'Uiterlijk (Scheren/Haar)', type: 'select', options: [{value:'Onafhankelijk', label:'Onafhankelijk'}, {value:'Hulp nodig', label:'Hulp nodig'}, {value:'Afhankelijk', label:'Afhankelijk'}] }
  ],
  
// GROEP 8: SCORELIJSTEN (15 items - Nictiz 2024 Gold Standard)

  'nl.zorg.ApgarScore': [
    { name: 'date_time', label: 'Tijdstip meting', type: 'datetime' },
    { name: 'time_after_birth', label: 'Meetmoment', type: 'select', options: [{value:'1 minute', label:'1 minuut'}, {value:'5 minutes', label:'5 minuten'}, {value:'10 minutes', label:'10 minuten'}] },
    { name: 'appearance', label: 'Kleur (Appearance)', type: 'select', options: [{value:'0', label:'0 - Blauw/Bleek'}, {value:'1', label:'1 - Lichaam roze, extremiteiten blauw'}, {value:'2', label:'2 - Helemaal roze'}] },
    { name: 'pulse', label: 'Hartslag (Pulse)', type: 'select', options: [{value:'0', label:'0 - Afwezig'}, {value:'1', label:'1 - < 100/min'}, {value:'2', label:'2 - > 100/min'}] },
    { name: 'grimace', label: 'Reactie op prikkels (Grimace)', type: 'select', options: [{value:'0', label:'0 - Geen'}, {value:'1', label:'1 - Enige reactie'}, {value:'2', label:'2 - Krachtig huilen/niezen'}] },
    { name: 'activity', label: 'Spiertonus (Activity)', type: 'select', options: [{value:'0', label:'0 - Slap'}, {value:'1', label:'1 - Enige buiging'}, {value:'2', label:'2 - Actieve beweging'}] },
    { name: 'respiration', label: 'Ademhaling (Respiration)', type: 'select', options: [{value:'0', label:'0 - Afwezig'}, {value:'1', label:'1 - Zwak/onregelmatig'}, {value:'2', label:'2 - Goed/huilen'}] },
    { name: 'total_score', label: 'Totaalscore', type: 'number' }
  ],

  'nl.zorg.DOSScore': [
    { name: 'date_time', label: 'Tijdstip', type: 'datetime' },
    { name: 'score_1', label: 'Dozelt weg tijdens gesprek', type: 'select', options: [{value:'0', label:'Nooit'}, {value:'1', label:'Soms/Altijd'}] },
    { name: 'score_2', label: 'Is snel afgeleid', type: 'select', options: [{value:'0', label:'Nooit'}, {value:'1', label:'Soms/Altijd'}] },
    { name: 'score_3', label: 'Heeft extra aandacht voor handeling', type: 'select', options: [{value:'0', label:'Nooit'}, {value:'1', label:'Soms/Altijd'}] },
    { name: 'score_4', label: 'Antwoordt niet op vragen', type: 'select', options: [{value:'0', label:'Nooit'}, {value:'1', label:'Soms/Altijd'}] },
    { name: 'score_5', label: 'Antwoordt traag/onjuist', type: 'select', options: [{value:'0', label:'Nooit'}, {value:'1', label:'Soms/Altijd'}] },
    { name: 'score_6', label: 'Geheugenstoornis', type: 'select', options: [{value:'0', label:'Nooit'}, {value:'1', label:'Soms/Altijd'}] },
    { name: 'score_7', label: 'Desoriëntatie in tijd/plaats', type: 'select', options: [{value:'0', label:'Nooit'}, {value:'1', label:'Soms/Altijd'}] },
    { name: 'score_8', label: 'Plannen niet uitvoeren', type: 'select', options: [{value:'0', label:'Nooit'}, {value:'1', label:'Soms/Altijd'}] },
    { name: 'score_9', label: 'Plukkerig/rusteloos', type: 'select', options: [{value:'0', label:'Nooit'}, {value:'1', label:'Soms/Altijd'}] },
    { name: 'score_10', label: 'Emotioneel labiel', type: 'select', options: [{value:'0', label:'Nooit'}, {value:'1', label:'Soms/Altijd'}] },
    { name: 'score_11', label: 'Hallucinaties', type: 'select', options: [{value:'0', label:'Nooit'}, {value:'1', label:'Soms/Altijd'}] },
    { name: 'total_score', label: 'DOS Totaalscore', type: 'number' }
  ],

  'nl.zorg.BarthelIndex': [
    { name: 'date_time', label: 'Tijdstip', type: 'datetime' },
    { name: 'bowels', label: 'Darmen', type: 'select', options: [{value:'0', label:'0 - Incontinent'}, {value:'5', label:'5 - Ongelukje (1x/p.w.)'}, {value:'10', label:'10 - Continent'}] },
    { name: 'bladder', label: 'Blaas', type: 'select', options: [{value:'0', label:'0 - Incontinent'}, {value:'5', label:'5 - Ongelukje (max 1x/24u)'}, {value:'10', label:'10 - Continent'}] },
    { name: 'grooming', label: 'Uiterlijk', type: 'select', options: [{value:'0', label:'0 - Hulp nodig'}, {value:'5', label:'5 - Zelfstandig'}] },
    { name: 'toilet_use', label: 'Toiletgebruik', type: 'select', options: [{value:'0', label:'0 - Afhankelijk'}, {value:'5', label:'5 - Enige hulp'}, {value:'10', label:'10 - Zelfstandig'}] },
    { name: 'feeding', label: 'Eten', type: 'select', options: [{value:'0', label:'0 - Afhankelijk'}, {value:'5', label:'5 - Hulp (bijv. snijden)'}, {value:'10', label:'10 - Zelfstandig'}] },
    { name: 'transfer', label: 'Transfer (bed/stoel)', type: 'select', options: [{value:'0', label:'0 - Onmogelijk'}, {value:'5', label:'5 - Veel hulp'}, {value:'10', label:'10 - Weinig hulp'}, {value:'15', label:'15 - Zelfstandig'}] },
    { name: 'mobility', label: 'Mobiliteit', type: 'select', options: [{value:'0', label:'0 - Immobiel'}, {value:'5', label:'5 - Rolstoel'}, {value:'10', label:'10 - Hulp bij lopen'}, {value:'15', label:'15 - Zelfstandig'}] },
    { name: 'dressing', label: 'Kleden', type: 'select', options: [{value:'0', label:'0 - Afhankelijk'}, {value:'5', label:'5 - Hulp nodig'}, {value:'10', label:'10 - Zelfstandig'}] },
    { name: 'stairs', label: 'Trappen lopen', type: 'select', options: [{value:'0', label:'0 - Onmogelijk'}, {value:'5', label:'5 - Hulp nodig'}, {value:'10', label:'10 - Zelfstandig'}] },
    { name: 'bathing', label: 'Wassen/Douchen', type: 'select', options: [{value:'0', label:'0 - Afhankelijk'}, {value:'5', label:'5 - Zelfstandig'}] },
    { name: 'total_score', label: 'Barthel Totaalscore', type: 'number' }
  ],

  'nl.zorg.GlasgowComaScale': [
    { name: 'date_time', label: 'Tijdstip', type: 'datetime' },
    { name: 'eye_score', label: 'Ogen (E)', type: 'select', options: [{value:'1', label:'1 - Geen reactie'}, {value:'2', label:'2 - Bij pijnprikkel'}, {value:'3', label:'3 - Bij toespreken'}, {value:'4', label:'4 - Spontaan'}] },
    { name: 'motor_score', label: 'Motoriek (M)', type: 'select', options: [{value:'1', label:'1 - Geen'}, {value:'2', label:'2 - Strekken (pijn)'}, {value:'3', label:'3 - Buigen (pijn)'}, {value:'4', label:'4 - Terugtrekken (pijn)'}, {value:'5', label:'5 - Lokaliseren (pijn)'}, {value:'6', label:'6 - Voert opdrachten uit'}] },
    { name: 'verbal_score', label: 'Spraak (V)', type: 'select', options: [{value:'1', label:'1 - Geen'}, {value:'2', label:'2 - Onbegrijpelijk'}, {value:'3', label:'3 - Inadequaat'}, {value:'4', label:'4 - Verward'}, {value:'5', label:'5 - Georiënteerd'}] },
    { name: 'total_score', label: 'GCS Totaal', type: 'number' }
  ],

  'nl.zorg.MUSTScore': [
    { name: 'date_time', label: 'Tijdstip', type: 'datetime' },
    { name: 'bmi_score', label: 'BMI Score', type: 'select', options: [{value:'0', label:'0 - BMI > 20'}, {value:'1', label:'1 - BMI 18.5-20'}, {value:'2', label:'2 - BMI < 18.5'}] },
    { name: 'weight_loss_score', label: 'Gewichtsverlies (3-6 mnd)', type: 'select', options: [{value:'0', label:'0 - < 5%'}, {value:'1', label:'1 - 5-10%'}, {value:'2', label:'2 - > 10%'}] },
    { name: 'illness_score', label: 'Acute ziekte score', type: 'select', options: [{value:'0', label:'0 - Nee'}, {value:'2', label:'2 - Ja'}] },
    { name: 'total_score', label: 'MUST Totaal', type: 'number' }
  ],

  'nl.zorg.TNMTumorClassificatie': [
    { name: 'date_time', label: 'Vaststellingsdatum', type: 'datetime' },
    { name: 'tnm_version', label: 'TNM Editie', type: 'text', placeholder: 'Bijv. 8e editie' },
    { name: 'tumor_stage', label: 'T (Tumor)', type: 'text', placeholder: 'T0, T1, T2...' },
    { name: 'node_stage', label: 'N (Lymfeklier)', type: 'text', placeholder: 'N0, N1, N2...' },
    { name: 'metastasis_stage', label: 'M (Metastase)', type: 'text', placeholder: 'M0, M1' },
    { name: 'stage_grouping', label: 'Stadium', type: 'text', placeholder: 'Stadium I, II...' }
  ],

  'nl.zorg.StrongKidsScore': [
    { name: 'date_time', label: 'Tijdstip', type: 'datetime' },
    { name: 'subjective_assessment', label: 'Slechte voedingstoestand', type: 'select', options: [{value:'0', label:'Nee'}, {value:'1', label:'Ja'}] },
    { name: 'high_risk_disease', label: 'Hoog risico ziekte', type: 'select', options: [{value:'0', label:'Nee'}, {value:'2', label:'Ja'}] },
    { name: 'nutritional_intake', label: 'Verminderde inname/verlies', type: 'select', options: [{value:'0', label:'Nee'}, {value:'1', label:'Ja'}] },
    { name: 'weight_loss', label: 'Gewichtsverlies/stilstand', type: 'select', options: [{value:'0', label:'Nee'}, {value:'1', label:'Ja'}] },
    { name: 'total_score', label: 'StrongKids Totaal', type: 'number' }
  ],
// ===========================================================================
  // GROEP 9: PROCES PATRONEN (Gold Standard 2024)
  // ===========================================================================

  'nl.zorg.AanvraagGegevens': [
    { name: 'request_id', label: 'Aanvraag ID', type: 'text' },
    { name: 'requester', label: 'Aangevraagd door', type: 'text' },
    { name: 'request_date_time', label: 'Aanvraagmoment', type: 'datetime' },
    { 
      name: 'priority', label: 'Urgentie', type: 'select', 
      options: [
        { value: 'Routine', label: 'Routine' },
        { value: 'Urgent', label: 'Spoed' },
        { value: 'Emergency', label: 'Levensbedreigend' }
      ] 
    },
    { name: 'indication', label: 'Vraagstelling', type: 'text' }
  ],

  'nl.zorg.AfnameGegevens': [
    { name: 'collection_date_time', label: 'Afnametijdstip', type: 'datetime' },
    { name: 'collector', label: 'Afgenomen door', type: 'text' },
    { name: 'collection_method', label: 'Methode', type: 'text', placeholder: 'Bijv. Venapunctie' },
    { name: 'container_id', label: 'Buis/Container ID', type: 'text' }
  ],

  'nl.zorg.RegistratieGegevens': [
    { name: 'author', label: 'Vastgelegd door', type: 'text' },
    { name: 'registration_date_time', label: 'Moment van vastlegging', type: 'datetime' },
    { 
      name: 'verification_status', label: 'Registratiestatus', type: 'select', 
      options: [
        { value: 'Preliminary', label: 'Voorlopig' },
        { value: 'Final', label: 'Definitief' },
        { value: 'Corrected', label: 'Gecorrigeerd' }
      ] 
    },
    { name: 'source', label: 'Bron van informatie', type: 'text' }
  ],
// ===========================================================================
  // GROEP 10: SUBBOUWSTENEN (Gold Standard 2024)
  // ===========================================================================

  'nl.zorg.Naamgegevens': [
    { name: 'given_name', label: 'Voornaam', type: 'text' },
    { name: 'surname_prefix', label: 'Tussenv.', type: 'text' },
    { name: 'surname', label: 'Achternaam', type: 'text' },
    { 
      name: 'preferred_name_usage', label: 'Naamgebruik', type: 'select', 
      options: [
        { value: 'Own surname', label: 'Eigen achternaam' },
        { value: 'Partner surname', label: 'Naam partner' },
        { value: 'Partner then own', label: 'Partner dan eigen' },
        { value: 'Own then partner', label: 'Eigen dan partner' }
      ] 
    }
  ],

  'nl.zorg.Adresgegevens': [
    { name: 'street', label: 'Straatnaam', type: 'text' },
    { name: 'house_number', label: 'Huisnr', type: 'text' },
    { name: 'postal_code', label: 'Postcode', type: 'text', placeholder: '1234AB' },
    { name: 'city', label: 'Plaats', type: 'text' },
    { name: 'address_type', label: 'Type adres', type: 'select', options: [{value:'Residential', label:'Woonadres'}, {value:'Work', label:'Werk'}, {value:'Temporary', label:'Tijdelijk'}]}
  ],

  'nl.zorg.GebruiksInstructie': [
    { name: 'dose_text', label: 'Instructie', type: 'text', placeholder: '1 dd 1 tablet' },
    { name: 'route_of_administration', label: 'Toedieningsweg', type: 'text', placeholder: 'Oraal, IV, etc.' },
    { name: 'as_needed', label: 'Zo nodig?', type: 'boolean' }
  ],

  'nl.zorg.TijdsInterval': [
    { name: 'start_date_time', label: 'Start', type: 'datetime' },
    { name: 'end_date_time', label: 'Eind', type: 'datetime' },
    { name: 'duration_value', label: 'Duur', type: 'number' }
  ],  

// ===========================================================================
  // GROEP 11: NARRATIEVE VERSLAGLEGGING (UI Config)
  // ===========================================================================

  'nl.zorg.Anamnese': [
    { name: 'anamnesis_text', label: 'Anamnese / Reden van komst', type: 'text', placeholder: 'Klachtenpresentatie, voorgeschiedenis, tractus anamnese...' },
    { name: 'date', label: 'Datum', type: 'date' },
    { name: 'informant', label: 'Informant', type: 'select', options: [{value: 'patient', label: 'Patiënt'}, {value: 'partner', label: 'Partner'}, {value: 'parent', label: 'Ouder/Verzorger'}] }
  ],

  'nl.zorg.LichamelijkOnderzoek': [
    { name: 'examination_text', label: 'Bevindingen LO', type: 'text', placeholder: 'Inspectie, auscultatie, percussie, palpatie...' },
    { name: 'localization', label: 'Specifieke Locatie', type: 'text', placeholder: 'Bijv. Linker knie' },
    { name: 'examination_date', label: 'Datum onderzoek', type: 'date' }
  ],

  'nl.zorg.Evaluatie': [
    { name: 'evaluation_text', label: 'Conclusie / Diagnose', type: 'text', placeholder: 'Samenvattende conclusie...' },
    { name: 'dd_text', label: 'Differentiaal Diagnose', type: 'text', placeholder: 'Overwegingen...' },
    { name: 'status', label: 'Status', type: 'select', options: [{value: 'preliminary', label: 'Voorlopig'}, {value: 'final', label: 'Definitief'}] }
  ],

  'nl.zorg.Beleid': [
    { name: 'policy_text', label: 'Beleid & Plan', type: 'text', placeholder: 'Therapie, medicatiewijzigingen, instructies...' },
    { name: 'follow_up_date', label: 'Vervolgdatum', type: 'date' }
  ],

  'nl.zorg.Decursus': [
    { name: 'progress_note', label: 'Decursus', type: 'text', placeholder: 'Voortgangsverslag...' },
    { name: 'contact_type', label: 'Type Contact', type: 'select', options: [{value: 'visit', label: 'Fysiek Consult'}, {value: 'call', label: 'Telefonisch'}, {value: 'e-consult', label: 'E-Consult'}] }
  ],

  'nl.zorg.PoliklinischConsult': [
    { name: 'anamnese', label: 'Anamnese', type: 'text', placeholder: 'Klachten en voorgeschiedenis...' },
    { name: 'lichamelijk_onderzoek', label: 'Lichamelijk Onderzoek', type: 'text', placeholder: 'Bevindingen...' },
    { name: 'aanvullend_onderzoek', label: 'Aanvullend Onderzoek', type: 'text', placeholder: 'Labs, imaging...' },
    { name: 'conclusie', label: 'Conclusie', type: 'text', placeholder: 'Diagnose en interpretatie...' },
    { name: 'beleid', label: 'Beleid', type: 'text', placeholder: 'Behandelplan...' },
    { name: 'specialisme', label: 'Specialisme', type: 'text', placeholder: 'bijv. Cardiologie' },
    { name: 'contact_type', label: 'Type Consult', type: 'select', options: [
      { value: 'Eerste poliklinisch consult', label: 'Eerste poliklinisch consult' },
      { value: 'Vervolg consult', label: 'Vervolg consult' },
      { value: 'Dagbehandeling', label: 'Dagbehandeling' },
      { value: 'Telefonisch consult', label: 'Telefonisch consult' }
    ]},
    { name: 'consult_date', label: 'Consult Datum', type: 'datetime' }
  ],

  'nl.zorg.DBCDeclaratie': [
    { name: 'dbc_code', label: 'DBC Code', type: 'text', placeholder: 'bijv. 0302-03000-0100001' },
    { name: 'care_type', label: 'Zorgtype', type: 'text', placeholder: 'Eerste consult / Vervolg' },
    { name: 'icd10_codes', label: 'ICD-10 Codes', type: 'text', placeholder: 'Komma gescheiden, bijv. I10, E11.9' },
    { name: 'procedures', label: 'Verrichtingen', type: 'text', placeholder: 'Komma gescheiden' },
    { name: 'consult_date', label: 'Datum', type: 'datetime' },
    { name: 'duration_minutes', label: 'Duur', type: 'number', unit: 'minuten' }
  ]
}
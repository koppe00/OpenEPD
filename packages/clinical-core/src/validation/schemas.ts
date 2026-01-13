// --- Schema bestand met ZIB 2024 publicatie: ---
// --- Metingen: Alle vitale parameters en fysieke maten. ---
// --- Klinische Context: Diagnoses, allergieën en risico's. ---
// --- Behandeling & Proces: Verrichtingen, doelen en ethiek. ---
// --- Medicatie: De volledige MP 9.x cyclus. ---
// --- Sociaal & Leefstijl: Omgeving en gewoontes. ---
// --- Administratief & Persoon: Identificatie en netwerk. ---
// --- Scorelijsten: Gevalideerde meetinstrumenten (SNAQ, GCS, etc.). ---
// --- Zelfzorg & Hulpmiddelen: Autonomie en ondersteuning. ---

// packages/clinical-core/src/schemas.ts
import { z } from 'zod';

// GROEP 1: METINGEN (15 items - Compleet)
export const Metingen = {
  
  // 1. Ademhaling (v3.2)
  'nl.zorg.Ademhaling': z.object({
    respiratory_rate: z.number().min(0).max(100).describe("Ademfrequentie (/min)"),
    rhythm: z.enum(['Regular', 'Irregular', 'Cheyne-Stokes', 'Kussmaul', 'Gasps']).optional().describe("Ademhalingspatroon"),
    depth: z.enum(['Normal', 'Deep', 'Shallow']).optional().describe("Diepte"),
    extra_oxygen_administration: z.boolean().default(false).describe("Extra zuurstof toediening")
  }),

  // 2. O2Saturatie (v4.0)
  'nl.zorg.O2Saturatie': z.object({
    spo2: z.number().min(0).max(100).describe("Saturatie (%)"),
    measurement_method: z.enum(['Pulse oximetry', 'Arterial blood gas']).default('Pulse oximetry').describe("Meetmethode"),
    probe_location: z.enum(['Finger', 'Toe', 'Ear', 'Forehead']).optional().describe("Probe locatie"),
    alarm_limits: z.string().optional().describe("Alarmgrenzen")
  }),

  // 3. Bloeddruk (v5.1)
  'nl.zorg.Bloeddruk': z.object({
    systolic: z.number().min(0).max(300).describe("Systolische druk (mmHg)"),
    diastolic: z.number().min(0).max(200).describe("Diastolische druk (mmHg)"),
    mean_arterial_pressure: z.number().optional().describe("Gemiddelde druk (MAP)"),
    position: z.enum(['Sitting', 'Lying', 'Standing', 'Left lateral', 'Right lateral']).default('Sitting').describe("Houding"),
    cuff_size: z.enum(['Small', 'Standard', 'Large', 'Thigh', 'Extra large']).optional().describe("Manchetmaat"),
    measurement_method: z.enum(['Invasive', 'Non-invasive']).default('Non-invasive').describe("Meetmethode"),
    measurement_location: z.enum(['Right arm', 'Left arm', 'Right leg', 'Left leg']).optional().describe("Locatie")
  }),

  // 4. Lichaamsgewicht (v4.0.1)
  'nl.zorg.Lichaamsgewicht': z.object({
    weight_value: z.number().min(0).max(600).describe("Gewicht (kg)"),
    clothing_status: z.enum(['Undressed', 'Lightly dressed', 'Fully dressed', 'Diaper']).default('Lightly dressed').describe("Kleding"),
    measurement_method: z.enum(['Standing', 'Sitting', 'Lying', 'Estimated']).default('Standing').describe("Methode")
  }),

  // 5. Lichaamslengte (v3.1.2)
  'nl.zorg.Lichaamslengte': z.object({
    length_value: z.number().min(0).max(280).describe("Lengte (cm)"),
    position: z.enum(['Standing', 'Lying']).default('Standing').describe("Houding"),
    measurement_method: z.enum(['Measured', 'Estimated', 'Reported']).default('Measured').describe("Methode")
  }),

  // 6. Lichaamstemperatuur (v3.1.2)
  'nl.zorg.Lichaamstemperatuur': z.object({
    temperature_value: z.number().min(20).max(45).describe("Temperatuur (°C)"),
    location: z.enum(['Tympanic', 'Oral', 'Rectal', 'Axillary', 'Forehead', 'Bladder', 'Esophageal', 'Inguinal', 'Temporal artery']).default('Tympanic').describe("Locatie")
  }),

  // 7. Schedelomvang (v1.3)
  'nl.zorg.Schedelomvang': z.object({
    head_circumference: z.number().min(10).max(100).describe("Schedelomvang (cm)"),
    measurement_method: z.enum(['Tape measure', 'Ultrasound']).default('Tape measure').describe("Methode")
  }),

  // 8. Polsfrequentie (v3.3) - Palpabel (voelbaar)
  'nl.zorg.Polsfrequentie': z.object({
    pulse_rate: z.number().min(0).max(300).describe("Polsfrequentie (/min)"),
    regularity: z.enum(['Regular', 'Irregular', 'Regularly Irregular', 'Irregularly Irregular']).default('Regular').describe("Regelmaat"),
    measurement_method: z.enum(['Palpation', 'Auscultation']).default('Palpation').describe("Methode")
  }),

  // 9. Hartfrequentie (v3.4.1) - Monitor/ECG (elektrisch/mechanisch)
  'nl.zorg.Hartfrequentie': z.object({
    heart_rate: z.number().min(0).max(300).describe("Hartfrequentie (/min)"),
    measurement_method: z.enum(['Monitor', 'ECG', 'Pulse oximetry', 'Implantable device', 'Auscultation']).default('Monitor').describe("Bron"),
  }),

  // 10. LaboratoriumUitslag (v7.1)
  'nl.zorg.LaboratoriumUitslag': z.object({
    test_code: z.string().min(1).describe("Test Code (LOINC/NHG)"),
    result_value: z.number().optional().describe("Numerieke Uitslag"),
    result_unit: z.string().optional().describe("Eenheid"),
    result_text: z.string().optional().describe("Tekstuele Uitslag"),
    status: z.enum(['Preliminary', 'Final', 'Corrected', 'Entered in error']).default('Final').describe("Status"),
    reference_range_low: z.number().optional().describe("Ondergrens"),
    reference_range_high: z.number().optional().describe("Bovengrens"),
    abnormality_flag: z.enum(['Normal', 'High', 'Low', 'Abnormal']).optional().describe("Interpretatie")
  }),

  // 11. TekstUitslag (v4.4) - Voor uitslagen die niet in lab-formaat passen
  'nl.zorg.TekstUitslag': z.object({
    test_name: z.string().min(1).describe("Naam onderzoek"),
    result_text: z.string().min(1).describe("Uitslag (Tekst)"),
    status: z.enum(['Preliminary', 'Final', 'Corrected']).default('Final').describe("Status"),
    effective_date: z.string().datetime().describe("Datum onderzoek")
  }),

  // 12. Visus (v2.2) - Gezichtsscherpte
  'nl.zorg.Visus': z.object({
    visual_acuity: z.number().min(0).max(2.0).describe("Visus (Decimaal)"),
    eye: z.enum(['Left', 'Right', 'Both']).default('Both').describe("Oog"),
    correction: z.enum(['None', 'Glasses', 'Contact lenses', 'Pinhole']).default('None').describe("Correctie"),
    measurement_method: z.enum(['Snellen', 'E-chart', 'Landolt-C', 'ETDRS']).default('Snellen').describe("Kaart")
  }),

  // 13. Refractie (v2.0) - Oogmeting
  'nl.zorg.Refractie': z.object({
    eye: z.enum(['Left', 'Right']).describe("Oog"),
    sphere: z.number().describe("Sfeer (S)"),
    cylinder: z.number().optional().describe("Cilinder (C)"),
    axis: z.number().min(0).max(180).optional().describe("As (graden)"),
    prism: z.number().optional().describe("Prisma"),
    vertex_distance: z.number().optional().describe("Vertex afstand (mm)")
  }),

  // 14. DAS (v1.1) - Disease Activity Score (Reuma)
  'nl.zorg.DAS': z.object({
    das28_score: z.number().min(0).max(10).describe("DAS28 Score"),
    tender_joint_count: z.number().min(0).max(28).describe("Pijnlijke gewrichten (0-28)"),
    swollen_joint_count: z.number().min(0).max(28).describe("Gezwollen gewrichten (0-28)"),
    general_health_vas: z.number().min(0).max(100).describe("Algemene gezondheid (VAS 0-100)"),
    method: z.enum(['DAS28-ESR', 'DAS28-CRP']).default('DAS28-CRP').describe("Rekenmethode")
  }),

  // 15. Vochtbalans (v1.0.1)
  'nl.zorg.Vochtbalans': z.object({
    total_input: z.number().optional().describe("Totaal in (ml)"),
    total_output: z.number().optional().describe("Totaal uit (ml)"),
    balance: z.number().optional().describe("Balans (ml)"),
    start_time: z.string().datetime().describe("Start meetperiode"),
    end_time: z.string().datetime().describe("Eind meetperiode")
  })
};

/// --- GROEP: KLINISCHE CONTEXT (Diagnoses, Risico's & Allergieën) ---
// packages/clinical-core/src/schemas.ts
// GROEP 2: KLINISCHE CONTEXT (33 items - Nictiz 2024 Strict Compliance)

export const KlinischeContext = {

  // --- 1. PROBLEMEN & DIAGNOSES ---
  'nl.zorg.AandoeningOfGesteldheid': z.object({
    problem_name: z.string().min(1).describe("Naam aandoening"),
    problem_type: z.enum(['Diagnosis', 'Symptom', 'Finding', 'Complaint', 'Functional limitation', 'Complication']).default('Diagnosis').describe("ProbleemType"),
    clinical_status: z.enum(['Active', 'Inactive', 'Resolved', 'Relapse']).default('Active').describe("KlinischeStatus"),
    verification_status: z.enum(['Suspected', 'Probable', 'Confirmed', 'Refuted']).default('Confirmed').describe("VerificatieStatus"),
    onset_date: z.string().datetime().optional().describe("DatumAanvang"),
    end_date: z.string().datetime().optional().describe("DatumEinde"), // Toegevoegd
    anatomical_location: z.string().optional().describe("AnatomischeLocatie"), // Toegevoegd
    laterality: z.enum(['Left', 'Right', 'Bilateral', 'Unilateral']).optional().describe("Lateraliteit"),
    comment: z.string().optional().describe("Toelichting") // Toegevoegd
  }),
  'nl.zorg.Diagnose': z.object({
    diagnosis_code: z.string().min(1).describe("DiagnoseCode (ICPC/ICD10)"),
    diagnosis_type: z.string().optional().describe("DiagnoseType"),
    date: z.string().datetime().describe("DiagnoseDatum"),
    anatomical_location: z.string().optional().describe("Locatie"), // Toegevoegd
    laterality: z.enum(['Left', 'Right', 'Bilateral']).optional().describe("Lateraliteit") // Toegevoegd
  }),
  'nl.zorg.Symptoom': z.object({
    symptom_name: z.string().min(1).describe("SymptoomNaam"),
    date: z.string().datetime().describe("Datum"),
    severity: z.enum(['Light', 'Moderate', 'Severe']).optional().describe("Ernst"), // Toegevoegd
    comment: z.string().optional().describe("Toelichting")
  }),
  'nl.zorg.VerpleegkundigeDiagnose': z.object({
    diagnosis_name: z.string().min(1).describe("Titel (NANDA)"),
    status: z.enum(['Active', 'Resolved']).default('Active').describe("Status"),
    etiology: z.string().optional().describe("Etiologie (Oorzaak)"), // Toegevoegd
    signs_symptoms: z.string().optional().describe("Kenmerken (PES)"), // Toegevoegd
    date: z.string().datetime().describe("DatumVaststelling")
  }),

  // --- 2. ALLERGIEËN & ALERTS ---
  'nl.zorg.OvergevoeligheidIntolerantie': z.object({
    causative_agent: z.string().min(1).describe("VeroorzakendeStof"),
    category: z.enum(['Food', 'Medication', 'Environment', 'Biologic', 'Other']).default('Medication').describe("Categorie"),
    criticality: z.enum(['Low', 'High', 'Unable to assess']).default('Low').describe("MateVanKritiekZijn"),
    severity: z.enum(['Mild', 'Moderate', 'Severe']).optional().describe("Ernst"), // Toegevoegd (naast criticality)
    reaction_description: z.string().optional().describe("ReactieBeschrijving"),
    onset_date: z.string().datetime().optional().describe("DatumBegin")
  }),
  'nl.zorg.Alert': z.object({
    alert_name: z.string().min(1).describe("AlertNaam"),
    alert_type: z.enum(['Condition', 'Social', 'Behavioral']).default('Condition').describe("AlertType"),
    start_date: z.string().datetime().describe("DatumBegin"),
    end_date: z.string().datetime().optional().describe("DatumEind"), // Toegevoegd
    comment: z.string().optional().describe("Toelichting")
  }),
  'nl.zorg.Signalering': z.object({
    signal_type: z.string().min(1).describe("TypeSignalering"),
    description: z.string().optional().describe("Omschrijving"),
    date: z.string().datetime().describe("Datum")
  }),
  'nl.zorg.Uitsluiting': z.object({
    excluded_item: z.string().min(1).describe("UitgeslotenAandoening"),
    date: z.string().datetime().describe("Datum"),
    author: z.string().optional().describe("Vastlegger")
  }),

  // --- 3. WONDEN & HUID (Complex!) ---
  'nl.zorg.Wond': z.object({
    wound_type: z.enum(['Surgical', 'Traumatic', 'Pressure ulcer', 'Burn', 'Oncological', 'Diabetic ulcer', 'Venous ulcer', 'Arterial ulcer']).default('Surgical').describe("WondSoort"),
    anatomical_location: z.string().describe("Locatie"),
    onset_date: z.string().datetime().optional().describe("OntstaanDatum"), // Toegevoegd
    length_value: z.number().optional().describe("Lengte (cm)"),
    width_value: z.number().optional().describe("Breedte (cm)"),
    depth_value: z.number().optional().describe("Diepte (cm)"),
    wound_tissue: z.enum(['Necrotic', 'Sloughy', 'Granulating', 'Epithelializing', 'Infected']).optional().describe("Wondweefsel"), // Toegevoegd (Wondbed)
    exudate: z.enum(['None', 'Light', 'Moderate', 'Heavy']).optional().describe("Vochtproductie"), // Toegevoegd
    comment: z.string().optional().describe("Toelichting")
  }),
  'nl.zorg.DecubitusWond': z.object({
    category: z.enum(['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'DTI', 'Unstageable']).describe("DecubitusCategorie"),
    anatomical_location: z.string().describe("Locatie"),
    length_value: z.number().optional().describe("Lengte (cm)"),
    width_value: z.number().optional().describe("Breedte (cm)"),
    date_last_change: z.string().datetime().optional().describe("DatumLaatsteWissel")
  }),
  'nl.zorg.Brandwond': z.object({
    extent_percentage: z.number().min(0).max(100).describe("TotaalPercentage (TBSA)"),
    depth: z.enum(['First degree', 'Second degree superficial', 'Second degree deep', 'Third degree']).describe("Diepte"),
    anatomical_location: z.string().describe("Locatie") // Toegevoegd
  }),
  'nl.zorg.Huidaandoening': z.object({
    condition_name: z.string().describe("AandoeningNaam"),
    anatomical_location: z.string().describe("Locatie"),
    description: z.string().optional().describe("Beschrijving"),
    onset_date: z.string().datetime().optional().describe("DatumOntstaan")
  }),

  // --- 4. LIJNEN & HULPMIDDELEN ---
  'nl.zorg.Infuus': z.object({
    catheter_type: z.enum(['Peripheral', 'Central', 'Port-a-cath', 'PICC', 'Arterial']).default('Peripheral').describe("TypeLijn"),
    location: z.string().describe("Locatie"),
    insertion_date: z.string().datetime().describe("DatumInbrengen"),
    removal_date: z.string().datetime().optional().describe("DatumVerwijderen"), // Toegevoegd
    lumen_count: z.number().min(1).max(5).default(1).describe("AantalLumen"),
    dressing_date: z.string().datetime().optional().describe("DatumVerzorging") // Toegevoegd
  }),
  'nl.zorg.SondeSysteem': z.object({
    probe_type: z.enum(['Nasogastric', 'Nasoduodenal', 'PEG', 'Suprapubic']).default('Nasogastric').describe("TypeSonde"),
    insertion_date: z.string().datetime().describe("DatumInbrengen"),
    removal_date: z.string().datetime().optional().describe("DatumVerwijderen"), // Toegevoegd
    gauge: z.number().optional().describe("Dikte (Charriere)"),
    insertion_length: z.number().optional().describe("IngebrachteLengte (cm)") // Toegevoegd
  }),
  'nl.zorg.Stoma': z.object({
    stoma_type: z.enum(['Colostomy', 'Ileostomy', 'Urostomy', 'Tracheostomy']).describe("StomaType"),
    location: z.string().describe("Locatie"),
    insertion_date: z.string().datetime().optional().describe("DatumAanleg"),
    material: z.string().optional().describe("Materiaal") // Toegevoegd
  }),
  'nl.zorg.MedischHulpmiddel': z.object({
    product_name: z.string().describe("ProductNaam"),
    product_type: z.string().describe("ProductType"),
    start_date: z.string().datetime().optional().describe("DatumBegin"),
    end_date: z.string().datetime().optional().describe("DatumEind"), // Toegevoegd
    indication: z.string().optional().describe("Indicatie") // Toegevoegd
  }),

  // --- 5. FUNCTIES ---
  'nl.zorg.FunctieHoren': z.object({
    status: z.enum(['Good', 'Impaired', 'Deaf']).describe("Status"),
    aid_used: z.boolean().default(false).describe("HulpmiddelGebruikt"),
    comment: z.string().optional().describe("Toelichting")
  }),
  'nl.zorg.FunctieZien': z.object({
    status: z.enum(['Good', 'Impaired', 'Blind']).describe("Status"),
    aid_used: z.boolean().default(false).describe("HulpmiddelGebruikt"),
    comment: z.string().optional().describe("Toelichting")
  }),
  'nl.zorg.Blaasfunctie': z.object({
    continence_status: z.enum(['Continent', 'Incontinent', 'Catheter', 'Urostomy']).describe("Status"),
    incontinence_frequency: z.enum(['Daily', 'Weekly', 'Occasionally']).optional().describe("Frequentie"),
    aid_used: z.boolean().default(false).describe("IncontinentieMateriaal") // Toegevoegd
  }),
  'nl.zorg.Darmfunctie': z.object({
    continence_status: z.enum(['Continent', 'Incontinent', 'Stoma']).describe("Status"),
    last_defecation_date: z.string().datetime().optional().describe("LaatsteDefaecatie"),
    color: z.string().optional().describe("Kleur") // Toegevoegd
  }),
  'nl.zorg.FunctioneleOfMentaleStatus': z.object({
    status_name: z.string().describe("NaamStatus"),
    value: z.string().describe("Waarde"),
    date: z.string().datetime().describe("Datum")
  }),
  'nl.zorg.Pijnkenmerken': z.object({
    pain_location: z.string().describe("Locatie"),
    radiation: z.string().optional().describe("Uitstraling"),
    pain_type: z.enum(['Nociceptive', 'Neuropathic', 'Visceral']).optional().describe("PijnSoort"),
    provoking_factors: z.string().optional().describe("Provocatie") // Toegevoegd
  }),

  // --- 6. VERSLAGEN ---
  'nl.zorg.SOEPVerslag': z.object({
    date: z.string().datetime().describe("Datum"),
    subjective: z.string().optional().describe("Subjectief"),
    objective: z.string().optional().describe("Objectief"),
    evaluation: z.string().optional().describe("Evaluatie"),
    plan: z.string().optional().describe("Plan"),
    author: z.string().optional().describe("Auteur") // Toegevoegd
  }),
  'nl.zorg.ContactVerslag': z.object({
    date: z.string().datetime().describe("Datum"),
    contact_type: z.enum(['Consultation', 'Visit', 'Phone', 'Email', 'Video']).default('Consultation').describe("ContactType"),
    notes: z.string().describe("Verslag"),
    author: z.string().optional().describe("Auteur")
  }),
  'nl.zorg.ZorgEpisode': z.object({
    episode_name: z.string().describe("NaamEpisode"),
    start_date: z.string().datetime().describe("DatumBegin"),
    end_date: z.string().datetime().optional().describe("DatumEind") // Toegevoegd
  }),
  'nl.zorg.Patientbespreking': z.object({
    discussion_type: z.enum(['MDO', 'Handover', 'Consult']).describe("BesprekingType"),
    outcome: z.string().describe("Uitkomst"),
    date: z.string().datetime().describe("Datum"),
    attendees: z.string().optional().describe("Aanwezigen") // Toegevoegd
  }),
  'nl.zorg.BewakingBesluit': z.object({
    decision: z.string().describe("Besluit"),
    start_date: z.string().datetime().describe("DatumBegin"),
    end_date: z.string().datetime().optional().describe("DatumEind") // Toegevoegd
  }),

  // --- 7. ZWANGERSCHAP & KIND ---
  'nl.zorg.Zwangerschap': z.object({
    due_date: z.string().datetime().optional().describe("DatumATerme"),
    gravidity: z.number().min(1).optional().describe("Graviditeit (G)"),
    parity: z.number().min(0).optional().describe("Pariteit (P)"),
    status: z.enum(['Current', 'Completed', 'Aborted']).default('Current').describe("Status"),
    multiple_birth: z.boolean().default(false).describe("Meerling") // Toegevoegd
  }),
  'nl.zorg.OntwikkelingKind': z.object({
    milestone: z.string().describe("Mijlpaal (Van Wiechen)"),
    status: z.enum(['Achieved', 'Not yet', 'Assistance needed']).describe("Status"),
    date: z.string().datetime().describe("DatumObservatie"),
    comment: z.string().optional().describe("Toelichting")
  }),
  'nl.zorg.VoedingspatroonZuigeling': z.object({
    feeding_type: z.enum(['Breastfeeding', 'Formula', 'Mixed']).describe("VoedingType"),
    frequency: z.number().optional().describe("Frequentie (keer/dag)"),
    quantity_per_feed: z.number().optional().describe("HoeveelheidPerVoeding (ml)") // Toegevoegd
  }),

  // --- 8. OVERIG ---
  'nl.zorg.Vaccinatie': z.object({
    product_name: z.string().describe("ProductNaam"),
    administration_date: z.string().datetime().describe("DatumToediening"),
    dose: z.string().optional().describe("Dosis"),
    batch_number: z.string().optional().describe("Batchnummer"), // Toegevoegd (Essentieel)
    performer: z.string().optional().describe("Uitvoerende") // Toegevoegd
  }),
  'nl.zorg.Voedingsadvies': z.object({
    advice_text: z.string().describe("AdviesTekst"),
    type: z.enum(['Energy enriched', 'Protein enriched', 'Salt restricted', 'Fluid restricted', 'Allergen free']).optional().describe("DieetType"),
    start_date: z.string().datetime().optional().describe("DatumBegin") // Toegevoegd
  }),
  'nl.zorg.Reactie': z.object({
    reaction_text: z.string().describe("Reactie"),
    date: z.string().datetime().describe("Datum"),
    clinician: z.string().optional().describe("Zorgverlener") // Toegevoegd
  })
};

// GROEP 3: BEHANDELING & PROCES (7 items - Nictiz 2024 Gold Standard)
export const BehandelingEnProces = {

  // 1. BehandelAanwijzing2 (v2.1) - Cruciaal voor DNR/Behandelbeperkingen
  'nl.zorg.BehandelAanwijzing2': z.object({
    treatment_type: z.enum(['Resuscitation', 'Intubation', 'Artificial ventilation', 'Defibrillation', 'Admission to ICU', 'Surgery', 'Blood transfusion']).describe("Behandeling"),
    permission: z.enum(['Yes', 'No', 'With limitations']).describe("Toestemming"),
    limitations: z.string().optional().describe("Beperkingen"),
    verified_with: z.enum(['Patient', 'Representative', 'Physician']).optional().describe("GeverifieerdBij"),
    start_date: z.string().datetime().describe("Ingangsdatum"),
    end_date: z.string().datetime().optional().describe("Einddatum"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 2. Behandeldoel (v4.0)
  'nl.zorg.Behandeldoel': z.object({
    goal_description: z.string().min(1).describe("DoelOmschrijving"),
    type: z.enum(['Symptom control', 'Cure', 'Maintenance', 'Palliative']).optional().describe("DoelType"),
    status: z.enum(['Active', 'Achieved', 'Partially achieved', 'Not achieved', 'Discontinued']).default('Active').describe("Status"),
    start_date: z.string().datetime().describe("Startdatum"),
    target_date: z.string().datetime().optional().describe("Streefdatum"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 3. Verrichting (v6.0) - Operaties, onderzoeken, etc.
  'nl.zorg.Verrichting': z.object({
    procedure_name: z.string().min(1).describe("VerrichtingNaam"),
    procedure_code: z.string().optional().describe("VerrichtingCode (Snomed/DBC)"),
    status: z.enum(['Planned', 'In progress', 'Completed', 'Cancelled', 'On hold']).default('Completed').describe("Status"),
    start_date: z.string().datetime().describe("Startdatum"),
    end_date: z.string().datetime().optional().describe("Einddatum"),
    location: z.string().optional().describe("AnatomischeLocatie"),
    lateralization: z.enum(['Left', 'Right', 'Bilateral']).optional().describe("Lateraliteit"),
    performer: z.string().optional().describe("Uitvoerende"),
    indication: z.string().optional().describe("Indicatie")
  }),

  // 4. VerpleegkundigeInterventie (v5.0)
  'nl.zorg.VerpleegkundigeInterventie': z.object({
    intervention_name: z.string().min(1).describe("InterventieNaam"),
    intervention_code: z.string().optional().describe("InterventieCode (NIC)"),
    status: z.enum(['Planned', 'Active', 'Completed', 'Cancelled']).default('Active').describe("Status"),
    start_time: z.string().datetime().describe("BeginDatumTijd"),
    end_time: z.string().datetime().optional().describe("EindDatumTijd"),
    frequency: z.string().optional().describe("Frequentie"),
    indication: z.string().optional().describe("Indicatie"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 5. VrijheidsbeperkendeInterventie (v1.3)
  'nl.zorg.VrijheidsbeperkendeInterventie': z.object({
    intervention_type: z.enum(['Mechanical restraint', 'Electronic monitoring', 'Pharmacological restraint', 'Physical restraint', 'Seclusion']).describe("TypeInterventie"),
    intervention_name: z.string().describe("NaamInterventie (bijv. Onrusthekken)"),
    status: z.enum(['Active', 'Discontinued']).default('Active').describe("Status"),
    start_date: z.string().datetime().describe("Startdatum"),
    end_date: z.string().datetime().optional().describe("Einddatum"),
    reason: z.string().describe("Reden"),
    legal_status: z.enum(['Voluntary', 'Involuntary (Wvggz)', 'Involuntary (Wzd)']).describe("JuridischeStatus")
  }),

  // 6. UitkomstVanZorg (v3.3.1)
  'nl.zorg.UitkomstVanZorg': z.object({
    description: z.string().min(1).describe("UitkomstBeschrijving"),
    observation_date: z.string().datetime().describe("MetingDatum"),
    status: z.enum(['Preliminary', 'Final', 'Corrected']).default('Final').describe("Status"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 7. ZorgAfspraak (v2.0)
  'nl.zorg.ZorgAfspraak': z.object({
    appointment_type: z.string().describe("TypeAfspraak"),
    start_time: z.string().datetime().describe("BeginDatumTijd"),
    end_time: z.string().datetime().optional().describe("EindDatumTijd"),
    location: z.string().optional().describe("Locatie"),
    health_professional: z.string().optional().describe("Zorgverlener"),
    status: z.enum(['Booked', 'Arrived', 'Fulfilled', 'Cancelled', 'No-show']).default('Booked').describe("Status"),
    description: z.string().optional().describe("Omschrijving/Reden")
  })
};

// GROEP 4: MEDICATIEKETEN (6 items - Nictiz 2024 Gold Standard)
export const Medicatie = {

  // 1. Medicatieafspraak (v4.0) - De opdracht van de voorschrijver
  'nl.zorg.Medicatieafspraak': z.object({
    medicine_name: z.string().min(1).describe("MedicamentNaam"),
    medicine_code: z.string().optional().describe("NHG/G-StandaardCode"),
    dosage_text: z.string().describe("Doseringsinstructie"),
    dosage_value: z.number().optional().describe("Doseringshoeveelheid"),
    dosage_unit: z.string().optional().describe("Doseringséénheid"),
    route_of_administration: z.string().describe("Toedieningsweg (bijv. Oraal)"),
    frequency: z.string().describe("Frequentie"),
    start_date: z.string().datetime().describe("Ingangsdatum"),
    end_date: z.string().datetime().optional().describe("Einddatum"),
    indication: z.string().optional().describe("Reden van voorschrijven"),
    prescriber: z.string().optional().describe("Voorschrijver"),
    status: z.enum(['Active', 'Discontinued', 'On hold', 'Completed']).default('Active').describe("Status")
  }),

  // 2. Toedieningsafspraak (v3.0) - Instructie voor de toediener (verpleging)
  'nl.zorg.Toedieningsafspraak': z.object({
    medicine_name: z.string().min(1).describe("MedicamentNaam"),
    agreement_date: z.string().datetime().describe("Afspraakdatum"),
    dosage_instruction: z.string().describe("Doseringsinstructie"),
    start_date: z.string().datetime().describe("Ingangsdatum"),
    end_date: z.string().datetime().optional().describe("Einddatum"),
    distribution_form: z.enum(['GDS (Baxter)', 'Manual', 'Pump']).default('Manual').describe("Distributievorm"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 3. MedicatieToediening2 (v3.0) - De daadwerkelijke handeling
  'nl.zorg.MedicatieToediening2': z.object({
    medicine_name: z.string().min(1).describe("MedicamentNaam"),
    administration_time: z.string().datetime().describe("Toedieningstijdstip"),
    administered_amount: z.number().describe("ToegediendeHoeveelheid"),
    administered_unit: z.string().describe("Eenheid"),
    route_of_administration: z.string().optional().describe("Toedieningsweg"),
    performer: z.string().optional().describe("Toediener"),
    reason_not_administered: z.string().optional().describe("Reden van niet toedienen"),
    status: z.enum(['Completed', 'Aborted', 'Not done']).default('Completed').describe("Status")
  }),

  // 4. MedicatieGebruik2 (v3.0) - Wat de patiënt zelf zegt te gebruiken
  'nl.zorg.MedicatieGebruik2': z.object({
    medicine_name: z.string().min(1).describe("MedicamentNaam"),
    dosage_text: z.string().optional().describe("Gebruikinstructie"),
    start_date: z.string().datetime().optional().describe("DatumBegin"),
    end_date: z.string().datetime().optional().describe("DatumEind"),
    reason_for_use: z.string().optional().describe("Reden van gebruik"),
    as_needed: z.boolean().default(false).describe("Zo nodig"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 5. Medicatieverstrekking (v3.0.1) - De fysieke aflevering (Apotheek)
  'nl.zorg.Medicatieverstrekking': z.object({
    medicine_name: z.string().min(1).describe("MedicamentNaam"),
    dispense_date: z.string().datetime().describe("Verstrekkingsdatum"),
    quantity: z.number().describe("Hoeveelheid"),
    quantity_unit: z.string().describe("Eenheid (bijv. stuks/ml)"),
    batch_number: z.string().optional().describe("Batchnummer"),
    expiry_date: z.string().datetime().optional().describe("Vervaldatum"),
    dispenser: z.string().optional().describe("Verstrekker (Apotheek)")
  }),

  // 6. Verstrekkingsverzoek (v4.0) - Het recept naar de apotheek
  'nl.zorg.Verstrekkingsverzoek': z.object({
    medicine_name: z.string().min(1).describe("MedicamentNaam"),
    request_date: z.string().datetime().describe("Aanvraagdatum"),
    quantity: z.number().describe("Aantal"),
    quantity_unit: z.string().describe("Eenheid"),
    duration: z.string().optional().describe("Verbruiksduur (dagen)"),
    refills_remaining: z.number().default(0).describe("Aantal herhalingen"),
    author: z.string().optional().describe("Aanvrager")
  })
};

// GROEP 5: PATIËNTEN CONTEXT (18 items - Nictiz 2024 Gold Standard)
export const PatientenContext = {

  // 1. AlcoholGebruik (v3.3)
  'nl.zorg.AlcoholGebruik': z.object({
    usage_status: z.enum(['Current', 'Former', 'Never']).describe("GebruikStatus"),
    amount: z.number().optional().describe("Hoeveelheid (glazen/dag)"),
    frequency: z.string().optional().describe("Frequentie"),
    start_date: z.string().datetime().optional().describe("Startdatum"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 2. TabakGebruik (v3.5)
  'nl.zorg.TabakGebruik': z.object({
    usage_status: z.enum(['Current', 'Former', 'Never']).describe("GebruikStatus"),
    type: z.enum(['Cigarettes', 'Cigars', 'Pipe', 'Rolling tobacco', 'E-cigarette']).optional().describe("Soort"),
    amount: z.number().optional().describe("Hoeveelheid (stuks/dag)"),
    pack_years: z.number().optional().describe("PackYears"),
    start_date: z.string().datetime().optional().describe("Startdatum"),
    end_date: z.string().datetime().optional().describe("Stopdatum")
  }),

  // 3. DrugsGebruik (v3.5)
  'nl.zorg.DrugsGebruik': z.object({
    usage_status: z.enum(['Current', 'Former', 'Never']).describe("GebruikStatus"),
    drug_type: z.string().optional().describe("Soort (bijv. Cannabis, Cocaïne)"),
    route: z.string().optional().describe("Toedieningsweg"),
    frequency: z.string().optional().describe("Frequentie"),
    start_date: z.string().datetime().optional().describe("Startdatum")
  }),

  // 4. Wilsverklaring (v5.0) - Cruciaal voor patiënt autonomie
  'nl.zorg.Wilsverklaring': z.object({
    type: z.enum(['Living will', 'Euthanasia request', 'Non-resuscitation', 'Representative']).describe("TypeVerklaring"),
    status: z.enum(['Present', 'Not present', 'Unknown']).describe("Status"),
    date: z.string().datetime().optional().describe("DatumVerklaring"),
    comment: z.string().optional().describe("Toelichting"),
    location: z.string().optional().describe("Vindplaats origineel")
  }),

  // 5. JuridischeSituatie (v5.0.1)
  'nl.zorg.JuridischeSituatie': z.object({
    legal_status: z.enum(['Voluntary', 'Involuntary (Wvggz)', 'Involuntary (Wzd)', 'Judicial']).describe("JuridischeStatus"),
    representation: z.enum(['Guardian', 'Mentor', 'Power of attorney', 'None']).optional().describe("Vertegenwoordiging"),
    start_date: z.string().datetime().describe("Ingangsdatum"),
    end_date: z.string().datetime().optional().describe("Einddatum")
  }),

  // 6. Gezinssituatie (v3.4.1) & 7. GezinssituatieKind (v1.4)
  'nl.zorg.Gezinssituatie': z.object({
    household_type: z.enum(['Alone', 'With partner', 'With partner and children', 'With children', 'Institution']).describe("HuishoudenType"),
    number_of_children: z.number().optional().describe("AantalKinderen"),
    comment: z.string().optional().describe("Toelichting")
  }),
  'nl.zorg.GezinssituatieKind': z.object({
    living_situation: z.enum(['With parents', 'Foster care', 'Institution', 'Shared custody']).describe("WoonsituatieKind"),
    care_form: z.string().optional().describe("Zorgvorm")
  }),

  // 8. Woonsituatie (v3.5)
  'nl.zorg.Woonsituatie': z.object({
    housing_type: z.enum(['House', 'Apartment', 'Assisted living', 'Nursing home', 'Homeless']).describe("WoningType"),
    barriers: z.string().optional().describe("Belemmeringen (bijv. drempels/trappen)"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 9. BurgerlijkeStaat (v3.2) & 10. Nationaliteit (v3.0)
  'nl.zorg.BurgerlijkeStaat': z.object({
    status: z.enum(['Married', 'Single', 'Divorced', 'Widowed', 'Registered partner']).describe("BurgerlijkeStaat")
  }),
  'nl.zorg.Nationaliteit': z.object({
    country_code: z.string().describe("LandCode (ISO 3166)"),
    nationality: z.string().describe("Nationaliteit")
  }),

  // 11. Opleiding (v3.3) & 12. ParticipatieInMaatschappij (v3.1)
  'nl.zorg.Opleiding': z.object({
    level: z.enum(['None', 'Primary', 'Secondary', 'Vocational', 'Bachelor', 'Master', 'Doctorate']).describe("Opleidingsniveau"),
    status: z.enum(['Completed', 'In progress', 'Dropped out']).optional().describe("Status")
  }),
  'nl.zorg.ParticipatieInMaatschappij': z.object({
    occupation: z.string().optional().describe("Beroep/Bezigheid"),
    work_status: z.enum(['Employed', 'Unemployed', 'Retired', 'Student', 'Disabled']).optional().describe("WerkStatus"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 13. HulpVanAnderen (v3.3)
  'nl.zorg.HulpVanAnderen': z.object({
    care_type: z.enum(['Informal care (Mantelzorg)', 'Professional care', 'Volunteer']).describe("TypeHulp"),
    help_description: z.string().describe("BeschrijvingHulp"),
    frequency: z.string().optional().describe("Frequentie")
  }),

  // 14. Taalvaardigheid (v4.0)
  'nl.zorg.Taalvaardigheid': z.object({
    language: z.string().describe("Taal (ISO 639)"),
    proficiency: z.enum(['Good', 'Moderate', 'Poor']).optional().describe("Vaardigheid"),
    interpreter_required: z.boolean().default(false).describe("TolkNodig")
  }),

  // 15. Levensovertuiging (v4.0)
  'nl.zorg.Levensovertuiging': z.object({
    religion: z.string().describe("Religie/Overtuiging"),
    restrictions: z.string().optional().describe("Beperkingen/Wensen")
  }),

  // 16. Ziektebeleving (v3.2) & 17. Klachtbeleving (v1.0)
  'nl.zorg.Ziektebeleving': z.object({
    insight: z.string().describe("Inzicht in ziekte"),
    coping_style: z.string().optional().describe("Copingstijl"),
    expectations: z.string().optional().describe("Verwachtingen")
  }),
  'nl.zorg.Klachtbeleving': z.object({
    concern_level: z.enum(['Not concerned', 'Somewhat concerned', 'Very concerned']).describe("MateVanBezorgdheid"),
    interference_daily_life: z.string().optional().describe("Hinder dagelijks leven")
  }),

  // 18. Familieanamnese (v5.0)
  'nl.zorg.Familieanamnese': z.object({
    disorder_name: z.string().describe("AandoeningFamilielid"),
    relationship: z.string().describe("Relatie (bijv. Moeder, Broer)"),
    onset_age: z.number().optional().describe("LeeftijdOpenbaring")
  })
};

// GROEP 6: ADMINISTRATIEF (8 items - Nictiz 2024 Gold Standard)
export const Administratief = {

  // 1. Patient (v4.3)
  'nl.zorg.Patient': z.object({
    ssn_number: z.string().length(9).describe("BSN"),
    given_name: z.string().min(1).describe("Voornaam"),
    initials: z.string().optional().describe("Initialen"),
    surname_prefix: z.string().optional().describe("Tussenvoegsel"),
    surname: z.string().min(1).describe("Achternaam"),
    birth_date: z.string().datetime().describe("Geboortedatum"),
    gender: z.enum(['Male', 'Female', 'Other', 'Unknown']).describe("Geslacht"),
    address: z.string().describe("Straat + Huisnummer"),
    city: z.string().describe("Woonplaats"),
    postal_code: z.string().describe("Postcode"),
    country: z.string().default('Nederland').describe("Land"),
    phone_number: z.string().optional().describe("Telefoonnummer"),
    email: z.string().email().optional().describe("E-mailadres")
  }),

  // 2. Contactpersoon (v5.0) - Naasten / Mantelzorgers
  'nl.zorg.Contactpersoon': z.object({
    relationship: z.enum(['Partner', 'Child', 'Parent', 'Guardian', 'Neighbor', 'Other']).describe("Relatie"),
    given_name: z.string().min(1).describe("Voornaam"),
    surname: z.string().min(1).describe("Achternaam"),
    phone_number: z.string().describe("Telefoonnummer"),
    is_emergency_contact: z.boolean().default(true).describe("EersteContactpersoon"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 3. Zorgverlener (v4.0.1)
  'nl.zorg.Zorgverlener': z.object({
    provider_id: z.string().optional().describe("UZI-nummer / BIG-nummer"),
    name: z.string().min(1).describe("Naam zorgverlener"),
    specialty: z.string().describe("Specialisme (bijv. Cardioloog)"),
    organization: z.string().describe("Zorgaanbieder (Naam)"),
    role: z.string().optional().describe("Rol in zorgproces")
  }),

  // 4. Zorgaanbieder (v3.6) - De organisatie
  'nl.zorg.Zorgaanbieder': z.object({
    organization_id: z.string().optional().describe("URA-nummer / KvK"),
    organization_name: z.string().min(1).describe("OrganisatieNaam"),
    organization_type: z.enum(['Hospital', 'General Practice', 'Nursing Home', 'Home Care', 'Pharmacy']).describe("TypeInstelling"),
    address: z.string().optional().describe("Adres"),
    city: z.string().optional().describe("Plaats")
  }),

  // 5. Contact (v7.0) - Los consult of ontmoeting
  'nl.zorg.Contact': z.object({
    contact_date_time: z.string().datetime().describe("ContactDatumTijd"),
    contact_type: z.enum(['Outpatient', 'Inpatient', 'Emergency', 'Home visit', 'Teleconsultation']).describe("ContactType"),
    location: z.string().optional().describe("Locatie / Afdeling"),
    reason: z.string().optional().describe("Reden van contact"),
    health_professional: z.string().optional().describe("UitvoerendeZorgverlener")
  }),

  // 6. Opname (v3.0) - Meerdaags verblijf
  'nl.zorg.Opname': z.object({
    admission_date_time: z.string().datetime().describe("OpnameDatumTijd"),
    discharge_date_time: z.string().datetime().optional().describe("OntslagDatumTijd"),
    admission_location: z.string().describe("Afdeling/Locatie"),
    admission_source: z.enum(['Home', 'Other hospital', 'Nursing home', 'Emergency department']).optional().describe("Herkomst"),
    discharge_destination: z.enum(['Home', 'Other hospital', 'Nursing home', 'Mortuary']).optional().describe("Bestemming"),
    specialty: z.string().describe("Specialisme bij opname")
  }),

  // 7. ZorgTeam (v2.0)
  'nl.zorg.ZorgTeam': z.object({
    team_name: z.string().min(1).describe("TeamNaam"),
    team_role: z.string().optional().describe("Rol van het team"),
    start_date: z.string().datetime().describe("DatumBegin"),
    end_date: z.string().datetime().optional().describe("DatumEinde"),
    members: z.string().describe("Leden (Namen)")
  }),

  // 8. Betaler (v4.1) - Verzekering
  'nl.zorg.Betaler': z.object({
    payer_name: z.string().min(1).describe("VerzekeraarNaam"),
    insurance_id: z.string().describe("Verzekerdennummer"),
    policy_type: z.enum(['Basic', 'Supplementary', 'Other']).describe("PolisType"),
    start_date: z.string().datetime().describe("Startdatum"),
    end_date: z.string().datetime().optional().describe("Einddatum")
  })
};

// GROEP 7: ZELFZORG (10 items - Nictiz 2024 Gold Standard)
export const Zelfzorg = {

  // 1. Mobiliteit (v3.3.1)
  'nl.zorg.Mobiliteit': z.object({
    mobility_status: z.enum(['Lopen', 'Met hulpmiddel', 'Rolstoel', 'Bedlegerig']).describe("MobiliteitStatus"),
    walking_distance: z.number().optional().describe("Loopafstand (meters)"),
    aid_used: z.string().optional().describe("Hulpmiddel"),
    start_date: z.string().datetime().describe("Startdatum"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 2. VermogenTotWassen (v3.1.1)
  'nl.zorg.VermogenTotZichWassen': z.object({
    washing_status: z.enum(['Onafhankelijk', 'Hulp nodig', 'Afhankelijk']).describe("WassenStatus"),
    washing_upper_body: z.enum(['Zelfstandig', 'Hulp nodig', 'Overgenomen']).optional().describe("Bovenlichaam"),
    washing_lower_body: z.enum(['Zelfstandig', 'Hulp nodig', 'Overgenomen']).optional().describe("Onderlichaam"),
    aid_used: z.string().optional().describe("Hulpmiddelen (bijv. douchestoel)"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 3. VermogenTotKleden (v3.1.1)
  'nl.zorg.VermogenTotZichKleden': z.object({
    dressing_status: z.enum(['Onafhankelijk', 'Hulp nodig', 'Afhankelijk']).describe("KledenStatus"),
    dressing_upper_body: z.enum(['Zelfstandig', 'Hulp nodig', 'Overgenomen']).optional().describe("Bovenlichaam"),
    dressing_lower_body: z.enum(['Zelfstandig', 'Hulp nodig', 'Overgenomen']).optional().describe("Onderlichaam"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 4. VermogenTotToiletgang (v3.1.1)
  'nl.zorg.VermogenTotToiletgang': z.object({
    toileting_status: z.enum(['Onafhankelijk', 'Hulp nodig', 'Afhankelijk']).describe("ToiletgangStatus"),
    menstrual_hygiene: z.enum(['Zelfstandig', 'Hulp nodig', 'Overgenomen']).optional().describe("MenstruatieHygiene"),
    aid_used: z.string().optional().describe("Hulpmiddel (bijv. postoel)"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 5. VermogenTotEten (v3.1.1) & 6. VermogenTotDrinken (v3.1.2)
  'nl.zorg.VermogenTotEten': z.object({
    eating_status: z.enum(['Onafhankelijk', 'Hulp nodig', 'Afhankelijk']).describe("EtenStatus"),
    food_preparation: z.enum(['Zelfstandig', 'Hulp nodig', 'Overgenomen']).optional().describe("EtenBereiden"),
    comment: z.string().optional().describe("Toelichting")
  }),
  'nl.zorg.VermogenTotDrinken': z.object({
    drinking_status: z.enum(['Onafhankelijk', 'Hulp nodig', 'Afhankelijk']).describe("DrinkenStatus"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 7. VermogenTotMondverzorging (v3.1)
  'nl.zorg.VermogenTotMondverzorging': z.object({
    oral_hygiene_status: z.enum(['Onafhankelijk', 'Hulp nodig', 'Afhankelijk']).describe("MondverzorgingStatus"),
    denture_care: z.enum(['N.v.t.', 'Zelfstandig', 'Hulp nodig', 'Overgenomen']).optional().describe("GebitsprotheseVerzorging")
  }),

  // 8. VermogenTotUiterlijkeVerzorging (v1.0.2)
  'nl.zorg.VermogenTotUiterlijkeVerzorging': z.object({
    grooming_status: z.enum(['Onafhankelijk', 'Hulp nodig', 'Afhankelijk']).describe("UiterlijkeVerzorgingStatus"),
    activities: z.string().optional().describe("Activiteiten (bijv. scheren, haar)")
  }),

  // 9. VermogenTotZelfstandigMedicatiegebruik (v2.0)
  'nl.zorg.VermogenTotZelfstandigMedicatiegebruik': z.object({
    medication_management: z.enum(['Zelfstandig', 'Hulp bij klaarzetten', 'Hulp bij inname', 'Volledig afhankelijk']).describe("MedicatiegebruikStatus"),
    comment: z.string().optional().describe("Toelichting")
  }),

  // 10. VermogenTotVerpleegtechnischeHandelingen (v1.0.2)
  'nl.zorg.VermogenTotVerpleegtechnischeHandelingen': z.object({
    nursing_tasks_status: z.enum(['Zelfstandig', 'Hulp nodig', 'Volledig overgenomen']).describe("VerpleegtechnischeStatus"),
    tasks_description: z.string().optional().describe("Welke handelingen (bijv. injecteren, sonde)")
  })
};

// GROEP 8: SCORELIJSTEN (15 items - Nictiz 2024 Gold Standard)
export const Scorelijsten = {

  // 1. ApgarScore (v1.2)
  'nl.zorg.ApgarScore': z.object({
    appearance: z.number().min(0).max(2).describe("Kleur"),
    pulse: z.number().min(0).max(2).describe("Hartslag"),
    grimace: z.number().min(0).max(2).describe("Reactie op prikkels"),
    activity: z.number().min(0).max(2).describe("Spiertonus"),
    respiration: z.number().min(0).max(2).describe("Ademhaling"),
    total_score: z.number().min(0).max(10).describe("Totaalscore"),
    time_after_birth: z.enum(['1 minute', '5 minutes', '10 minutes']).describe("Meetmoment"),
    date_time: z.string().datetime().describe("Tijdstip")
  }),

  // 2. GlasgowComaScale (v3.4)
  'nl.zorg.GlasgowComaScale': z.object({
    eye_score: z.number().min(1).max(4).describe("Eyes"),
    motor_score: z.number().min(1).max(6).describe("Motor"),
    verbal_score: z.number().min(1).max(5).describe("Verbal"),
    total_score: z.number().min(3).max(15).describe("Totaalscore"),
    date_time: z.string().datetime().describe("Tijdstip")
  }),

  // 3. Pijnscore (v4.1) - NRS/VAS
  'nl.zorg.Pijnscore': z.object({
    pain_score: z.number().min(0).max(10).describe("Pijnscore"),
    pain_type: z.enum(['Resting pain', 'Pain during movement']).optional().describe("TypePijn"),
    anatomical_location: z.string().optional().describe("Locatie"),
    date_time: z.string().datetime().describe("Tijdstip")
  }),

  // 4. BarthelIndex (v3.2)
  'nl.zorg.BarthelIndex': z.object({
    bowels: z.number().describe("Darmen"),
    bladder: z.number().describe("Blaas"),
    grooming: z.number().describe("Uiterlijke verzorging"),
    toilet_use: z.number().describe("Toileteren"),
    feeding: z.number().describe("Eten"),
    transfer: z.number().describe("Transfer"),
    mobility: z.number().describe("Mobiliteit"),
    dressing: z.number().describe("Kleden"),
    stairs: z.number().describe("Trappen"),
    bathing: z.number().describe("Wassen"),
    total_score: z.number().min(0).max(20).describe("Totaalscore"),
    date_time: z.string().datetime().describe("Tijdstip")
  }),

  // 5. MUSTScore (v3.1.1) - Malnutrition Universal Screening Tool
  'nl.zorg.MUSTScore': z.object({
    bmi_score: z.number().min(0).max(2).describe("BMI Score"),
    weight_loss_score: z.number().min(0).max(2).describe("Gewichtsverlies Score"),
    illness_score: z.number().min(0).max(2).describe("Ziekte Score"),
    total_score: z.number().min(0).max(6).describe("Totaalscore"),
    date_time: z.string().datetime().describe("Tijdstip")
  }),

  // 6. SNAQScore (v3.3), 7. SNAQ65+ (v1.3), 8. SNAQrc (v1.3)
  'nl.zorg.SNAQScore': z.object({
    appetite_loss: z.number().describe("Eetlustverlies"),
    weight_loss: z.number().describe("Gewichtsverlies"),
    capability_loss: z.number().describe("Beperkingen"),
    total_score: z.number().describe("Totaalscore"),
    date_time: z.string().datetime().describe("Tijdstip")
  }),

  // 9. DOSScore (v1.2) - Delirium Observation Screening
  'nl.zorg.DOSScore': z.object({
    total_score: z.number().min(0).max(13).describe("Totaalscore"),
    date_time: z.string().datetime().describe("Tijdstip"),
    comment: z.string().optional().describe("Opmerkingen")
  }),

  // 10. FLACCpijnScore (v1.2.1) - Voor kinderen/niet-communiceerbaar
  'nl.zorg.FLACCpijnScore': z.object({
    face: z.number().min(0).max(2).describe("Gezicht"),
    legs: z.number().min(0).max(2).describe("Benen"),
    activity: z.number().min(0).max(2).describe("Activiteit"),
    cry: z.number().min(0).max(2).describe("Huilen"),
    consolability: z.number().min(0).max(2).describe("Troostbaarheid"),
    total_score: z.number().min(0).max(10).describe("Totaalscore"),
    date_time: z.string().datetime().describe("Tijdstip")
  }),

  // 11. ChecklistPijngedrag (v1.2.1) & 12. ComfortScore (v1.2)
  'nl.zorg.ChecklistPijngedrag': z.object({
    total_score: z.number().min(0).max(10).describe("Totaalscore"),
    date_time: z.string().datetime().describe("Tijdstip")
  }),
  'nl.zorg.ComfortScore': z.object({
    total_score: z.number().min(8).max(40).describe("Totaalscore"),
    date_time: z.string().datetime().describe("Tijdstip")
  }),

  // 13. StrongKidsScore (v1.1)
  'nl.zorg.StrongKidsScore': z.object({
    total_score: z.number().min(0).max(5).describe("Totaalscore"),
    date_time: z.string().datetime().describe("Tijdstip")
  }),

  // 14. TNMTumorClassificatie (v4.1) - Oncologie
  'nl.zorg.TNMTumorClassificatie': z.object({
    tumor_stage: z.string().describe("T-categorie"),
    node_stage: z.string().describe("N-categorie"),
    metastasis_stage: z.string().describe("M-categorie"),
    tnm_version: z.string().default('8th edition').describe("Editie"),
    stage_grouping: z.string().optional().describe("Stadiumgroepering"),
    date_time: z.string().datetime().describe("Vaststellingsdatum")
  }),

  // 15. HoNOS+ (v1.0) - Geestelijke Gezondheidszorg
  'nl.zorg.HoNOSplus': z.object({
    total_score: z.number().optional().describe("Totaalscore"),
    assessment_date: z.string().datetime().describe("Datum")
  })
};

// GROEP 9: PROCES PATRONEN (3 items - Nictiz 2024 Gold Standard)
export const ProcesPatronen = {

  // 1. AanvraagGegevens (v1.0.1)
  'nl.zorg.AanvraagGegevens': z.object({
    requester: z.string().min(1).describe("Aanvrager (Zorgverlener/Systeem)"),
    request_id: z.string().describe("AanvraagNummer (Unieke referentie)"),
    request_date_time: z.string().datetime().describe("AanvraagDatumTijd"),
    indication: z.string().optional().describe("Indicatie/Vraagstelling"),
    priority: z.enum(['Routine', 'Urgent', 'Emergency']).default('Routine').describe("Urgentie")
  }),

  // 2. AfnameGegevens (v1.0.1) - Cruciaal voor Lab en Pathologie
  'nl.zorg.AfnameGegevens': z.object({
    collection_date_time: z.string().datetime().describe("AfnameDatumTijd"),
    collector: z.string().optional().describe("Afnemer (Persoon die materiaal afnam)"),
    collection_method: z.string().optional().describe("AfnameProcedure (bijv. Venapunctie)"),
    anatomical_location: z.string().optional().describe("AfnameLocatie"),
    container_id: z.string().optional().describe("ContainerId (Barcode buisje)")
  }),

  // 3. RegistratieGegevens (v1.1.2) - De technische vastlegging
  'nl.zorg.RegistratieGegevens': z.object({
    registration_date_time: z.string().datetime().describe("RegistratieDatumTijd"),
    author: z.string().min(1).describe("Auteur (Wie heeft dit getypt/vastgelegd)"),
    source: z.string().optional().describe("Bron (bijv. EPD, Patiëntportaal, Apparaat)"),
    verification_status: z.enum(['Preliminary', 'Final', 'Corrected']).default('Final').describe("Status")
  }),
};

// GROEP 10: SUBBOUWSTENEN (8 items - Nictiz 2024 Gold Standard)
export const Subbouwstenen = {
  // 1. Naamgegevens (v1.2)
  'nl.zorg.Naamgegevens': z.object({
    given_name: z.string().min(1).describe("Voornaam"),
    initials: z.string().optional().describe("Initialen"),
    surname_prefix: z.string().optional().describe("Tussenvoegsel"),
    surname: z.string().min(1).describe("Achternaam"),
    maiden_name: z.string().optional().describe("Meisjesnaam"),
    preferred_name_usage: z.enum(['Own surname', 'Partner surname', 'Partner then own', 'Own then partner']).default('Own surname').describe("Naamgebruik")
  }),

  // 2. Adresgegevens (v1.2)
  'nl.zorg.Adresgegevens': z.object({
    street: z.string().min(1).describe("Straatnaam"),
    house_number: z.string().min(1).describe("Huisnummer"),
    house_number_addition: z.string().optional().describe("HuisnummerToevoeging"),
    postal_code: z.string().min(6).max(7).describe("Postcode"),
    city: z.string().min(1).describe("Woonplaats"),
    country: z.string().default('Nederland').describe("Land"),
    address_type: z.enum(['Residential', 'Postal', 'Temporary', 'Work']).default('Residential').describe("AdresSoort")
  }),

  // 3. Contactgegevens (v1.3.1)
  'nl.zorg.Contactgegevens': z.object({
    telecom_type: z.enum(['Phone', 'Email', 'Mobile', 'Fax', 'Pager']).describe("ContactType"),
    telecom_value: z.string().min(1).describe("ContactWaarde"),
    telecom_use: z.enum(['Home', 'Work', 'Mobile']).optional().describe("Gebruik")
  }),

  // 4. AnatomischeLocatie (v1.0.4)
  'nl.zorg.AnatomischeLocatie': z.object({
    location_name: z.string().min(1).describe("AnatomischeLocatie"),
    laterality: z.enum(['Left', 'Right', 'Bilateral', 'Unilateral']).optional().describe("Lateraliteit"),
    orientation: z.string().optional().describe("Oriëntatie (bijv. Distaal, Proximaal)")
  }),

  // 5. FarmaceutischProduct (v2.3)
  'nl.zorg.FarmaceutischProduct': z.object({
    product_code: z.string().describe("G-Standaard Code (GPK/PRK)"),
    product_name: z.string().min(1).describe("ProductNaam"),
    product_group: z.string().optional().describe("ProductGroep"),
    ingredient_name: z.string().optional().describe("IngrediëntNaam"),
    strength_value: z.number().optional().describe("SterkteWaarde"),
    strength_unit: z.string().optional().describe("SterkteEenheid")
  }),

  // 6. GebruiksInstructie (v3.1)
  'nl.zorg.GebruiksInstructie': z.object({
    dose_text: z.string().describe("Doseerinstructie"),
    route_of_administration: z.string().describe("Toedieningsweg"),
    frequency: z.string().optional().describe("Frequentie"),
    as_needed: z.boolean().default(false).describe("Zo nodig"),
    max_dose: z.string().optional().describe("Maximale dosis")
  }),

  // 7. TijdsInterval (v1.3)
  'nl.zorg.TijdsInterval': z.object({
    start_date_time: z.string().datetime().describe("BeginDatumTijd"),
    end_date_time: z.string().datetime().optional().describe("EindDatumTijd"),
    duration_value: z.number().optional().describe("DuurWaarde"),
    duration_unit: z.enum(['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks']).optional().describe("DuurEenheid")
  }),

  // 8. Bereik (v1.0.1) - Bijv. voor referentiewaarden
  'nl.zorg.Bereik': z.object({
    minimum_value: z.number().optional().describe("MinimumWaarde"),
    maximum_value: z.number().optional().describe("MaximumWaarde"),
    unit: z.string().optional().describe("Eenheid")
  })
};

// ===========================================================================
// GROEP 11: NARRATIEVE VERSLAGLEGGING (Specialistische Workflow - Virtual ZIBs)
// ===========================================================================

export const NarratieveVerslaglegging = {

  // 1. ANAMNESE (Subjectief)
  'nl.zorg.Anamnese': z.object({
    anamnesis_text: z.string().describe("Anamnese Tekst"),
    date: z.string().datetime().optional().describe("Datum"),
    informant: z.enum(['patient', 'partner', 'parent', 'other']).optional().describe("Informant"),
    history_source: z.string().optional().describe("Bron")
  }),

  // 2. LICHAMELIJK ONDERZOEK (Objectief)
  'nl.zorg.LichamelijkOnderzoek': z.object({
    examination_text: z.string().describe("Bevindingen"),
    examination_date: z.string().datetime().optional().describe("Datum Onderzoek"),
    localization: z.string().optional().describe("Locatie/Zijde")
  }),

  // 3. EVALUATIE / CONCLUSIE (Evaluatie)
  'nl.zorg.Evaluatie': z.object({
    evaluation_text: z.string().describe("Conclusie"),
    dd_text: z.string().optional().describe("Differentiaal Diagnose"),
    status: z.enum(['preliminary', 'final']).default('preliminary').describe("Status")
  }),

  // 4. BELEID (Plan)
  'nl.zorg.Beleid': z.object({
    policy_text: z.string().describe("Beleid"),
    start_date: z.string().datetime().optional().describe("Ingangsdatum"),
    follow_up_date: z.string().datetime().optional().describe("Vervolgdatum")
  }),

  // 5. DECURSUS (Voortgang)
  'nl.zorg.Decursus': z.object({
    progress_note: z.string().describe("Decursus tekst"),
    contact_type: z.enum(['visit', 'call', 'email', 'e-consult']).default('visit').describe("Contact Type"),
    author: z.string().optional().describe("Auteur")
  }),

  // 6. POLIKLINISCH CONSULT (2e lijns - Compleet)
  'nl.zorg.PoliklinischConsult': z.object({
    anamnese: z.string().describe("Anamnese - Klachten, voorgeschiedenis"),
    lichamelijk_onderzoek: z.string().describe("Lichamelijk Onderzoek - Bevindingen"),
    aanvullend_onderzoek: z.string().optional().describe("Aanvullend Onderzoek - Labs, imaging"),
    conclusie: z.string().describe("Conclusie - Diagnose en interpretatie"),
    beleid: z.string().describe("Beleid - Behandelplan en follow-up"),
    specialisme: z.string().describe("Specialisme - Vakgebied"),
    contact_type: z.enum(['Eerste poliklinisch consult', 'Vervolg consult', 'Dagbehandeling', 'Telefonisch consult']).default('Eerste poliklinisch consult').describe("Type Contact"),
    consult_date: z.string().datetime().optional().describe("Consult Datum")
  }),

  // 7. DBC DECLARATIE (Financiële administratie)
  'nl.zorg.DBCDeclaratie': z.object({
    dbc_code: z.string().optional().describe("DBC Code"),
    care_type: z.string().optional().describe("Zorgtype - bijv. Eerste consult, Vervolg"),
    icd10_codes: z.array(z.string()).optional().describe("ICD-10 Codes"),
    procedures: z.array(z.string()).optional().describe("Verrichtingen"),
    consult_date: z.string().datetime().optional().describe("Datum"),
    duration_minutes: z.number().optional().describe("Duur in minuten")
  })
};
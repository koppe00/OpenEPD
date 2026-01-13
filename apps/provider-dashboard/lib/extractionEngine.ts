import { GoogleGenerativeAI } from '@google/generative-ai';

export type ExtractionResult = {
  zibs: Array<{ zib_id: string; values: Record<string, any>; effective_at?: string }>;
  consult: {
    anamnese?: string;
    lichamelijk_onderzoek?: string;
    aanvullend_onderzoek?: string;
    conclusie?: string;
    beleid?: string;
    specialisme?: string;
  } | null;
  billing: { icd10: string[]; procedures: string[]; dbc_code?: string; care_type?: string } | null;
}

export type AIConfigContext = {
  user_id?: string;
  role?: string;
  specialisme?: string;
  werkcontext?: string;
  organization_id?: string;
};

/**
 * Resolve AI configuration for ZIB extraction
 * This allows per-specialty/context customization of which ZIBs to extract
 */
async function resolveExtractionConfig(context?: AIConfigContext): Promise<any> {
  // If no context provided, use default behavior
  if (!context || !context.specialisme) {
    return null;
  }

  try {
    // Call the AI config resolution endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/ai-config/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feature_id: 'zib_extraction',
        ...context
      })
    });

    if (!response.ok) {
      console.warn('[ExtractionEngine] Failed to resolve AI config, using defaults');
      return null;
    }

    const data = await response.json();
    return data.config;
  } catch (error) {
    console.error('[ExtractionEngine] Error resolving AI config:', error);
    return null;
  }
}

export async function extractFromTranscript(
  transcript: string, 
  modelName?: string,
  context?: AIConfigContext
): Promise<ExtractionResult> {
  // Use dedicated Voice Assistant API key (server-side only)
  const key = process.env.VOICE_ASSISTANT_GEMINI_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) throw new Error('Voice Assistant Gemini API key not configured');

  // Resolve AI configuration for this context
  const aiConfig = await resolveExtractionConfig(context);
  
  // Extract enabled ZIBs and custom prompt if configured
  const enabledZibs = aiConfig?.enabled_zibs || null;
  const customPrompt = aiConfig?.custom_prompt || null;

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ 
    model: modelName || process.env.VOICE_ASSISTANT_GEMINI_MODEL || process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-1.5-flash' 
  });

  // Build ZIB list based on configuration
  let zibList = '';
  if (enabledZibs && Array.isArray(enabledZibs)) {
    // Use configured ZIB list (filtered list from admin config)
    zibList = enabledZibs.map((zib: string) => `- "${zib}"`).join('\n');
  } else {
    // Use default full ZIB list
    zibList = `VITALS & MEASUREMENTS:
- "nl.zorg.Bloeddruk" → blood pressure (values: systolic, diastolic in mmHg)
- "nl.zorg.Hartfrequentie" → heart rate (values: heart_rate in /min)
- "nl.zorg.O2Saturatie" → oxygen saturation (values: spo2 in %)
- "nl.zorg.Lichaamstemperatuur" → body temperature (values: temperature_value in °C)
- "nl.zorg.Lichaamsgewicht" → weight (values: weight_value in kg)
- "nl.zorg.Lichaamslengte" → height (values: length_value in cm)
- "nl.zorg.Ademhaling" → respiratory rate (values: respiratory_rate in /min)

CLINICAL DATA:
- "nl.zorg.AandoeningOfGesteldheid" → diagnoses/problems 
  values: {
    problem_name: "Name in Dutch",
    problem_type: "Diagnosis" | "Symptom" | "Finding" | "Complaint" | "Functional limitation" | "Complication",
    clinical_status: "Active" | "Inactive" | "Resolved" | "Relapse"
  }
- "nl.zorg.Diagnose" → formal diagnoses (values: diagnosis_code for ICD10/ICPC, date as ISO datetime)
- "nl.zorg.Medicatieafspraak" → medications (values: medication_product, dosage, frequency)
- "nl.zorg.OvergevoeligheidIntolerantie" → allergies 
  values: {
    causative_agent: "Substance name",
    reaction_description: "Description",
    category: "Food" | "Medication" | "Environment" | "Biologic" | "Other"
  }
- "nl.zorg.TabakGebruik" → smoking status (values: smoking_status, pack_years)
- "nl.zorg.LaboratoriumUitslag" → lab results (values: test_code, result_value, result_unit)

CONSULTATION DOCUMENTATION (REQUIRED - EXTRACT AS SEPARATE ZIBs):
- "nl.zorg.Anamnese" → patient history and complaints
  values: {
    anamnesis_text: "History of present illness, symptoms, relevant past history (Dutch)",
    informant: "patient" | "partner" | "parent" | "other"
  }
- "nl.zorg.LichamelijkOnderzoek" → physical examination findings
  values: {
    examination_text: "Physical examination findings (Dutch)",
    localization: "Anatomical location if relevant"
  }
- "nl.zorg.Evaluatie" → clinical impression/conclusion
  values: {
    evaluation_text: "Clinical conclusion and diagnosis (Dutch)",
    dd_text: "Differential diagnosis (optional)",
    status: "preliminary" | "final"
  }
- "nl.zorg.Beleid" → treatment plan
  values: {
    policy_text: "Treatment plan, follow-up, referrals (Dutch)",
    follow_up_date: "ISO datetime for next appointment (optional)"
  }
- "nl.zorg.PoliklinischConsult" → complete consultation summary (convenience wrapper)
  values: {
    anamnese: "Full anamnesis text",
    lichamelijk_onderzoek: "Full examination text",
    aanvullend_onderzoek: "Additional investigations",
    conclusie: "Conclusion text",
    beleid: "Policy text",
    specialisme: "Medical specialty (e.g., Interne Geneeskunde, Cardiologie)",
    contact_type: "Eerste poliklinisch consult" | "Vervolg consult" | "Dagbehandeling" | "Telefonisch consult"
  }
  NOTE: Extract BOTH the individual narrative ZIBs (Anamnese, LichamelijkOnderzoek, etc.) 
  AND the complete PoliklinischConsult for full documentation.

BILLING/DBC (REQUIRED - ALWAYS EXTRACT):
- "nl.zorg.DBCDeclaratie" → billing and coding information
  values: {
    dbc_code: "Suggested DBC code (optional)",
    care_type: "e.g., Eerste poliklinisch consult, Vervolg consult",
    icd10_codes: ["I10", "E11.9"] // Array of ICD-10 codes inferred,
    procedures: ["Anamnese", "Lichamelijk onderzoek"] // Array of procedure names,
    consult_date: "ISO datetime string YYYY-MM-DDTHH:MM:SS or omit this field",
    duration_minutes: Estimated consultation duration
  }`;
  }

  // Use custom prompt if provided, otherwise use default template
  const basePrompt = customPrompt || `
You are a clinical extraction engine for SECONDARY CARE (2e lijn) in the Netherlands. Given the following transcript of a patient encounter, extract structured ZIB (Zorginformatiebouwsteen) objects and return a JSON array with key "zibs".

Output format: { "zibs": [ {...}, {...}, ... ] }

Each ZIB must have:
- "zib_id": <official ZIB identifier from list below>
- "values": { <field>: <value>, ... }
- "effective_at": <ISO date string YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss>

OFFICIAL ZIB IDs - EXTRACT ALL RELEVANT DATA:

${zibList}

RULES:
- Extract ALL relevant clinical parameters
- ALWAYS include PoliklinischConsult ZIB (mandatory for every transcript)
- ALWAYS include DBCDeclaratie ZIB (mandatory for billing)
- Use TODAY'S DATE (${new Date().toISOString().split('T')[0]}) for effective_at when not mentioned
- ALL enum values must be in ENGLISH (e.g., "Active" not "actief", "Symptom" not "symptoom")
- Datetime fields must be full ISO 8601 format (YYYY-MM-DDTHH:MM:SS) or omitted entirely
- Respond ONLY with valid JSON parsable by JSON.parse
- NO markdown code blocks, NO extra commentary
- All narrative text in Dutch, but enum values in English`;

  const prompt = `${basePrompt}

Transcript:
---
${transcript}
---

Return the JSON now.
`;
  const response = await model.generateContent(prompt);
  const txt = response.response?.text?.() ?? '';

  console.log('[ExtractionEngine] Gemini response length:', txt.length);
  console.log('[ExtractionEngine] First 500 chars:', txt.substring(0, 500));

  try {
    const parsed = JSON.parse(txt);
    console.log('[ExtractionEngine] Parsed successfully:', {
      zibCount: parsed.zibs?.length || 0,
      zibTypes: parsed.zibs?.map((z: any) => z.zib_id) || []
    });
    
    // Return zibs array directly - no separate consult/billing
    return {
      zibs: parsed.zibs || [],
      consult: null, // Deprecated - now in PoliklinischConsult ZIB
      billing: null, // Deprecated - now in DBCDeclaratie ZIB
    } as ExtractionResult;
  } catch (err) {
    // If model didn't return strict JSON, try to find JSON substring
    const jsonStart = txt.indexOf('{');
    const jsonEnd = txt.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const sub = txt.substring(jsonStart, jsonEnd + 1);
      try {
        const parsed = JSON.parse(sub);
        return {
          zibs: parsed.zibs || [],
          consult: parsed.consult || null,
          billing: parsed.billing || null,
        } as ExtractionResult;
      } catch (e) {
        throw new Error('Failed to parse JSON from model output');
      }
    }
    throw new Error('Model did not return JSON');
  }
}

export default extractFromTranscript;

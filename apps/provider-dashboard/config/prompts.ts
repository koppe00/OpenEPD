export const AI_CONFIG = {
  model: "gemini-2.5-flash", // Latest Gemini 2.5 stable
  temperature: 0.2,
  maxOutputTokens: 500, 
};

// Voor de ARTS (Dashboard)
export const createClinicalAnalysisPrompt = (
  systolic: number,
  diastolic: number,
  note: string
): string => {
  return `
    Rol: Medische administratieve assistent.
    Taak: Analyseer de bloeddrukmeting: ${systolic}/${diastolic} mmHg.
    Extra context van de arts: ${note || 'Geen'}.
    
    Output vereisten:
    1. Geef enkel de medische classificatie (bijv. "Hypertensie graad 1").
    2. Wees extreem beknopt en zakelijk.
    3. Geen introductie, geen "Hallo", geen advies. Alleen de feitelijke observatie.
    4. Taal: Nederlands.
  `;
};
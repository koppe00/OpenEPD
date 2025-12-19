export const AI_CONFIG = {
model: "gemini-2.5-flash-lite",
  temperature: 0.2, // Laag voor zakelijke precisie
  maxOutputTokens: 500, 
};

export const createClinicalAnalysisPrompt = (
  systolic: number,
  diastolic: number
): string => {
  return `
    Rol: Medische administratieve assistent.
    Taak: Analyseer de bloeddrukmeting: ${systolic}/${diastolic} mmHg.
    
    Output vereisten:
    1. Geef enkel de medische classificatie (bijv. "Hypertensie graad 1").
    2. Wees extreem beknopt en zakelijk.
    3. Geen introductie, geen "Hallo", geen advies. Alleen de feitelijke observatie.
    4. Taal: Nederlands.
  `;
};
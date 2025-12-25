export const AI_CONFIG = {
  model: "gemini-2.5-flash-lite", // Dit model staat in je lijst!
  temperature: 0.2,
  maxOutputTokens: 500, 
};

// Voor de PATIËNT (Portaal)
export const createPatientAdvicePrompt = (
  systolic: number,
  diastolic: number,
  note: string
): string => {
  return `
    Rol: Vriendelijke medische assistent.
    Taak: Leg de meting ${systolic}/${diastolic} mmHg uit aan de patiënt.
    Context arts: ${note || 'Geen'}.
    
    Output vereisten:
    1. Begrijpelijke taal voor de patiënt.
    2. 1-2 simpele tips, geruststellende toon.
    3. Maximaal 3 korte zinnen.
    4. Geen medisch jargon, taal: Nederlands.
  `;
};
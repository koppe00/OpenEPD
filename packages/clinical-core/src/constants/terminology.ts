/**
 * Officiële Terminologie Codes voor MedMij ZIB's
 * Bron: Nictiz (SNOMED CT & LOINC)
 */
export const ZIB_CODES = {
  BLOEDDRUK: {
    ZIB_ID: 'nl.zorg.Bloeddruk',
    SNOMED: '75367002', // Blood pressure (observable entity)
    LOINC: '85354-9',   // Blood pressure panel with all components
  },
  ALLERGIE: {
    ZIB_ID: 'nl.zorg.AllergieIntolerantie',
    SNOMED: '609328004', // Allergy to substance (disorder)
  },
  GEWICHT: {
    ZIB_ID: 'nl.zorg.Lichaamsgewicht',
    SNOMED: '27113001', // Body weight (observable entity)
    LOINC: '29463-7',
  }
};

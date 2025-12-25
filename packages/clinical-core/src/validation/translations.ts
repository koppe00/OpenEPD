// packages/clinical-core/src/validatie/translations.ts

export const ZibTranslations: Record<string, Record<string, string>> = {
  // Algemene Statussen
  status: {
    'Active': 'Actief',
    'Inactive': 'Inactief',
    'Resolved': 'Hersteld',
    'Planned': 'Gepland',
    'In progress': 'In uitvoering',
    'Completed': 'Voltooid',
    'Cancelled': 'Geannuleerd',
    'Entered in error': 'Per abuis ingevoerd'
  },
  // Houdingen & Locaties
  position: {
    'Sitting': 'Zittend',
    'Lying': 'Liggend',
    'Standing': 'Staand',
    'Left lateral': 'Linker zijligging'
  },
  location: {
    'Rectal': 'Rectaal',
    'Oral': 'Oraal',
    'Axillary': 'Oksel',
    'Tympanic': 'Oor (Tympaan)',
    'Forehead': 'Voorhoofd',
    'Bladder': 'Blaas'
  },
  // Specifieke Enums
  criticality: {
    'Low': 'Laag risico',
    'High': 'Hoog risico',
    'Unable to assess': 'Niet te beoordelen'
  },
  category: {
    'Food': 'Voeding',
    'Medication': 'Medicatie',
    'Environment': 'Omgeving',
    'Other': 'Overig'
  },
  usage_status: {
    'Current smoker': 'Huidige roker',
    'Ex-smoker': 'Ex-roker',
    'Never smoked': 'Nooit gerookt',
    'Unknown': 'Onbekend',
    'Current drinker': 'Huidige drinker',
    'Ex-drinker': 'Ex-drinker',
    'Non-drinker': 'Niet-drinker',
    'Using': 'In gebruik',
    'Not using': 'Niet in gebruik'
  },
  decision: {
    'Resuscitate': 'Wel reanimeren',
    'Do not resuscitate': 'Niet reanimeren'
  },
  malnutrition_status: {
    'Well nourished': 'Goed gevoed',
    'Moderately malnourished': 'Matig ondervoed',
    'Severely malnourished': 'Ernstig ondervoed'
  }
};
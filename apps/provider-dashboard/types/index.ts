// Definieer de app-rollen conform je database ENUM
export type AppRole = 'admin' | 'doctor' | 'nurse' | 'patient' | string;

export interface PatientProfile {
  // Identificatie
  id: string; 
  full_name: string | null;
  bsn_number: string | null;
  uzi_number?: string | null;
  big_registration_number?: string | null;
  intern_id?: string | null; // Mocht je deze nog gebruiken

  // Naamgegevens (zib-conform)
  first_name: string | null;
  last_name: string | null;
  initials: string | null;
  name_prefix: string | null; // tussenvoegsel
  nickname: string | null;
  name_use: string | null;

  // Demografie
  date_of_birth: string | null; // PostgreSQL 'date' komt als string 'YYYY-MM-DD'
  gender: string | null; // oude kolom
  administrative_gender: string | null; // HL7/zib kolom
  gender_identity: string | null;
  nationality: string | null;
  marital_status: string | null;
  preferred_language: string | null;
  multiple_birth_indicator: boolean | null;

  // Contact & Adres
  email: string | null;
  phone: string | null;
  address_street: string | null;
  address_house_number: string | null;
  address_zipcode: string | null;
  address_city: string | null;
  contact_preference: string | null;

  // Complexe data (JSONB)
  insurance_data: any[] | null; 
  emergency_contacts: any[] | null;
  consents: Record<string, any> | null;

  // Systeem velden
  is_patient: boolean | null;
  app_role: AppRole | null;
  wid_status: string | null; // Wet Identificatie bij Dienstverlening status
  specialty: string | null;
  avatar_url: string | null;
  updated_at: string | null;

  // Frontend helper (niet in DB)
  isRecent?: boolean;
  status?: 'present' | 'planned' | 'absent';
}

export interface VitalSign {
  id: string;
  systolic: number;
  diastolic: number;
  recorded_at: string;
  agent_note: string;
  storage_status: 'cloud_only' | 'synced' | 'local_only';
}
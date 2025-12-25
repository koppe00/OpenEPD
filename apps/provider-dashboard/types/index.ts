export interface PatientProfile {
  id: string;
  full_name: string;
  bsn_number: string;
  date_of_birth: string;
}

export interface VitalSign {
  id: string;
  systolic: number;
  diastolic: number;
  recorded_at: string;
  agent_note: string;
  storage_status: 'cloud_only' | 'synced' | 'local_only';
}
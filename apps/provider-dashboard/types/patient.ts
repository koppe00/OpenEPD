export interface PatientProfile {
  // Identificatie
  id?: string;
  bsn_number: string;
  
  // Naam
  initials: string;
  first_name: string;
  name_prefix?: string;
  last_name: string;
  nickname?: string;
  name_use: 'official' | 'maiden' | 'partner' | 'usual';
  
  // Demografie
  date_of_birth: string;
  administrative_gender: 'M' | 'F' | 'UN' | 'O';
  nationality: string;
  
  // Contact
  email: string;
  phone: string;
  address_street: string;
  address_house_number: string;
  address_zipcode: string;
  address_city: string;
  country_code: string;
  
  // Complex
  insurance_data: Array<{
    uzovi: string;
    insurer_name: string;
    policy_number: string;
    start_date?: string;
    end_date?: string;
  }>;
  
  emergency_contacts: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
}
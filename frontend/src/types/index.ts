export type Gender = 'M' | 'F' | 'Other';
export type IncidentStatus = 'Open' | 'Under Investigation' | 'Closed';
export type CriminalRole = 'Suspect' | 'Convict' | 'Victim' | 'Witness';
export type UserRole = 'Admin' | 'Officer';

export interface Person {
  person_id: number;
  nrc_number: string | null;
  full_name: string;
  alias_name: string | null;
  date_of_birth: string | null;
  gender: Gender;
  father_name: string | null;
  phone_number: string | null;
  current_address: string | null;
  photo_url: string | null;
}

export interface Incident {
  incident_id: number;
  case_number: string;
  title: string;
  description: string | null;
  incident_date: string;
  location: string;
  status: IncidentStatus;
}

export interface CriminalRecord {
  record_id: number;
  person_id: number;
  incident_id: number;
  role: CriminalRole;
  arrest_date: string | null;
  punishment: string | null;
  person_name?: string;
  nrc_number?: string | null;
  case_number?: string;
  incident_title?: string;
}

export interface Vehicle {
  vehicle_id: number;
  owner_id: number | null;
  license_plate: string | null;
  brand: string | null;
  model: string | null;
  color: string | null;
  owner_name?: string | null;
}

export interface AuthUser {
  user_id: number;
  badge_number: string;
  username: string;
  rank: string | null;
  role: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

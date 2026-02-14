
export type Hospital = {
  id: string;
  name: string;
  code: string;
  location: string;
};

export type Patient = {
  id: string;
  mrn: string;
  name: string;
  dob: string;
  gender: 'M' | 'F';
  address: string;
  phone: string;
};

export type EncounterStatus = 'waiting' | 'triaged' | 'doctor' | 'pharmacy' | 'billing' | 'finished';

export type Encounter = {
  id: string;
  patientId: string;
  hospitalId: string;
  type: 'Outpatient' | 'ER' | 'Inpatient';
  department: string;
  doctor: string;
  status: EncounterStatus;
  createdAt: string;
  soap?: SOAPNote;
  billingStatus: 'unpaid' | 'paid' | 'pending';
};

export type SOAPNote = {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

export type Medicine = {
  id: string;
  name: string;
  stock: number;
  unit: string;
  price: number;
};

export type Role = 'Admin' | 'Doctor' | 'Nurse' | 'Pharmacist' | 'Cashier' | 'Management';

export type User = {
  id: string;
  name: string;
  role: Role;
  hospitalId?: string; // If null, it's Group Management
};

export type ViewType = 'Dashboard' | 'Registration' | 'Clinical' | 'Pharmacy' | 'Billing' | 'Master';

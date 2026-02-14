
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
  nik: string; // National ID
  bpjs?: string; // BPJS Number
  email?: string;
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
  totalCharge?: number;
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

export type InsuranceProvider = {
  id: string;
  name: string;
  code: string;
};

export type ClaimStatus = 'Draft' | 'Submitted' | 'Processing' | 'Approved' | 'Rejected' | 'Incomplete';

export type Claim = {
  id: string;
  encounterId: string;
  providerId: string;
  status: ClaimStatus;
  amount: number;
  submittedAt?: string;
  notes?: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  hospitalId: string;
  department: string;
  doctor: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Cancelled' | 'Arrived';
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospitalIds: string[];
};

export type Role = 'Admin' | 'Doctor' | 'Nurse' | 'Pharmacist' | 'Cashier' | 'Management';

export type User = {
  id: string;
  name: string;
  role: Role;
  hospitalId?: string;
};

export type ViewType = 'Dashboard' | 'Registration' | 'Clinical' | 'Pharmacy' | 'Billing' | 'Claims' | 'Booking' | 'Master';

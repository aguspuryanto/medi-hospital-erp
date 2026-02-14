
import { Hospital, Patient, Encounter, Medicine } from './types';

export const HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'RS Medika Malang', code: 'MLG', location: 'Malang' },
  { id: 'h2', name: 'RS Medika Sukorejo', code: 'SKR', location: 'Pasuruan' },
  { id: 'h3', name: 'RS Medika Probolinggo', code: 'PRO', location: 'Probolinggo' },
];

export const MOCK_PATIENTS: Patient[] = [
  { id: 'p1', mrn: 'MRN-001', name: 'Budi Santoso', dob: '1985-05-12', gender: 'M', address: 'Jl. Ijen No. 10', phone: '08123456789' },
  { id: 'p2', mrn: 'MRN-002', name: 'Siti Aminah', dob: '1992-08-21', gender: 'F', address: 'Jl. Dieng No. 5', phone: '08198765432' },
  { id: 'p3', mrn: 'MRN-003', name: 'Andi Wijaya', dob: '1970-12-01', gender: 'M', address: 'Jl. Borobudur No. 2', phone: '08155443322' },
];

export const MOCK_MEDICINES: Medicine[] = [
  { id: 'm1', name: 'Paracetamol 500mg', stock: 1200, unit: 'tablet', price: 500 },
  { id: 'm2', name: 'Amoxicillin 500mg', stock: 450, unit: 'capsule', price: 1500 },
  { id: 'm3', name: 'Aspirin 100mg', stock: 800, unit: 'tablet', price: 800 },
  { id: 'm4', name: 'Insulin Glargine', stock: 50, unit: 'vial', price: 125000 },
];

export const INITIAL_ENCOUNTERS: Encounter[] = [
  { 
    id: 'e1', 
    patientId: 'p1', 
    hospitalId: 'h1', 
    type: 'Outpatient', 
    department: 'Internal Medicine', 
    doctor: 'Dr. John Doe', 
    status: 'finished', 
    createdAt: new Date().toISOString(),
    billingStatus: 'paid',
    soap: {
      subjective: 'Demam 3 hari',
      objective: 'T: 38.5C, N: 88x/m',
      assessment: 'Suspect Typhoid',
      plan: 'Widal test, Bedrest'
    }
  },
  { id: 'e2', patientId: 'p2', hospitalId: 'h1', type: 'ER', department: 'Emergency', doctor: 'Dr. Smith', status: 'doctor', createdAt: new Date().toISOString(), billingStatus: 'unpaid' },
  { id: 'e3', patientId: 'p3', hospitalId: 'h2', type: 'Outpatient', department: 'Pediatrics', doctor: 'Dr. Jane', status: 'waiting', createdAt: new Date().toISOString(), billingStatus: 'unpaid' },
];


import { Hospital, Patient, Encounter, Medicine, InsuranceProvider, Doctor } from './types';

export const HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'RS Medika Malang', code: 'MLG', location: 'Malang' },
  { id: 'h2', name: 'RS Medika Sukorejo', code: 'SKR', location: 'Pasuruan' },
  { id: 'h3', name: 'RS Medika Probolinggo', code: 'PRO', location: 'Probolinggo' },
];

export const INSURANCE_PROVIDERS: InsuranceProvider[] = [
  { id: 'ins1', name: 'BPJS Kesehatan', code: 'BPJS' },
  { id: 'ins2', name: 'Prudential Assurance', code: 'PRU' },
  { id: 'ins3', name: 'Allianz Life', code: 'ALZ' },
  { id: 'ins4', name: 'Manulife Indonesia', code: 'MNL' },
];

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. John Doe', specialty: 'Internal Medicine', hospitalIds: ['h1', 'h2'] },
  { id: 'd2', name: 'Dr. Jane Smith', specialty: 'Pediatrics', hospitalIds: ['h1', 'h3'] },
  { id: 'd3', name: 'Dr. Andi Wijaya', specialty: 'Cardiology', hospitalIds: ['h1', 'h2', 'h3'] },
  { id: 'd4', name: 'Dr. Siti Aminah', specialty: 'General Practitioner', hospitalIds: ['h1', 'h2', 'h3'] },
];

export const MOCK_PATIENTS: Patient[] = [
  { id: 'p1', mrn: 'MRN-001', name: 'Budi Santoso', dob: '1985-05-12', gender: 'M', address: 'Jl. Ijen No. 10', phone: '08123456789', nik: '3578011205850001', email: 'budi@example.com' },
  { id: 'p2', mrn: 'MRN-002', name: 'Siti Aminah', dob: '1992-08-21', gender: 'F', address: 'Jl. Dieng No. 5', phone: '08198765432', nik: '3578022108920002', bpjs: '0001234567890' },
  { id: 'p3', mrn: 'MRN-003', name: 'Andi Wijaya', dob: '1970-12-01', gender: 'M', address: 'Jl. Borobudur No. 2', phone: '08155443322', nik: '3578030112700003' },
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
    totalCharge: 450000,
    soap: {
      subjective: 'Demam 3 hari',
      objective: 'T: 38.5C, N: 88x/m',
      assessment: 'Suspect Typhoid',
      plan: 'Widal test, Bedrest'
    }
  },
  { id: 'e2', patientId: 'p2', hospitalId: 'h1', type: 'ER', department: 'Emergency', doctor: 'Dr. Smith', status: 'billing', createdAt: new Date().toISOString(), billingStatus: 'unpaid', totalCharge: 1250000 },
  { id: 'e3', patientId: 'p3', hospitalId: 'h2', type: 'Outpatient', department: 'Pediatrics', doctor: 'Dr. Jane', status: 'waiting', createdAt: new Date().toISOString(), billingStatus: 'unpaid', totalCharge: 300000 },
];

export const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

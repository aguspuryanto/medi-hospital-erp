
import React, { useState } from 'react';
import { Hospital, User, ViewType, Encounter, Claim, ClaimStatus, Appointment, Patient } from './types';
import { HOSPITALS, INITIAL_ENCOUNTERS, MOCK_PATIENTS } from './constants';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import RegistrationView from './components/RegistrationView';
import ClinicalView from './components/ClinicalView';
import ClaimsView from './components/ClaimsView';
import BookingView from './components/BookingView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('Dashboard');
  const [activeHospital, setActiveHospital] = useState<Hospital>(HOSPITALS[0]);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [encounters, setEncounters] = useState<Encounter[]>(INITIAL_ENCOUNTERS);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Simulated current user
  const [currentUser] = useState<User>({
    id: 'u1',
    name: 'Admin MedisSync',
    role: 'Admin'
  });

  const handleAddEncounter = (newEncounter: Encounter) => {
    setEncounters(prev => [newEncounter, ...prev]);
  };

  const handleUpdateEncounter = (updatedEncounter: Encounter) => {
    setEncounters(prev => prev.map(e => e.id === updatedEncounter.id ? updatedEncounter : e));
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
  };

  const handleAddClaim = (claim: Claim) => {
    setClaims(prev => [claim, ...prev]);
  };

  const handleUpdateClaimStatus = (claimId: string, status: ClaimStatus) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status } : c));
  };

  const handleAddAppointment = (app: Appointment) => {
    setAppointments(prev => [app, ...prev]);
  };

  const renderView = () => {
    switch (activeView) {
      case 'Dashboard':
        return <DashboardView encounters={encounters} hospital={activeHospital} />;
      case 'Registration':
        return (
          <RegistrationView 
            hospital={activeHospital} 
            patients={patients}
            encounters={encounters} 
            onAddEncounter={handleAddEncounter}
            onAddPatient={handleAddPatient}
          />
        );
      case 'Booking':
        return (
          <BookingView 
            onAddAppointment={handleAddAppointment}
            appointments={appointments}
          />
        );
      case 'Clinical':
        return (
          <ClinicalView 
            encounters={encounters.filter(e => e.hospitalId === activeHospital.id)} 
            onUpdateEncounter={handleUpdateEncounter}
          />
        );
      case 'Claims':
        return (
          <ClaimsView 
            encounters={encounters}
            claims={claims}
            onAddClaim={handleAddClaim}
            onUpdateClaimStatus={handleUpdateClaimStatus}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="text-6xl">🛠️</div>
            <h2 className="text-xl font-bold">Module Under Maintenance</h2>
            <p>The {activeView} module is currently being configured for {activeHospital.name}.</p>
          </div>
        );
    }
  };

  return (
    <Layout
      activeView={activeView}
      setActiveView={setActiveView}
      activeHospital={activeHospital}
      setActiveHospital={setActiveHospital}
      currentUser={currentUser}
    >
      {renderView()}
    </Layout>
  );
};

export default App;

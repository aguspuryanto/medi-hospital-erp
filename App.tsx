
import React, { useState } from 'react';
import { Hospital, User, ViewType, Encounter } from './types';
import { HOSPITALS, INITIAL_ENCOUNTERS } from './constants';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import RegistrationView from './components/RegistrationView';
import ClinicalView from './components/ClinicalView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('Dashboard');
  const [activeHospital, setActiveHospital] = useState<Hospital>(HOSPITALS[0]);
  const [encounters, setEncounters] = useState<Encounter[]>(INITIAL_ENCOUNTERS);

  // Simulated current user - In a real app, this would come from auth context
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

  const renderView = () => {
    switch (activeView) {
      case 'Dashboard':
        return <DashboardView encounters={encounters} hospital={activeHospital} />;
      case 'Registration':
        return (
          <RegistrationView 
            hospital={activeHospital} 
            encounters={encounters} 
            onAddEncounter={handleAddEncounter} 
          />
        );
      case 'Clinical':
        return (
          <ClinicalView 
            encounters={encounters.filter(e => e.hospitalId === activeHospital.id)} 
            onUpdateEncounter={handleUpdateEncounter}
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


import React, { useState } from 'react';
import { Patient, Encounter, Hospital } from '../types';
import { MOCK_PATIENTS } from '../constants';

interface RegistrationViewProps {
  hospital: Hospital;
  encounters: Encounter[];
  onAddEncounter: (e: Encounter) => void;
}

const RegistrationView: React.FC<RegistrationViewProps> = ({ hospital, encounters, onAddEncounter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = MOCK_PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.mrn.includes(searchTerm)
  );

  const handleRegister = (p: Patient) => {
    const newEncounter: Encounter = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: p.id,
      hospitalId: hospital.id,
      type: 'Outpatient',
      department: 'General Medicine',
      doctor: 'Dr. On Duty',
      status: 'waiting',
      createdAt: new Date().toISOString(),
      billingStatus: 'unpaid'
    };
    onAddEncounter(newEncounter);
    setSelectedPatient(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Search & Selection */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Patient Search</h3>
          <input
            type="text"
            placeholder="Search by MRN or Name..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="mt-4 border-t border-slate-100 pt-4 space-y-2 max-h-64 overflow-y-auto">
            {filteredPatients.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${
                  selectedPatient?.id === p.id ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-slate-50 border-transparent'
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.mrn} • {p.dob}</p>
                </div>
                <span className="text-indigo-600 font-bold text-lg">→</span>
              </button>
            ))}
          </div>
        </div>

        {selectedPatient && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Registration Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Visit Type</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm">
                  <option>Outpatient (Rawat Jalan)</option>
                  <option>Emergency (IGD)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Department</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm">
                  <option>General Medicine</option>
                  <option>Pediatrics</option>
                  <option>Cardiology</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => handleRegister(selectedPatient)}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-shadow shadow-md hover:shadow-lg"
            >
              Check-in Patient
            </button>
          </div>
        )}
      </div>

      {/* Queue display */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Today's Appointments</h3>
          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">
            {encounters.filter(e => e.hospitalId === hospital.id).length} Active
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold sticky top-0">
              <tr>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Dept</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {encounters
                .filter(e => e.hospitalId === hospital.id)
                .map((e, idx) => {
                  const patient = MOCK_PATIENTS.find(p => p.id === e.patientId);
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-800">{patient?.name}</p>
                        <p className="text-xs text-slate-400">{patient?.mrn}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{e.department}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          e.status === 'finished' ? 'bg-emerald-100 text-emerald-700' :
                          e.status === 'waiting' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {encounters.filter(e => e.hospitalId === hospital.id).length === 0 && (
             <div className="p-12 text-center text-slate-400">
                <p>No patients checked in yet for today.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationView;

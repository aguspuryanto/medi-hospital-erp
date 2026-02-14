
import React, { useState } from 'react';
import { Patient, Encounter, Hospital } from '../types';

interface RegistrationViewProps {
  hospital: Hospital;
  patients: Patient[];
  encounters: Encounter[];
  onAddEncounter: (e: Encounter) => void;
  onAddPatient: (p: Patient) => void;
}

const RegistrationView: React.FC<RegistrationViewProps> = ({ hospital, patients, encounters, onAddEncounter, onAddPatient }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    name: '',
    dob: '',
    gender: 'M' as 'M' | 'F',
    nik: '',
    bpjs: '',
    phone: '',
    email: '',
    address: ''
  });

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.mrn.includes(searchTerm) ||
    p.nik.includes(searchTerm)
  );

  const handleRegisterVisit = (p: Patient) => {
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

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const patientData: Patient = {
      id: `p-${Date.now()}`,
      mrn: `MRN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newPatient.name,
      dob: newPatient.dob,
      gender: newPatient.gender,
      nik: newPatient.nik,
      bpjs: newPatient.bpjs,
      phone: newPatient.phone,
      email: newPatient.email,
      address: newPatient.address,
    };
    onAddPatient(patientData);
    setShowAddForm(false);
    setNewPatient({ name: '', dob: '', gender: 'M', nik: '', bpjs: '', phone: '', email: '', address: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
      {/* Registration Form / Search Sidebar */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Cari Pasien</h3>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all shadow-sm"
            >
              <span>+</span>
              <span>Tambah Pasien Baru</span>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by MRN, Name, or NIK..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="mt-4 border-t border-slate-100 pt-4 space-y-2 max-h-64 overflow-y-auto">
            {filteredPatients.length > 0 ? filteredPatients.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${
                  selectedPatient?.id === p.id ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-slate-50 border-transparent'
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-800">{p.name}</p>
                  <div className="flex space-x-2 text-[10px] text-slate-400 mt-1 uppercase font-mono">
                    <span>{p.mrn}</span>
                    <span>•</span>
                    <span>NIK: {p.nik}</span>
                  </div>
                </div>
                <span className="text-indigo-600 font-bold text-lg">→</span>
              </button>
            )) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                Pasien tidak ditemukan.
              </div>
            )}
          </div>
        </div>

        {selectedPatient && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-800">Registrasi Kunjungan</h3>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-red-500 text-lg">×</button>
            </div>
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-sm font-bold text-slate-700">{selectedPatient.name}</p>
              <p className="text-xs text-slate-500">{selectedPatient.dob} ({selectedPatient.gender === 'M' ? 'Pria' : 'Wanita'})</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Tipe Kunjungan</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm">
                  <option>Rawat Jalan</option>
                  <option>IGD</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Poliklinik</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm">
                  <option>Umum</option>
                  <option>Anak</option>
                  <option>Jantung</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => handleRegisterVisit(selectedPatient)}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-shadow shadow-md"
            >
              Daftarkan Kunjungan
            </button>
          </div>
        )}
      </div>

      {/* Queue display */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Antrian Hari Ini</h3>
          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">
            {encounters.filter(e => e.hospitalId === hospital.id).length} Kunjungan
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold sticky top-0">
              <tr>
                <th className="px-6 py-3">Pasien</th>
                <th className="px-6 py-3">Poliklinik</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {encounters
                .filter(e => e.hospitalId === hospital.id)
                .map((e, idx) => {
                  const patient = patients.find(p => p.id === e.patientId);
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
                <p>Belum ada kunjungan terdaftar hari ini.</p>
             </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-900 text-white">
              <h3 className="text-xl font-bold">Registrasi Pasien Baru</h3>
              <button onClick={() => setShowAddForm(false)} className="text-indigo-200 hover:text-white text-2xl">×</button>
            </div>
            <form onSubmit={handleCreatePatient} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Nama Lengkap *</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Contoh: Budi Santoso"
                    value={newPatient.name}
                    onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">NIK (Sesuai KTP) *</label>
                  <input
                    required
                    type="text"
                    maxLength={16}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="16 Digit NIK"
                    value={newPatient.nik}
                    onChange={e => setNewPatient({...newPatient, nik: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Jenis Kelamin *</label>
                  <div className="flex space-x-4 h-[42px] items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        name="gender"
                        checked={newPatient.gender === 'M'}
                        onChange={() => setNewPatient({...newPatient, gender: 'M'})}
                      />
                      <span className="text-sm text-slate-700">Pria</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        name="gender"
                        checked={newPatient.gender === 'F'}
                        onChange={() => setNewPatient({...newPatient, gender: 'F'})}
                      />
                      <span className="text-sm text-slate-700">Wanita</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Tanggal Lahir *</label>
                  <input
                    required
                    type="date"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newPatient.dob}
                    onChange={e => setNewPatient({...newPatient, dob: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Nomor BPJS (Opsional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="13 Digit No. BPJS"
                    value={newPatient.bpjs}
                    onChange={e => setNewPatient({...newPatient, bpjs: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Nomor HP</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="08xxxxxxxxxx"
                    value={newPatient.phone}
                    onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="email@contoh.com"
                    value={newPatient.email}
                    onChange={e => setNewPatient({...newPatient, email: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Alamat Domisili</label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Nama jalan, nomor rumah, RT/RW..."
                    value={newPatient.address}
                    onChange={e => setNewPatient({...newPatient, address: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  Simpan Pasien Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationView;

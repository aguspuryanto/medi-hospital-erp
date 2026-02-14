
import React, { useState } from 'react';
import { Hospital, Doctor, Appointment } from '../types';
import { HOSPITALS, MOCK_DOCTORS, TIME_SLOTS } from '../constants';

interface BookingViewProps {
  onAddAppointment: (app: Appointment) => void;
  appointments: Appointment[];
}

const BookingView: React.FC<BookingViewProps> = ({ onAddAppointment, appointments }) => {
  const [step, setStep] = useState(1);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");

  const doctorsInHospital = MOCK_DOCTORS.filter(d => 
    selectedHospital ? d.hospitalIds.includes(selectedHospital.id) : false
  );

  const handleBook = () => {
    if (!selectedHospital || !selectedDoctor || !selectedSlot || !patientName) return;

    const newApp: Appointment = {
      id: `APP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      patientName,
      hospitalId: selectedHospital.id,
      department: selectedDoctor.specialty,
      doctor: selectedDoctor.name,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'Confirmed'
    };

    onAddAppointment(newApp);
    setStep(4); // Success state
  };

  const reset = () => {
    setStep(1);
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setPatientName("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Steps Header */}
      <div className="flex justify-between mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map(s => (
          <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step >= s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'
          }`}>
            {s}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="p-10 space-y-8 flex-1 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Where would you like to visit?</h2>
              <p className="text-slate-500">Select a facility across our network.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HOSPITALS.map(h => (
                <button
                  key={h.id}
                  onClick={() => { setSelectedHospital(h); setStep(2); }}
                  className="group p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 text-left transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    🏥
                  </div>
                  <h4 className="font-bold text-slate-800">{h.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{h.location}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-10 space-y-8 flex-1 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Choose a Specialist</h2>
                <p className="text-slate-500">Available doctors at {selectedHospital?.name}</p>
              </div>
              <button onClick={() => setStep(1)} className="text-slate-400 hover:text-indigo-600 font-bold text-sm underline">Back</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctorsInHospital.map(d => (
                <button
                  key={d.id}
                  onClick={() => { setSelectedDoctor(d); setStep(3); }}
                  className="flex items-center space-x-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                    {d.name.split(' ')[1][0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{d.name}</h4>
                    <p className="text-xs text-indigo-600 font-semibold">{d.specialty}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-10 space-y-8 flex-1 animate-in fade-in slide-in-from-right-4">
             <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Finalize Appointment</h2>
                <p className="text-slate-500">With {selectedDoctor?.name} at {selectedHospital?.name}</p>
              </div>
              <button onClick={() => setStep(2)} className="text-slate-400 hover:text-indigo-600 font-bold text-sm underline">Back</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Patient Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Enter patient name..."
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Preferred Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Available Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-lg text-sm font-bold transition-all border ${
                        selectedSlot === slot 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105' 
                        : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
               <button
                  disabled={!patientName || !selectedSlot}
                  onClick={handleBook}
                  className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all text-lg ${
                    patientName && selectedSlot 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirm Booking Now
                </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-20 text-center flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl">
              ✓
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Booking Successful!</h2>
              <p className="text-slate-500 mt-2">Appointment ID: {appointments[appointments.length - 1]?.id}</p>
              <p className="text-sm text-slate-400 max-w-xs mx-auto mt-4">
                A confirmation SMS has been sent to the patient. Please arrive 15 minutes early for check-in.
              </p>
            </div>
            <button
              onClick={reset}
              className="px-8 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
            >
              Book Another Appointment
            </button>
          </div>
        )}
      </div>

      {/* Appointment History List */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Bookings</h3>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No recent bookings found.</p>
          ) : (
            appointments.map(app => (
              <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm font-bold text-slate-700">
                    📅
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{app.patientName}</h4>
                    <p className="text-xs text-slate-500">{app.doctor} • {app.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-600">{app.date}</p>
                  <p className="text-xs font-medium text-slate-500">{app.timeSlot}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingView;

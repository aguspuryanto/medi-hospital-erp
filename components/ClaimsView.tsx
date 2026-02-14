
import React, { useState } from 'react';
import { Encounter, Claim, InsuranceProvider, ClaimStatus, Patient } from '../types';
import { INSURANCE_PROVIDERS, MOCK_PATIENTS } from '../constants';

interface ClaimsViewProps {
  encounters: Encounter[];
  claims: Claim[];
  onAddClaim: (claim: Claim) => void;
  onUpdateClaimStatus: (claimId: string, status: ClaimStatus) => void;
}

const ClaimsView: React.FC<ClaimsViewProps> = ({ encounters, claims, onAddClaim, onUpdateClaimStatus }) => {
  const [selectedEncounterId, setSelectedEncounterId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState(INSURANCE_PROVIDERS[0].id);

  // Ready for claim: Encounters with billing status unpaid or pending but has totalCharge
  const readyEncounters = encounters.filter(e => e.status === 'billing' || e.status === 'finished');

  const handleSubmitClaim = (e: Encounter) => {
    const newClaim: Claim = {
      id: `CLM-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      encounterId: e.id,
      providerId: selectedProviderId,
      status: 'Submitted',
      amount: e.totalCharge || 0,
      submittedAt: new Date().toISOString(),
    };
    onAddClaim(newClaim);
    setSelectedEncounterId(null);

    // Mock response after 3 seconds
    setTimeout(() => {
      onUpdateClaimStatus(newClaim.id, 'Processing');
    }, 3000);
  };

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Processing': return 'bg-amber-100 text-amber-700';
      case 'Submitted': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Pending Claims List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Electronic Claim Bridge</h3>
              <div className="flex space-x-2">
                <span className="text-xs font-medium text-slate-500">Auto-Bridging:</span>
                <span className="text-xs font-bold text-emerald-600">ACTIVE</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-3">Claim ID</th>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-6 py-3">Insurer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {claims.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No active claims found.</td></tr>
                  ) : (
                    claims.map(claim => {
                      const encounter = encounters.find(e => e.id === claim.encounterId);
                      const patient = MOCK_PATIENTS.find(p => p.id === encounter?.patientId);
                      const provider = INSURANCE_PROVIDERS.find(i => i.id === claim.providerId);
                      return (
                        <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-mono text-slate-600">{claim.id}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-slate-800">{patient?.name}</p>
                            <p className="text-[10px] text-slate-400">{patient?.mrn}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">{provider?.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-900 font-bold">Rp {claim.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(claim.status)}`}>
                              {claim.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold">Details</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Submission Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Submit New Claim</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1 uppercase">Select Patient Encounter</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setSelectedEncounterId(e.target.value)}
                  value={selectedEncounterId || ""}
                >
                  <option value="">-- Select --</option>
                  {readyEncounters.map(e => {
                    const p = MOCK_PATIENTS.find(p => p.id === e.patientId);
                    return (
                      <option key={e.id} value={e.id}>
                        {p?.name} ({e.type} - Rp {e.totalCharge?.toLocaleString()})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1 uppercase">Insurance Provider</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                >
                  {INSURANCE_PROVIDERS.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>

              <div className="pt-4">
                <button
                  disabled={!selectedEncounterId}
                  onClick={() => {
                    const e = encounters.find(enc => enc.id === selectedEncounterId);
                    if (e) handleSubmitClaim(e);
                  }}
                  className={`w-full font-bold py-3 rounded-lg shadow transition-all ${
                    selectedEncounterId 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Bridge to Provider →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 text-white p-6 rounded-xl border border-indigo-800 shadow-sm">
            <h4 className="font-bold mb-2 flex items-center space-x-2">
              <span>📡</span>
              <span>Electronic Data Interchange</span>
            </h4>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Standardized ICD-10 & INA-CBG coding is automatically applied. Ensure SOAP assessments are complete before submission to minimize rejections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimsView;

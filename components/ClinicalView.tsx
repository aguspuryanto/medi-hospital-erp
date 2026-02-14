
import React, { useState } from 'react';
import { Encounter, SOAPNote, Patient } from '../types';
import { MOCK_PATIENTS } from '../constants';
import { getSOAPAssistant } from '../services/geminiService';

interface ClinicalViewProps {
  encounters: Encounter[];
  onUpdateEncounter: (e: Encounter) => void;
}

const ClinicalView: React.FC<ClinicalViewProps> = ({ encounters, onUpdateEncounter }) => {
  const [activeEncounter, setActiveEncounter] = useState<Encounter | null>(null);
  const [soap, setSoap] = useState<SOAPNote>({ subjective: '', objective: '', assessment: '', plan: '' });
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const waitingList = encounters.filter(e => e.status !== 'finished');

  const handleOpenEMR = (e: Encounter) => {
    setActiveEncounter(e);
    setSoap(e.soap || { subjective: '', objective: '', assessment: '', plan: '' });
    setAiSuggestion(null);
  };

  const handleAiAssist = async () => {
    setIsAiLoading(true);
    const suggestion = await getSOAPAssistant(soap);
    setAiSuggestion(suggestion);
    setIsAiLoading(false);
  };

  const handleSave = () => {
    if (activeEncounter) {
      onUpdateEncounter({
        ...activeEncounter,
        status: 'pharmacy',
        soap: soap
      });
      setActiveEncounter(null);
    }
  };

  return (
    <div className="flex space-x-8 h-full">
      {/* Patient List Sidebar */}
      <div className="w-80 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">Waiting Room</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {waitingList.map(e => {
            const p = MOCK_PATIENTS.find(pat => pat.id === e.patientId);
            return (
              <button
                key={e.id}
                onClick={() => handleOpenEMR(e)}
                className={`w-full text-left p-4 border-b border-slate-50 transition-colors ${
                  activeEncounter?.id === e.id ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-slate-800">{p?.name}</p>
                  <span className="text-[10px] bg-slate-200 px-1.5 rounded font-mono">{e.type}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{e.department}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main EMR Form */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-8 flex flex-col overflow-hidden">
        {activeEncounter ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {MOCK_PATIENTS.find(p => p.id === activeEncounter.patientId)?.name}
                </h2>
                <p className="text-slate-500 font-medium">SOAP Entry • {activeEncounter.department}</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleAiAssist}
                  disabled={isAiLoading}
                  className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 hover:bg-indigo-100 transition-colors"
                >
                  <span>✨</span>
                  <span>{isAiLoading ? 'Analyzing...' : 'AI Assistant'}</span>
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md"
                >
                  Finalize & Order Pharmacy
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6 overflow-y-auto pr-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Subjective (S)</label>
                  <textarea
                    className="w-full h-24 p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Patient complaints, history of illness..."
                    value={soap.subjective}
                    onChange={e => setSoap({ ...soap, subjective: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Objective (O)</label>
                  <textarea
                    className="w-full h-24 p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Physical exam results, vital signs..."
                    value={soap.objective}
                    onChange={e => setSoap({ ...soap, objective: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Assessment (A)</label>
                  <textarea
                    className="w-full h-24 p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Diagnosis or diagnostic hypothesis..."
                    value={soap.assessment}
                    onChange={e => setSoap({ ...soap, assessment: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 flex flex-col">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Plan (P)</label>
                  <textarea
                    className="w-full h-40 p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Orders, medications, education..."
                    value={soap.plan}
                    onChange={e => setSoap({ ...soap, plan: e.target.value })}
                  />
                </div>
                
                {aiSuggestion && (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2 text-emerald-800">
                      <span className="text-lg">💡</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider">Clinical Insight</h4>
                    </div>
                    <p className="text-xs text-emerald-700 leading-relaxed italic">{aiSuggestion}</p>
                    <button 
                      onClick={() => setSoap(prev => ({ ...prev, plan: prev.plan + "\n" + aiSuggestion }))}
                      className="mt-3 text-[10px] text-emerald-600 font-bold border-b border-emerald-200 hover:border-emerald-600"
                    >
                      + ADD TO PLAN
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="text-6xl mb-4">🩺</div>
            <p className="text-lg font-medium">Select a patient to start EMR session</p>
            <p className="text-sm">Clinical notes will be automatically bridged to pharmacy and billing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalView;

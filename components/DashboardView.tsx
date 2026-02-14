
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Encounter, Hospital } from '../types';
import { getDashboardInsights } from '../services/geminiService';

interface DashboardViewProps {
  encounters: Encounter[];
  hospital: Hospital;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DashboardView: React.FC<DashboardViewProps> = ({ encounters, hospital }) => {
  const [insights, setInsights] = useState<string>("Loading AI insights...");

  useEffect(() => {
    getDashboardInsights(encounters).then(setInsights);
  }, [encounters]);

  const hospitalEncounters = encounters.filter(e => e.hospitalId === hospital.id);
  
  // Stats
  const data = [
    { name: 'ER', value: hospitalEncounters.filter(e => e.type === 'ER').length },
    { name: 'Outpatient', value: hospitalEncounters.filter(e => e.type === 'Outpatient').length },
    { name: 'Inpatient', value: hospitalEncounters.filter(e => e.type === 'Inpatient').length },
  ];

  const statusData = [
    { name: 'Waiting', value: hospitalEncounters.filter(e => e.status === 'waiting').length },
    { name: 'Finished', value: hospitalEncounters.filter(e => e.status === 'finished').length },
    { name: 'Pharmacy', value: hospitalEncounters.filter(e => e.status === 'pharmacy').length },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Daily Visits</p>
          <h3 className="text-3xl font-bold text-slate-900">{hospitalEncounters.length}</h3>
          <p className="text-emerald-600 text-xs mt-1 font-semibold">↑ 12% vs yesterday</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Pharmacy Queue</p>
          <h3 className="text-3xl font-bold text-slate-900">
            {hospitalEncounters.filter(e => e.status === 'pharmacy').length}
          </h3>
          <p className="text-slate-400 text-xs mt-1">Average wait: 15m</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Occupancy (BOR)</p>
          <h3 className="text-3xl font-bold text-slate-900">72%</h3>
          <p className="text-amber-500 text-xs mt-1 font-semibold">Near capacity</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Revenue (Today)</p>
          <h3 className="text-3xl font-bold text-slate-900">Rp 12.5M</h3>
          <p className="text-slate-400 text-xs mt-1">Cash & Penjamin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">Patient Mix by Department</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl">✨</span>
            <h4 className="text-lg font-bold text-indigo-900">MedisSync AI Insights</h4>
          </div>
          <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-line">
            {insights}
          </p>
          <div className="mt-6 pt-6 border-t border-indigo-200">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-2">Operational Tip</p>
            <p className="text-sm text-indigo-700 italic">"Based on current trends, reallocating nurses from Outpatient to ER during peak hours (18:00-20:00) could reduce wait times by 20%."</p>
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">Patient Status Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-2">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-xs text-slate-500 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Today's Alerts</h4>
          <div className="space-y-4">
            {[
              { type: 'stock', text: 'Paracetamol stock critical (< 100 tablets)', severity: 'high' },
              { type: 'billing', text: '5 Invoices pending more than 48 hours', severity: 'medium' },
              { type: 'emr', text: 'Dr. Jane has 3 unsigned medical records', severity: 'low' }
            ].map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-lg flex items-start space-x-3 ${
                alert.severity === 'high' ? 'bg-red-50 text-red-700 border border-red-100' :
                alert.severity === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                'bg-slate-50 text-slate-700 border border-slate-100'
              }`}>
                <span className="text-lg">{alert.severity === 'high' ? '🚨' : '⚠️'}</span>
                <p className="text-sm font-medium">{alert.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;

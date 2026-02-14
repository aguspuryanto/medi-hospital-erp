
import React from 'react';
import { Hospital, User, ViewType } from '../types';
import { HOSPITALS } from '../constants';

interface LayoutProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  activeHospital: Hospital;
  setActiveHospital: (h: Hospital) => void;
  currentUser: User;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  activeView, 
  setActiveView, 
  activeHospital, 
  setActiveHospital, 
  currentUser,
  children 
}) => {
  const menuItems: { id: ViewType; label: string; icon: string }[] = [
    { id: 'Dashboard', label: 'Dashboard KPI', icon: '📊' },
    { id: 'Registration', label: 'Registration', icon: '📝' },
    { id: 'Clinical', label: 'Clinical EMR', icon: '🩺' },
    { id: 'Pharmacy', label: 'Pharmacy', icon: '💊' },
    { id: 'Billing', label: 'Billing/Cashier', icon: '💳' },
    { id: 'Master', label: 'Master Data', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">M</div>
          <span className="text-xl font-bold tracking-tight">MedisSync</span>
        </div>
        
        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors ${
                activeView === item.id ? 'bg-indigo-800 border-l-4 border-white' : 'hover:bg-indigo-800/50'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 bg-indigo-950/50 border-t border-indigo-800">
          <p className="text-xs text-indigo-400 uppercase font-bold tracking-wider mb-2">Facility</p>
          <select 
            value={activeHospital.id}
            onChange={(e) => {
              const h = HOSPITALS.find(hos => hos.id === e.target.value);
              if (h) setActiveHospital(h);
            }}
            className="w-full bg-indigo-800 text-white border-none rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {HOSPITALS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-slate-800">{activeView}</h1>
            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded border border-slate-200 uppercase font-mono">
              {activeHospital.code}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800 leading-none">{currentUser.name}</p>
              <p className="text-xs text-slate-500">{currentUser.role} at {activeHospital.location}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
              {currentUser.name[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useNotification } from '../../context/NotificationContext.js';
import { Shield, UserCheck, Wrench, ShoppingBag, User, ChevronDown, ChevronUp, LogOut, Check } from 'lucide-react';

export const QuickRoleSwitcher: React.FC = () => {
  const { user, switchDemoRole, logout } = useAuth();
  const { showToast } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      key: 'admin' as const,
      label: 'Super Admin',
      name: 'Yohannes Getachew',
      desc: 'Full platform access, audit logs, settings & financials',
      icon: Shield,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      key: 'sales' as const,
      label: 'Sales & Estimator',
      name: 'Marta Worku',
      desc: 'Quotes pipeline, pricing breakdown, order approvals',
      icon: UserCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      key: 'tech' as const,
      label: 'Senior Field Tech',
      name: 'Dawit Bekele',
      desc: 'Assigned projects, milestone staging, support tickets',
      icon: Wrench,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      key: 'shop' as const,
      label: 'Shop & Inventory',
      name: 'Selamawit Tadesse',
      desc: 'Product catalog, stock adjustments & transactions',
      icon: ShoppingBag,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      key: 'customer1' as const,
      label: 'Customer (Horizon RE)',
      name: 'Abebe Kebede',
      desc: 'Active projects, approved quotes, warranties & tickets',
      icon: User,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      key: 'customer2' as const,
      label: 'Customer (Grand Mall)',
      name: 'Tigist Haile',
      desc: 'Commercial CCTV project, orders, pending quotes',
      icon: User,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
    }
  ];

  const handleSelectRole = async (key: 'admin' | 'sales' | 'tech' | 'shop' | 'customer1' | 'customer2', label: string) => {
    await switchDemoRole(key);
    showToast('Role Switched', `Logged in as ${label}`, 'SUCCESS');
    setIsOpen(false);
  };

  return (
    <div id="quick-role-switcher" className="fixed bottom-4 left-4 z-50 no-print">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 w-80">
        <button
          id="btn-toggle-role-switcher"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-[#07111F] text-white flex items-center justify-between hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide uppercase">Role Switcher (Demo Mode)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
              {user ? user.role : 'GUEST'}
            </span>
            {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {isOpen && (
          <div className="p-3 max-h-96 overflow-y-auto space-y-1.5 bg-slate-50">
            <div className="px-2 py-1 text-[11px] font-medium text-slate-500">
              Select an account to test permissions & workflows:
            </div>
            {roles.map(r => {
              const Icon = r.icon;
              const isCurrent = user?.name === r.name;
              return (
                <button
                  key={r.key}
                  id={`role-btn-${r.key}`}
                  onClick={() => handleSelectRole(r.key, r.label)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-white border-[#1F6FEB] shadow-sm ring-1 ring-[#1F6FEB]/20'
                      : 'bg-white/80 hover:bg-white border-slate-200/60 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg border ${r.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{r.label}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-[#1F6FEB]" />}
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 truncate">{r.name}</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{r.desc}</p>
                  </div>
                </button>
              );
            })}

            {user && (
              <button
                id="btn-demo-logout"
                onClick={async () => {
                  await logout();
                  showToast('Logged Out', 'Switched to guest mode', 'INFO');
                  setIsOpen(false);
                }}
                className="w-full mt-2 p-2 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center justify-center gap-2 border border-rose-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out (Guest Mode)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

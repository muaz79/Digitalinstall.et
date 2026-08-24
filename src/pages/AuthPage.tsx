import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNotification } from '../context/NotificationContext.js';
import { ShieldCheck, Lock, Mail, User, Phone, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

interface AuthPageProps {
  navigate: (path: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ navigate }) => {
  const { login, register, switchRole } = useAuth();
  const { showToast } = useNotification();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+251 911 223 344');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'LOGIN') {
        await login(email, password);
        showToast('Signed In', 'Welcome to DIGITAL INSTALL engineering portal.', 'SUCCESS');
        navigate('/account');
      } else {
        if (!name) {
          showToast('Name Required', 'Please enter your name.', 'WARNING');
          return;
        }
        await register(email, password, name, phone);
        showToast('Account Created', 'Your account has been registered successfully.', 'SUCCESS');
        navigate('/account');
      }
    } catch (err: any) {
      showToast('Authentication Error', err.message, 'ALERT');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (role: 'ADMIN' | 'ENGINEER' | 'CUSTOMER') => {
    switchRole(role);
    showToast('Demo Account Switched', `Logged in as ${role}`, 'INFO');
    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/account');
    }
  };

  return (
    <div id="auth-page" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#07111F] text-white flex items-center justify-center mx-auto shadow-xl border border-slate-700">
            <Zap className="w-7 h-7 text-[#1F6FEB]" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            DIGITAL INSTALL
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Engineering & Technology Portal • Addis Ababa
          </p>
        </div>

        {/* Auth Form Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg space-y-6">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => { setMode('LOGIN'); setEmail('customer@example.com'); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'LOGIN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('REGISTER'); setEmail(''); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'REGISTER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'REGISTER' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name / Organization *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Solomon Haile"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                  required
                />
              </div>
            </div>

            {mode === 'REGISTER' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number (Ethiopia) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+251 9..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : mode === 'LOGIN' ? 'Sign In to Portal' : 'Create Engineering Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Instant Demo Logins */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block text-center uppercase tracking-wider">
              1-Click Demo Profiles
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect('CUSTOMER')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold text-center transition-colors"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('ENGINEER')}
                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#1F6FEB] text-[11px] font-bold text-center transition-colors"
              >
                Engineer
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('ADMIN')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold text-center transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

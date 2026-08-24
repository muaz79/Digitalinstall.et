import React from 'react';
import { Zap, Award, Shield, Users, CheckCircle2, ChevronRight, Phone, Mail, MapPin, Building2, Wrench } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const leadership = [
    { name: 'Yohannes Getachew', role: 'Managing Director & Lead Systems Engineer', spec: 'MSc Electrical Engineering, 14+ Years in Ethiopian Infrastructure' },
    { name: 'Dawit Bekele', role: 'Senior Field Engineering Supervisor', spec: 'BSc Telecom & CCTV Networks, Certified Fluke & Fiber Specialist' },
    { name: 'Marta Worku', role: 'Head of Engineering Estimations & Sales', spec: 'Civil & Systems Estimator, 9+ Years Turnkey Project Management' },
    { name: 'Selamawit Tadesse', role: 'Supply Chain & Inventory Director', spec: 'International Hardware Procurement & Authorized Distributorship' }
  ];

  return (
    <div id="about-page" className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-[#07111F] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F6FEB] font-bold">About DIGITAL INSTALL</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1F6FEB] text-white">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">Company Profile & Standards</span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Engineering Excellence in Ethiopia
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            DIGITAL INSTALL is an Ethiopian engineering and technology solutions provider dedicated to elevating residential, commercial, and industrial facilities with reliable, safe, and intelligent systems.
          </p>
        </div>
      </section>

      {/* Pillars / Design, Supply, Install, Support */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1F6FEB] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">DESIGN</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Precision CAD single-line diagrams, load calculation schedules, optical camera field-of-view mapping, and Wi-Fi heatmaps before physical deployment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">SUPPLY</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              100% genuine hardware directly sourced from authorized international manufacturers (Schneider, Hikvision, Cisco, Legrand, ABB, Tuya).
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">INSTALL</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flawless craftsmanship, color-coded ferruled wiring, laser-aligned conduits, core-alignment fiber fusion splicing, and full Fluke certification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900">SUPPORT</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Digital warranty tracking certificates, rapid 2-hour technician emergency response SLA, and Annual Maintenance Contracts (AMC).
            </p>
          </div>
        </div>

        {/* Story & Engineering Rigor */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">Our Foundation</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Calibrated for Ethiopian Conditions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ethiopia’s rapidly developing urban centers face distinct engineering realities: frequent power grid fluctuations, voltage spikes, inductive generator surges, and varied environmental factors.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              DIGITAL INSTALL incorporates heavy-duty multi-stage Surge Protective Devices (SPDs), Automatic Transfer Switches (ATS), and deep chemical earthing systems into every electrical and low-current project to safeguard sensitive electronics.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-300">TIN: 0098472911</span>
              <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-300">License: ENG-AA-2026-8849</span>
              <span className="px-3 py-1.5 bg-white rounded-xl border border-slate-300">Addis Ababa, Ethiopia</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Our Core Commitments
            </h4>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>No Counterfeit Hardware:</strong> Verifiable serial numbers on all switchgear, cameras, and networking switches.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Transparent BOQ Costing:</strong> Itemized line-item pricing without hidden surcharges or surprise fees.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Full Project Accountability:</strong> Live milestone tracking and official commissioning certificates.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">Technical Leadership</span>
            <h2 className="text-2xl font-black text-slate-900">Senior Engineering Management</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((leader, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-12 h-12 rounded-xl bg-[#07111F] text-white font-bold flex items-center justify-center text-base">
                  {leader.name.slice(0, 2).toUpperCase()}
                </div>
                <h4 className="text-sm font-bold text-slate-900 pt-2">{leader.name}</h4>
                <div className="text-xs font-semibold text-[#1F6FEB]">{leader.role}</div>
                <p className="text-[11px] text-slate-500 leading-normal">{leader.spec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

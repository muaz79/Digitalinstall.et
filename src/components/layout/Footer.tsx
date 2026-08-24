import React from 'react';
import { Zap, Phone, Mail, MapPin, Shield, CheckCircle, Clock } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, onOpenQuoteModal }) => {
  return (
    <footer id="main-footer" className="bg-[#07111F] text-slate-300 pt-16 pb-12 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Company Bio & Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-xl bg-[#1F6FEB] flex items-center justify-center text-white shadow-md">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white tracking-tight">
                  DIGITAL <span className="text-[#1F6FEB]">INSTALL</span>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Engineering & Technology Solutions
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Complete electrical, security surveillance, enterprise networking, IT infrastructure, and smart home solutions for modern residences, commercial towers, and institutions across Ethiopia.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>DESIGN • SUPPLY • INSTALL • SUPPORT</span>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <div>TIN: 0098472911 | License: ENG-AA-2026-8849</div>
              <div>Standards: IEC 60364, BS 7671 & Ethiopian Electric Utility (EEU)</div>
            </div>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Engineering Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/services/electrical-engineering')} className="hover:text-white transition-colors text-left">
                  Electrical Engineering
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/cctv-security')} className="hover:text-white transition-colors text-left">
                  CCTV & IP Surveillance
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/networking-wifi')} className="hover:text-white transition-colors text-left">
                  Networking & Wi-Fi 6
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/it-support')} className="hover:text-white transition-colors text-left">
                  IT Support & Software
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/smart-home')} className="hover:text-white transition-colors text-left">
                  Smart Home Automation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/maintenance-support')} className="hover:text-white transition-colors text-left">
                  Maintenance & AMC
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Customer Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/account')} className="hover:text-white transition-colors text-left">
                  Customer Portal (/account)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenQuoteModal()} className="hover:text-white transition-colors text-left text-[#1F6FEB] font-semibold">
                  Request a Quotation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/warranty-support')} className="hover:text-white transition-colors text-left">
                  Verify Warranty Online
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors text-left">
                  Shop Equipment Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/projects')} className="hover:text-white transition-colors text-left">
                  Completed Projects
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="hover:text-purple-400 transition-colors text-left text-slate-500">
                  Staff Operations Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Contact & Headquarters
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#1F6FEB] flex-shrink-0 mt-0.5" />
                <span>Africa Avenue (Airport Rd), Chiro Sub-City, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#1F6FEB] flex-shrink-0" />
                <a href="tel:+251902329715" className="hover:text-white font-medium text-slate-200">
                  +251 902 329 715
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#1F6FEB] flex-shrink-0" />
                <a href="mailto:info@digitalinstall-et.com" className="hover:text-white">
                  info@digitalinstall-et.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#1F6FEB] flex-shrink-0 mt-0.5" />
                <span>Mon - Sat: 8:00 AM - 6:00 PM (Emergency Desk 24/7)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 DIGITAL INSTALL Engineering & Technology Solutions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/warranty-support')} className="hover:text-slate-400 transition-colors">
              Warranty Terms
            </button>
            <button onClick={() => navigate('/about')} className="hover:text-slate-400 transition-colors">
              Engineering Standards
            </button>
            <button onClick={() => navigate('/contact')} className="hover:text-slate-400 transition-colors">
              Help Desk
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

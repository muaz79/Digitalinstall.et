import React from 'react';
import {
  Zap,
  ShieldCheck,
  Wifi,
  Laptop,
  Home,
  Wrench,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Award,
  Users,
  Building,
  FileCheck,
  PhoneCall,
  Search,
  Layers,
  BarChart3
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (serviceSlug?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onOpenQuoteModal }) => {
  const [quickWarrantyQuery, setQuickWarrantyQuery] = React.useState('');

  const services = [
    {
      slug: 'electrical-engineering',
      title: 'Electrical Installation & Maintenance',
      category: 'Power & Infrastructure',
      icon: Zap,
      desc: 'Complete commercial & residential distribution board design, conduit routing, three-phase balancing, earthing & surge protection.',
      features: ['Schneider Electric & ABB switchgear', 'IEC 60364 compliant earthing', 'Automatic Transfer Switches (ATS)'],
      color: 'from-amber-500/10 to-transparent'
    },
    {
      slug: 'cctv-security',
      title: 'CCTV & Security Systems',
      category: 'Surveillance & Access',
      icon: ShieldCheck,
      desc: 'High-definition 4K ColorVu IP surveillance, biometric turnstiles, perimeter laser alarms, and centralized NVR control rooms.',
      features: ['Hikvision & Dahua 4K IP cameras', 'Biometric & RFID access control', 'Mobile remote live monitoring'],
      color: 'from-blue-500/10 to-transparent'
    },
    {
      slug: 'networking-wifi',
      title: 'Networking & Enterprise Wi-Fi',
      category: 'Structured Connectivity',
      icon: Wifi,
      desc: 'Certified Cat6A/Cat7 structured cabling, single-mode fiber backbones, enterprise Wi-Fi 6 mesh, and server rack installations.',
      features: ['Cisco & Ubiquiti UniFi infrastructure', 'OTDR tested fiber optic splicing', 'Dedicated server rack wire-loom'],
      color: 'from-indigo-500/10 to-transparent'
    },
    {
      slug: 'it-support',
      title: 'IT & Software Support',
      category: 'Systems & Maintenance',
      icon: Laptop,
      desc: 'Comprehensive corporate IT management, automated NAS backup solutions, POS setups, workstation fleet deployment, and OS repairs.',
      features: ['Remote & on-site SLA response', 'Automated cloud & local backups', 'Network firewall & endpoint security'],
      color: 'from-cyan-500/10 to-transparent'
    },
    {
      slug: 'smart-home',
      title: 'Smart Home Automation',
      category: 'Next-Gen Living',
      icon: Home,
      desc: 'Luxury capacitive glass touch switches, motorized curtain rails, scene lighting, smart climate thermostats, and voice integration.',
      features: ['Tuya & Zigbee 3.0 mesh automation', 'Multi-zone architectural lighting', 'Mobile & scene wall controller'],
      color: 'from-purple-500/10 to-transparent'
    },
    {
      slug: 'maintenance-support',
      title: 'Annual Maintenance Contracts (AMC)',
      category: 'Support & Longevity',
      icon: Wrench,
      desc: 'Scheduled thermal infrared inspections, circuit breaker testing, firmware patches, and rapid 2-hour technician emergency response.',
      features: ['Infrared thermography scan', 'Preventative quarterly audit', '24/7 priority emergency dispatch'],
      color: 'from-emerald-500/10 to-transparent'
    }
  ];

  const stats = [
    { value: '450+', label: 'Engineering Projects Completed', icon: Building },
    { value: '99.8%', label: 'System Reliability & Uptime', icon: ShieldCheck },
    { value: '24 Mo', label: 'Workmanship & Parts Warranty', icon: Award },
    { value: '2 Hrs', label: 'Rapid Emergency Response SLA', icon: Clock }
  ];

  const featuredProjects = [
    {
      id: 'prj-01',
      title: 'Horizon Real Estate Luxury Complex',
      location: 'Bole Bulbula, Addis Ababa',
      type: 'RESIDENTIAL & SMART',
      desc: 'Turnkey 48-unit three-phase electrical distribution, smart touch switches, and perimeter 4K optical zoom security.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      badge: 'Turnkey Smart Estate'
    },
    {
      id: 'prj-02',
      title: 'Grand Mall Bole - 64-Camera IP Surveillance & Fiber',
      location: 'Bole Medhanialem, Addis Ababa',
      type: 'COMMERCIAL',
      desc: 'Centralized security command center, license plate recognition at parking gates, and multi-zone Wi-Fi 6.',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=800&auto=format&fit=crop',
      badge: 'Commercial Tower'
    },
    {
      id: 'prj-03',
      title: 'Abyssinia Logistics Warehouse & Datacenter Rack',
      location: 'Kality Industrial Zone, Addis Ababa',
      type: 'INDUSTRIAL',
      desc: 'Heavy-duty industrial earthing, backup diesel generator ATS integration, and high-density fiber optic spine.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
      badge: 'Industrial Facility'
    }
  ];

  return (
    <div id="home-page" className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative bg-[#07111F] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle engineering grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1F6FEB_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-[#1F6FEB]/40 text-blue-300 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#1F6FEB] animate-ping" />
                <span>ETHIOPIAN ENGINEERING & TECHNOLOGY SOLUTIONS</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                DESIGN • SUPPLY <br />
                <span className="text-[#1F6FEB]">INSTALL • SUPPORT</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                DIGITAL INSTALL delivers turnkey electrical installations, 4K CCTV surveillance, structured fiber networking, IT support, and smart home automation engineered for Ethiopian residential, commercial, and industrial facilities.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-request-quote-btn"
                  onClick={() => onOpenQuoteModal()}
                  className="px-6 py-3.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2.5 transition-all active:scale-95"
                >
                  <FileCheck className="w-5 h-5" />
                  <span>Request Engineering Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-shop-btn"
                  onClick={() => navigate('/shop')}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
                >
                  <span>Explore Equipment Shop</span>
                </button>

                <button
                  id="hero-projects-btn"
                  onClick={() => navigate('/projects')}
                  className="px-5 py-3.5 text-slate-300 hover:text-white text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>View Project Showcase</span>
                </button>
              </div>

              {/* Four Pillar Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-[#1F6FEB]" />
                  <span>1. Engineering Design</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>2. Genuine Supply</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>3. Certified Install</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>4. 24/7 SLA Support</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Quick Estimation Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#1F6FEB]/20 text-[#1F6FEB]">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Instant Project Estimator</h3>
                      <p className="text-xs text-slate-400">Get an official quote in 24 hours</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Select Primary Service</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenQuoteModal('electrical-engineering')}
                        className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-[#1F6FEB]/20 hover:border-[#1F6FEB] text-left transition-all text-slate-200"
                      >
                        <Zap className="w-4 h-4 text-[#1F6FEB] mb-1" />
                        <span className="font-bold block">Electrical</span>
                      </button>
                      <button
                        onClick={() => onOpenQuoteModal('cctv-security')}
                        className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-[#1F6FEB]/20 hover:border-[#1F6FEB] text-left transition-all text-slate-200"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
                        <span className="font-bold block">CCTV & Security</span>
                      </button>
                      <button
                        onClick={() => onOpenQuoteModal('networking-wifi')}
                        className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-[#1F6FEB]/20 hover:border-[#1F6FEB] text-left transition-all text-slate-200"
                      >
                        <Wifi className="w-4 h-4 text-indigo-400 mb-1" />
                        <span className="font-bold block">Network & Fiber</span>
                      </button>
                      <button
                        onClick={() => onOpenQuoteModal('smart-home')}
                        className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-[#1F6FEB]/20 hover:border-[#1F6FEB] text-left transition-all text-slate-200"
                      >
                        <Home className="w-4 h-4 text-purple-400 mb-1" />
                        <span className="font-bold block">Smart Home</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Standard Warranty:</span>
                      <span className="font-bold text-white">Up to 24 Months</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Site Inspection:</span>
                      <span className="font-bold text-emerald-400">Addis Ababa Wide</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Compliance:</span>
                      <span className="font-bold text-white">IEC 60364 & EEU</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenQuoteModal()}
                    className="w-full py-3 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold rounded-xl text-center shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Launch Quotation Wizard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-4 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1F6FEB] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{st.value}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{st.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">Comprehensive Capabilities</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Engineering Services & Solutions
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              From high-voltage electrical distribution boards to intelligent smart home scenes, we engineer every installation to international IEC standards.
            </p>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:border-[#1F6FEB] hover:text-[#1F6FEB] text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>View All Detailed Specs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(srv => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.slug}
                id={`service-card-${srv.slug}`}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-[#1F6FEB]/50 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-blue-50 text-[#1F6FEB] group-hover:bg-[#1F6FEB] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      {srv.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1F6FEB] transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{srv.desc}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {srv.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onOpenQuoteModal(srv.slug)}
                    className="text-xs font-bold text-[#1F6FEB] hover:underline"
                  >
                    Request Quote
                  </button>
                  <button
                    onClick={() => navigate(`/services/${srv.slug}`)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED PROJECTS SHOWCASE */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">Proven Track Record</span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Featured Engineering Deployments
              </h2>
              <p className="text-sm text-slate-400 max-w-xl">
                Explore real infrastructure delivered for residential compounds, retail centers, and industrial facilities across Ethiopia.
              </p>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="self-start md:self-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map(proj => (
              <div
                key={proj.id}
                onClick={() => navigate('/projects')}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg hover:border-[#1F6FEB] transition-all cursor-pointer group flex flex-col"
              >
                <div className="h-48 relative overflow-hidden bg-slate-950">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#07111F]/80 backdrop-blur-xs text-xs font-bold text-white px-2.5 py-1 rounded-lg border border-slate-700">
                    {proj.badge}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-[#1F6FEB] uppercase tracking-wider">{proj.location}</div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#1F6FEB] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3">{proj.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#1F6FEB]">
                    <span>View Milestones & Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ONLINE WARRANTY VERIFICATION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#07111F] to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#1F6FEB]/20 border border-[#1F6FEB]/40 text-[#1F6FEB] text-xs font-bold">
              <Shield className="w-4 h-4" />
              <span>Digital Warranty Verification System</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Verify Your Digital Install Warranty Certificate
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Enter your official Certificate Number (e.g. <span className="font-mono text-slate-200">DI-WR-2026-00412</span>) or hardware serial number to view real-time coverage status, expiry dates, and SLA entitlements.
            </p>
          </div>

          <div className="w-full lg:w-96 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={quickWarrantyQuery}
                onChange={e => setQuickWarrantyQuery(e.target.value)}
                placeholder="Enter Certificate or Serial No."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#1F6FEB]"
              />
              <button
                onClick={() => {
                  if (quickWarrantyQuery) {
                    navigate(`/warranty-support?q=${encodeURIComponent(quickWarrantyQuery)}`);
                  } else {
                    navigate('/warranty-support');
                  }
                }}
                className="px-5 py-3 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Verify</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-400 text-center lg:text-left flex items-center justify-center lg:justify-start gap-3">
              <span>✓ Instant Validation</span>
              <span>✓ Printable Certificate</span>
              <span>✓ Claim Filing</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE DIGITAL INSTALL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">The Engineering Standard</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Why Ethiopian Enterprises & Homeowners Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1F6FEB] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h4 className="text-base font-bold text-slate-900">Genuine High-Tier Hardware</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We source directly from global authorized distributors (Schneider Electric, Hikvision, Cisco, Legrand, ABB) with verifiable manufacturer serials and zero counterfeit risks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1F6FEB] flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h4 className="text-base font-bold text-slate-900">Licensed Ethiopian Engineers</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every project is led by certified electrical and telecom engineers who calibrate for Ethiopian Electric Utility (EEU) power fluctuations and local environmental conditions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1F6FEB] flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h4 className="text-base font-bold text-slate-900">Digital Transparency</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track project milestones online, review itemized BOQs, approve quotations digitally, verify warranties, and file support tickets directly through our centralized portal.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#07111F] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ready to Upgrade Your Facility Infrastructure?
            </h3>
            <p className="text-sm text-slate-300">
              Schedule a site inspection with our senior engineering team in Addis Ababa or submit your requirements for an itemized quotation.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-8 py-3.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <FileCheck className="w-5 h-5" />
              <span>Request Quotation</span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Contact Headquarters</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Zap, ShieldCheck, Wifi, Laptop, Home, Wrench, ArrowRight, CheckCircle2, FileText, ChevronRight } from 'lucide-react';

interface ServicesPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (serviceSlug?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const services = [
    {
      slug: 'electrical-engineering',
      title: 'Electrical Installation & Maintenance',
      subtitle: 'Certified Power, Distribution & Protection Systems',
      icon: Zap,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
      desc: 'We design and construct high-performance electrical infrastructure for multi-story residential towers, commercial plazas, and industrial plants across Ethiopia.',
      capabilities: [
        'Custom Three-Phase & Single-Phase Distribution Boards',
        'Automatic Transfer Switches (ATS) & Generator Backup Interfacing',
        'Conduit Installation, Wire Pulling & Cable Loom Dressing',
        'Surge Protection Devices (SPD) & Deep Earth Grounding Pits',
        'Energy Audits, Load Balancing & LED Architectural Lighting'
      ],
      standards: 'IEC 60364, BS 7671, Ethiopian Electric Utility (EEU)'
    },
    {
      slug: 'cctv-security',
      title: 'CCTV & Electronic Security Systems',
      subtitle: '4K ColorVu IP Surveillance & Access Control',
      icon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop',
      desc: 'Enterprise-grade optical surveillance systems that provide continuous 24/7 color visibility in complete darkness, biometric turnstile gates, and centralized video walls.',
      capabilities: [
        '4K & 8MP Ultra-HD ColorVu IP Cameras with AI Motion Detection',
        'Network Video Recorders (NVRs) with Hot-Swappable RAID Storage',
        'Biometric Fingerprint & Facial Recognition Turnstiles & Doors',
        'Perimeter Infrared Beam Alarms & Video Intercoms',
        'Secure Remote Mobile Live View & Incident Exporting'
      ],
      standards: 'ONVIF Profile S/G/T, ISO 27001 compliant storage'
    },
    {
      slug: 'networking-wifi',
      title: 'Structured Cabling & Enterprise Wi-Fi',
      subtitle: 'Gigabit LAN, Fiber Optic Backbones & Seamless Mesh',
      icon: Wifi,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
      desc: 'High-speed, interference-free network infrastructure engineered with Fluke-certified Cat6A copper and single-mode fiber optic cabling.',
      capabilities: [
        'Cat6 / Cat6A / Cat7 Structured Cabling & Patch Panel Terminations',
        'Single-Mode & Multi-Mode Fiber Optic Fusion Splicing',
        'Ubiquiti UniFi & Cisco Enterprise Wi-Fi 6 Mesh Deployment',
        'Server Rack Architecture, Cable Management & Patching',
        'VLAN Segmentation, Firewall Filtering & Bandwidth Optimization'
      ],
      standards: 'ANSI/TIA-568, ISO/IEC 11801, IEEE 802.11ax'
    },
    {
      slug: 'it-support',
      title: 'IT & Software Support Desk',
      subtitle: 'Managed IT Services, Automated Backups & Fleet Care',
      icon: Laptop,
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
      desc: 'Keep your business running without costly IT downtimes. We handle server administration, automated local/cloud backups, POS systems, and desktop maintenance.',
      capabilities: [
        'Dedicated On-Site & Remote Technical Support Helpdesk',
        'Automated Synology NAS & Cloud Redundant Backups',
        'POS & Retail Billing System Setup & Printer Integration',
        'Operating System Installations, Antivirus & Ransomware Defense',
        'Hardware Component Upgrades, Motherboard Diagnostics & Repairs'
      ],
      standards: 'ITIL Framework, 2-Hour Emergency SLA'
    },
    {
      slug: 'smart-home',
      title: 'Smart Home & Building Automation',
      subtitle: 'Modern Capacitive Glass Controls, Motorized Curtains & Scenes',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop',
      desc: 'Transform traditional residences into intelligent living spaces. Control lighting, climate, curtains, and security scenes from luxury touch panels or your smartphone.',
      capabilities: [
        'Tempered Glass Capacitive Touch Switches (1, 2, 3, 4 Gang)',
        'Heavy-Duty Motorized Curtain Tracks with Remote & App Sync',
        'Smart Thermostats & Multi-Zone Air Conditioning Control',
        'Smart Door Locks with Biometric, PIN, Card & Emergency Key',
        'Automated Welcome, Night, Movie & Away Scene Scheduling'
      ],
      standards: 'Zigbee 3.0, Matter, Wi-Fi 2.4GHz Protocols'
    },
    {
      slug: 'maintenance-support',
      title: 'Annual Maintenance Contracts (AMC)',
      subtitle: 'Preventative Thermography, Routine Audits & Rapid SLA',
      icon: Wrench,
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
      desc: 'Protect your building investments with preventative maintenance protocols that identify loose contacts, hot spots, and equipment wear before failures occur.',
      capabilities: [
        'Infrared Thermography Thermal Imaging of Distribution Panels',
        'Routine Camera Lens Cleaning, Angle Realignment & Firmware Upgrades',
        'UPS Battery Health Testing & Generator Auto-Start Drills',
        'Network Speed Tests, Cable Integrity Scans & Wi-Fi Heatmaps',
        'Guaranteed Priority Emergency Response SLA (2 Hours within Addis Ababa)'
      ],
      standards: 'NFPA 70B Electrical Equipment Maintenance'
    }
  ];

  return (
    <div id="services-page" className="space-y-16 pb-20">
      {/* Page Header */}
      <section className="bg-[#07111F] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F6FEB] font-bold">Services & Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Engineering & Technology Capabilities
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            DIGITAL INSTALL provides integrated engineering solutions covering the complete lifecycle: comprehensive design, genuine hardware procurement, certified installation, and responsive technical support.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          const isEven = idx % 2 === 1;
          return (
            <div
              key={srv.slug}
              id={`service-detail-block-${srv.slug}`}
              className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 ${
                isEven ? 'lg:grid-flow-dense' : ''
              }`}
            >
              {/* Image Side */}
              <div className={`lg:col-span-5 h-72 sm:h-96 rounded-2xl overflow-hidden relative shadow-md bg-slate-900 ${
                isEven ? 'lg:col-start-8' : ''
              }`}>
                <img
                  src={srv.image}
                  alt={srv.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300">Compliance & Standards</div>
                  <div className="text-xs font-mono font-medium text-slate-200 mt-0.5">{srv.standards}</div>
                </div>
              </div>

              {/* Content Side */}
              <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:col-start-1' : ''}`}>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 text-[#1F6FEB] text-xs font-bold">
                    <Icon className="w-4 h-4" />
                    <span>Core Service #{idx + 1}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {srv.title}
                  </h2>
                  <p className="text-sm font-semibold text-[#1F6FEB]">{srv.subtitle}</p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {srv.desc}
                </p>

                <div className="space-y-2.5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    What We Deliver:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {srv.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onOpenQuoteModal(srv.slug)}
                    className="px-6 py-3 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all active:scale-95"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Request Quotation for {srv.title.split(' ')[0]}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/services/${srv.slug}`)}
                    className="px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Technical Architecture Specs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

import React from 'react';
import { Zap, ShieldCheck, Wifi, Laptop, Home, Wrench, ArrowRight, CheckCircle2, ChevronRight, FileText, Phone, Award, Shield } from 'lucide-react';

interface ServiceDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
  onOpenQuoteModal: (serviceSlug?: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, navigate, onOpenQuoteModal }) => {
  const serviceDetails: Record<string, any> = {
    'electrical-engineering': {
      title: 'Electrical Installation & Maintenance',
      subtitle: 'Complete Residential, Commercial & Industrial Power Distribution',
      icon: Zap,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
      overview: 'Our electrical engineering division provides end-to-end power design, distribution boards, conduit routing, three-phase load balancing, and surge suppression. Engineered strictly to IEC 60364 and Ethiopian Electric Utility (EEU) grid specifications.',
      brands: ['Schneider Electric', 'ABB', 'Legrand', 'Siemens', 'Chint Electric'],
      workflow: [
        { step: '01', title: 'Site Load Calculation', desc: 'Detailed assessment of current draw, peak diversity factor, and generator requirements.' },
        { step: '02', title: 'Single Line Diagram (SLD)', desc: 'CAD schematics of distribution panels, breaker ratings, and cable gauge schedules.' },
        { step: '03', title: 'Conduit & Wire Laying', desc: 'Heavy-gauge PVC/metal conduit with color-coded copper wiring and wire ferrule labeling.' },
        { step: '04', title: 'Panel Assembly & Testing', desc: 'Installation of MCBs, MCCBs, RCBOs, surge arrestors, and earth resistance testing (<5 Ohms).' },
        { step: '05', title: 'Commissioning & Certification', desc: 'Insulation resistance verification, load balancing, and 24-month warranty certificate.' }
      ],
      faqs: [
        { q: 'Do you handle three-phase power upgrades?', a: 'Yes, we design and coordinate three-phase distribution board replacements and ATS generator interfaces.' },
        { q: 'What earthing standards do you adhere to?', a: 'We install deep copper-bonded earth rods with chemical conductive compound to achieve <5 Ohm resistance.' }
      ]
    },
    'cctv-security': {
      title: 'CCTV & Security Systems',
      subtitle: 'Ultra 4K ColorVu Optical Surveillance & Access Management',
      icon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1200&auto=format&fit=crop',
      overview: 'High-definition video surveillance providing true 24/7 color rendering in zero-lux darkness, AI vehicle and human classification, biometric turnstiles, and command center video wall integration.',
      brands: ['Hikvision', 'Dahua Technology', 'ZKTeco', 'Uniview', 'Seagate SkyHawk AI'],
      workflow: [
        { step: '01', title: 'Optical Field-of-View Survey', desc: 'Angle, focal length (2.8mm / 4mm / 6mm), and blind spot elimination mapping.' },
        { step: '02', title: 'Shielded Cabling (Cat6 SFTP)', desc: 'Interference-free outdoor-rated cabling with surge protected PoE switches.' },
        { step: '03', title: 'Camera & NVR Mounting', desc: 'Weatherproof IP67 junction boxes, tamper-resistant domes, and rackmount NVR setup.' },
        { step: '04', title: 'AI Smart Event Setup', desc: 'Line crossing alerts, perimeter intrusion detection, and vehicle plate recognition.' },
        { step: '05', title: 'Mobile App & Server Sync', desc: 'Encrypted mobile streaming setup on Android & iOS for 24/7 remote monitoring.' }
      ],
      faqs: [
        { q: 'Can I view cameras on my phone when away from the site?', a: 'Yes! We configure secure cloud streaming with end-to-end encryption so you can watch live and recorded video anywhere.' },
        { q: 'How long are recordings preserved?', a: 'Depending on your hard drive capacity and motion schedule, we configure 30 to 90 days of continuous recording.' }
      ]
    },
    'networking-wifi': {
      title: 'Networking & Enterprise Wi-Fi',
      subtitle: 'Certified Cat6 Structured Cabling, Fiber Optic Splicing & Wi-Fi 6',
      icon: Wifi,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop',
      overview: 'Engineered high-throughput computer networks for commercial office buildings, hotels, hospitals, and residential compounds. Single-mode fiber backbones and zero-deadzone Wi-Fi mesh.',
      brands: ['Cisco Systems', 'Ubiquiti UniFi', 'MikroTik', 'D-Link', 'CommScope Systimax'],
      workflow: [
        { step: '01', title: 'Wi-Fi Heatmap Survey', desc: 'Predictive RF modeling to map channel overlap and wall attenuation.' },
        { step: '02', title: 'Structured Cabling Run', desc: 'Ceiling trays, data wall jacks (RJ45 Keystone), and patch panel numbering.' },
        { step: '03', title: 'Server Rack Architecture', desc: '42U/24U server rack assembly, cable wire-managers, patch cord loom dressing.' },
        { step: '04', title: 'Switching & Gateway Config', desc: 'VLAN setup for Guest, Staff, and VoIP; firewall traffic rules; failover WAN.' },
        { step: '05', title: 'Fluke Certification Testing', desc: 'Full channel wiremap and gigabit throughput certification report.' }
      ],
      faqs: [
        { q: 'Do you perform fiber optic cable fusion splicing?', a: 'Yes, our technicians use core-alignment fusion splicers with OTDR attenuation validation.' }
      ]
    },
    'it-support': {
      title: 'IT & Software Support Services',
      subtitle: 'Managed IT Helpdesk, Automated Synology NAS Backups & Hardware',
      icon: Laptop,
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
      overview: 'Comprehensive technical maintenance and support for workstations, servers, point-of-sale terminals, and corporate databases. Emergency response SLAs and automated data redundancy.',
      brands: ['Dell', 'HP Enterprise', 'Lenovo', 'Synology', 'Microsoft', 'Fortinet'],
      workflow: [
        { step: '01', title: 'IT Infrastructure Audit', desc: 'Full inventory of endpoints, operating systems, hardware health, and licensing.' },
        { step: '02', title: 'Automated Backup Strategy', desc: 'Scheduled incremental snapshots to on-premise NAS and encrypted cloud vaults.' },
        { step: '03', title: 'Antivirus & Firewall Rules', desc: 'Centralized malware protection and gateway web filtering.' },
        { step: '04', title: 'Preventative Routine Maintenance', desc: 'Thermal paste renewal, dusting, OS optimization, and driver updates.' },
        { step: '05', title: 'SLA Ticket Integration', desc: 'Direct portal ticketing with guaranteed 2-hour technician dispatch.' }
      ],
      faqs: [
        { q: 'Do you offer monthly service level agreements?', a: 'Yes, our Annual Maintenance Contracts provide scheduled monthly audits and unlimited emergency tickets.' }
      ]
    },
    'smart-home': {
      title: 'Smart Home & Building Automation',
      subtitle: 'Capacitive Glass Touch Panels, Motorized Curtains & Scene Controls',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop',
      overview: 'Turn your residence into an intelligent luxury home. Control lights, air conditioning, motorized curtains, and access locks from elegant wall touch screens or your mobile phone.',
      brands: ['Tuya Smart', 'Sonoff', 'Aqara', 'Moes House', 'BroadLink'],
      workflow: [
        { step: '01', title: 'Smart Circuit Planning', desc: 'Ensuring neutral wires are routed to all light switch boxes for stable operation.' },
        { step: '02', title: 'Touch Switch Installation', desc: 'Tempered luxury glass switches (White/Black/Gold) with LED backlighting.' },
        { step: '03', title: 'Motorized Curtain Tracks', desc: 'Custom aluminum rail cutting, silent DC motor mounting, and limits calibration.' },
        { step: '04', title: 'Gateway & Zigbee Mesh', desc: 'Central hub setup ensuring stable offline mesh communication across all rooms.' },
        { step: '05', title: 'Scene Programming', desc: '"Welcome Home", "Cinema Mode", "All Off", and sunrise/sunset scheduling.' }
      ],
      faqs: [
        { q: 'Do the switches work if the internet goes down?', a: 'Yes! All wall switches function mechanically/capacitively by touch, and Zigbee local scenes execute without internet.' }
      ]
    },
    'maintenance-support': {
      title: 'Annual Maintenance Contracts (AMC)',
      subtitle: 'Thermal Infrared Audits, SLA Emergency Care & Systems Longevity',
      icon: Wrench,
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
      overview: 'Scheduled preventative maintenance and rapid 24/7 technical assistance for building electrical panels, surveillance NVRs, server racks, and automation controllers.',
      brands: ['FLIR Infrared Scanners', 'Fluke Networks', 'Megger', 'Hioki'],
      workflow: [
        { step: '01', title: 'Quarterly Thermal Scans', desc: 'Infrared imaging of breakers and contactors to detect loose lugs and thermal hotspots.' },
        { step: '02', title: 'NVR & CCTV Servicing', desc: 'Cleaning camera optics, testing PoE voltages, and backing up configurations.' },
        { step: '03', title: 'UPS Battery Impedance Test', desc: 'Testing internal battery resistance and load testing under simulated grid outage.' },
        { step: '04', title: 'Earthing Resistance Verification', desc: 'Measuring soil resistivity and earth electrode impedance.' },
        { step: '05', title: 'Comprehensive Audit Report', desc: 'Delivering signed engineering test reports and corrective recommendations.' }
      ],
      faqs: [
        { q: 'What is your response time for emergency outages?', a: 'For contract clients, our emergency technician team responds within 2 hours in Addis Ababa.' }
      ]
    }
  };

  const current = serviceDetails[slug] || serviceDetails['electrical-engineering'];
  const Icon = current.icon;

  return (
    <div id="service-detail-page" className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-[#07111F] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('/services')} className="hover:text-white">Services</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F6FEB] font-bold">{current.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1F6FEB] text-white">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">Technical Specification</span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">{current.title}</h1>
            </div>
          </div>
          <p className="text-base text-slate-300 max-w-3xl leading-relaxed">{current.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left / Center Specs */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview & Hero Image */}
            <div className="space-y-6">
              <div className="h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
                <img
                  src={current.image}
                  alt={current.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">System Overview & Engineering Focus</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{current.overview}</p>
              </div>
            </div>

            {/* Brands Used */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#1F6FEB]" />
                <span>Authorized Hardware & Global Manufacturers</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {current.brands.map((b: string) => (
                  <span
                    key={b}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 shadow-xs"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* 5-Step Engineering Workflow */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Our 5-Stage Engineering Execution Process</h3>
              <div className="space-y-3">
                {current.workflow.map((st: any) => (
                  <div
                    key={st.step}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#07111F] text-white font-mono font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {st.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900">{st.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            {current.faqs && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold text-slate-900">Technical Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {current.faqs.map((faq: any, i: number) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-900">{faq.q}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar CTA & Quote Widget */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-[#07111F] text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-xl">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F6FEB]">Get Started Today</span>
                <h3 className="text-xl font-bold text-white mt-1">Request Quotation for {current.title.split(' ')[0]}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Submit your site location and parameters for a comprehensive engineering estimate and bill of quantities.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 border-y border-slate-800 py-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>On-site engineering inspection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Itemized BOQ with genuine parts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Official 24-Month Warranty</span>
                </div>
              </div>

              <button
                onClick={() => onOpenQuoteModal(slug)}
                className="w-full py-3.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Launch Quote Estimator</span>
              </button>

              <div className="text-center pt-2">
                <a
                  href="tel:+251911000111"
                  className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1F6FEB]" />
                  <span>Direct Hotline: +251 911 000 111</span>
                </a>
              </div>
            </div>

            {/* Other Services Navigation */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Explore Other Capabilities
              </h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { slug: 'electrical-engineering', title: 'Electrical Engineering' },
                  { slug: 'cctv-security', title: 'CCTV & Security' },
                  { slug: 'networking-wifi', title: 'Networking & Wi-Fi' },
                  { slug: 'it-support', title: 'IT Support & Software' },
                  { slug: 'smart-home', title: 'Smart Home Automation' },
                  { slug: 'maintenance-support', title: 'Maintenance & AMC' }
                ]
                  .filter(s => s.slug !== slug)
                  .map(s => (
                    <button
                      key={s.slug}
                      onClick={() => navigate(`/services/${s.slug}`)}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#1F6FEB] font-medium flex items-center justify-between transition-colors"
                    >
                      <span>{s.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

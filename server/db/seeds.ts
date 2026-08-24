import bcrypt from 'bcryptjs';
import {
  User,
  CustomerProfile,
  StaffProfile,
  Service,
  Product,
  Quote,
  Project,
  Order,
  Warranty,
  WarrantyClaim,
  SupportTicket,
  CompanySettings,
  ContactMessage,
  AuditLog,
  Notification
} from '../../src/types/database.js';

export async function getSeedData() {
  const adminPass = await bcrypt.hash('admin123', 10);
  const salesPass = await bcrypt.hash('sales123', 10);
  const techPass = await bcrypt.hash('tech123', 10);
  const shopPass = await bcrypt.hash('shop123', 10);
  const custPass = await bcrypt.hash('cust123', 10);

  const users: User[] = [
    {
      id: 'usr-admin-01',
      name: 'Yohannes Getachew',
      email: 'admin@digitalinstall-et.com',
      passwordHash: adminPass,
      role: 'SUPER_ADMIN',
      phone: '+251 911 234 567',
      companyName: 'DIGITAL INSTALL Engineering',
      isActive: true,
      createdAt: '2026-01-10T08:00:00.000Z',
      updatedAt: '2026-01-10T08:00:00.000Z'
    },
    {
      id: 'usr-sales-01',
      name: 'Marta Worku',
      email: 'sales@digitalinstall-et.com',
      passwordHash: salesPass,
      role: 'SALES',
      phone: '+251 912 345 678',
      companyName: 'DIGITAL INSTALL Sales & Commercial',
      isActive: true,
      createdAt: '2026-01-12T09:00:00.000Z',
      updatedAt: '2026-01-12T09:00:00.000Z'
    },
    {
      id: 'usr-tech-01',
      name: 'Dawit Bekele',
      email: 'tech@digitalinstall-et.com',
      passwordHash: techPass,
      role: 'TECHNICIAN',
      phone: '+251 913 456 789',
      companyName: 'DIGITAL INSTALL Field Engineering',
      isActive: true,
      createdAt: '2026-01-15T10:00:00.000Z',
      updatedAt: '2026-01-15T10:00:00.000Z'
    },
    {
      id: 'usr-shop-01',
      name: 'Selamawit Tadesse',
      email: 'shop@digitalinstall-et.com',
      passwordHash: shopPass,
      role: 'SHOP_MANAGER',
      phone: '+251 914 567 890',
      companyName: 'DIGITAL INSTALL Supply Chain',
      isActive: true,
      createdAt: '2026-01-18T10:30:00.000Z',
      updatedAt: '2026-01-18T10:30:00.000Z'
    },
    {
      id: 'usr-cust-01',
      name: 'Abebe Kebede',
      email: 'customer@horizon-et.com',
      passwordHash: custPass,
      role: 'CUSTOMER',
      phone: '+251 911 889 900',
      companyName: 'Horizon Real Estate & Construction',
      isActive: true,
      createdAt: '2026-02-01T11:00:00.000Z',
      updatedAt: '2026-02-01T11:00:00.000Z'
    },
    {
      id: 'usr-cust-02',
      name: 'Tigist Haile',
      email: 'customer2@grandmall.et',
      passwordHash: custPass,
      role: 'CUSTOMER',
      phone: '+251 922 445 566',
      companyName: 'Grand Mall Bole',
      isActive: true,
      createdAt: '2026-02-10T14:00:00.000Z',
      updatedAt: '2026-02-10T14:00:00.000Z'
    }
  ];

  const customers: CustomerProfile[] = [
    {
      id: 'cp-01',
      userId: 'usr-cust-01',
      address: 'Bole Sub-City, Woreda 03, House 412',
      city: 'Addis Ababa',
      subCity: 'Bole',
      tinNumber: '0039485721',
      totalSpent: 485000,
      notes: 'Key commercial real estate partner. Multiple active projects.'
    },
    {
      id: 'cp-02',
      userId: 'usr-cust-02',
      address: 'Airport Road, near Edna Mall',
      city: 'Addis Ababa',
      subCity: 'Bole',
      tinNumber: '0091827364',
      totalSpent: 230000,
      notes: 'Retail mall complex requiring multi-zone CCTV and Wi-Fi.'
    }
  ];

  const staff: StaffProfile[] = [
    {
      id: 'sp-01',
      userId: 'usr-admin-01',
      jobTitle: 'Principal Systems Engineer & Managing Director',
      department: 'MANAGEMENT',
      specialization: 'High-voltage systems, Enterprise Architecture, Turnkey Integration',
      activeProjectsCount: 6
    },
    {
      id: 'sp-02',
      userId: 'usr-sales-01',
      jobTitle: 'Senior Commercial Estimator & Client Manager',
      department: 'SALES',
      specialization: 'Project BoQ Estimation, Tender Documentation, Procurement',
      activeProjectsCount: 12
    },
    {
      id: 'sp-03',
      userId: 'usr-tech-01',
      jobTitle: 'Senior Field Electrical & Network Engineer',
      department: 'ENGINEERING',
      specialization: 'Fiber Splicing, IP CCTV Matrix, Distribution Board Commissioning',
      activeProjectsCount: 4
    },
    {
      id: 'sp-04',
      userId: 'usr-shop-01',
      jobTitle: 'Equipment Specialist & Inventory Manager',
      department: 'NETWORKING',
      specialization: 'Supply Chain, Quality Inspection, Warranty RMA',
      activeProjectsCount: 0
    }
  ];

  const services: Service[] = [
    {
      id: 'srv-01',
      slug: 'electrical-engineering',
      title: 'Electrical Engineering',
      category: 'Power & Infrastructure',
      shortDescription: 'Complete residential, commercial, and industrial electrical design, distribution boards, certified wiring, and surge protection.',
      fullDescription: 'DIGITAL INSTALL provides end-to-end electrical engineering solutions adhering to Ethiopian Electric Power (EEP) codes and international IEC/IEE safety standards. From single-phase luxury residential conduit installation to complex three-phase industrial distribution boards, ATS generator failover panels, and energy-efficient LED architecture.',
      icon: 'Zap',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
      features: [
        'Residential, Commercial & Industrial Wiring conforming to IEC 60364',
        'Main & Sub Distribution Board (MDB/SDB) design with Schneider/ABB components',
        'Automatic Transfer Switch (ATS) & Generator integration',
        'Surge Protection Devices (SPD) & grounding/earthing resistance testing (<5Ω)',
        'Thermal imaging electrical audit & load balancing',
        'Emergency and architectural lighting automation'
      ],
      benefits: [
        'Eliminates short-circuit and fire risks with certified circuit breakers',
        'Optimizes power consumption with precision load calculation',
        'Guaranteed compliance with Ethiopian building permits and municipal inspections',
        'Full 12-month post-installation workmanship warranty'
      ],
      process: [
        { step: 1, title: 'Site Inspection & Load Audit', description: 'Comprehensive survey of property layout, total connected load, and utility feed capacity.' },
        { step: 2, title: 'Engineering Blueprint & BoQ', description: 'AutoCAD electrical drafting, cable sizing calculations, and itemized bill of quantities.' },
        { step: 3, title: 'Conduit & Distribution Installation', description: 'Heavy-duty conduit piping, fire-rated cabling, and precision distribution board wiring.' },
        { step: 4, title: 'Testing & Formal Handover', description: 'Megger insulation testing, polarity verification, and certified commissioning certificate.' }
      ],
      subServices: [
        'Residential wiring & rewiring',
        'Commercial multi-story installation',
        'Distribution boards & switchgear',
        'Lighting & luminaire design',
        'Circuit protection & earthing',
        'Troubleshooting & emergency repairs',
        'Power factor correction'
      ],
      faqs: [
        { question: 'What electrical standards do your engineers adhere to in Ethiopia?', answer: 'Our licensed engineers comply with the Ethiopian Building Proclamation, Ethiopian Electric Utility (EEU) regulations, and British Standard BS 7671 / IEC standards.' },
        { question: 'Do you provide ATS generator panels?', answer: 'Yes, we design, assemble, and commission automatic transfer switch panels for seamless power cut transitions between EEU mains and standby generators.' },
        { question: 'Is a warranty included on electrical work?', answer: 'All turnkey electrical installations include 12 months comprehensive workmanship warranty and manufacturer guarantees on all supplied switchgear.' }
      ],
      estimatedStartingPrice: 15000,
      popular: true
    },
    {
      id: 'srv-02',
      slug: 'cctv-security',
      title: 'CCTV & Security Systems',
      category: 'Security & Surveillance',
      shortDescription: 'High-definition IP surveillance, smart AI analytics, night-vision perimeter security, access control, and remote phone monitoring.',
      fullDescription: 'Protect your assets, staff, and family with enterprise-grade surveillance and access control. We design and install high-definition 4K ColorVu IP cameras, Network Video Recorders (NVR) with RAID storage, facial recognition biometric door locks, video intercoms, and intrusion perimeter alarm systems with instant mobile notifications.',
      icon: 'ShieldCheck',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1200&auto=format&fit=crop',
      features: [
        '4K Ultra HD IP Cameras with 24/7 ColorVu full-color night vision',
        'Intelligent AI detection: Human/vehicle classification and line-crossing alerts',
        'Secure mobile app streaming with zero static-IP subscription requirements',
        'Biometric fingerprint, RFID badge, and facial recognition access control',
        'Dual-tech PIR perimeter motion sensors and acoustic glass-break detectors',
        'UPS backup power to keep surveillance active during power cuts'
      ],
      benefits: [
        'Crystal-clear evidence recording day and night',
        'Remote monitoring from anywhere in Ethiopia or abroad via iOS/Android',
        'Prevent unauthorized intrusion with automated strobe and siren deterrence',
        'Clean concealed cabling with UV-resistant outdoor conduits'
      ],
      process: [
        { step: 1, title: 'Security Vulnerability Assessment', description: 'Identify blind spots, entrance choke points, and critical asset zones.' },
        { step: 2, title: 'System Architecture & Lens Calculation', description: 'Select optimal focal lengths, IR range, and storage capacity in days.' },
        { step: 3, title: 'Mounting & Clean Cabling', description: 'Install outdoor rated Cat6, weatherproof junction boxes, and patch panels.' },
        { step: 4, title: 'App Setup & Security Briefing', description: 'Configure cloud remote access, custom notification schedules, and staff training.' }
      ],
      subServices: [
        'IP & Analog CCTV systems',
        'NVR / DVR storage arrays',
        'Remote mobile & cloud monitoring',
        'Biometric access control & time attendance',
        'Video door intercom systems',
        'Perimeter laser & motion alarms'
      ],
      faqs: [
        { question: 'Can I view camera feeds on my phone when I am outside Addis Ababa?', answer: 'Yes! We configure secure encrypted peer-to-peer cloud streaming that works over 4G/5G and Wi-Fi worldwide.' },
        { question: 'How many days of video history are stored?', answer: 'We calculate NVR hard drive storage based on your needs, typically ranging from 30 days to 90 days of continuous H.265+ compressed recording.' }
      ],
      estimatedStartingPrice: 18000,
      popular: true
    },
    {
      id: 'srv-03',
      slug: 'networking-wifi',
      title: 'Networking & Enterprise Wi-Fi',
      category: 'Data & Telecommunications',
      shortDescription: 'High-speed structured cabling, fiber optic links, seamless roaming mesh Wi-Fi, server rack enclosures, and managed firewall security.',
      fullDescription: 'Eliminate dead zones, buffering, and packet loss with enterprise network infrastructure. DIGITAL INSTALL delivers structured Cat6/Cat6A/Cat7 copper cabling, fiber optic backbone links, UniFi & MikroTik access points with zero-handoff seamless roaming, VLAN segmentation for guest/staff security, and server room rack integration.',
      icon: 'Wifi',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop',
      features: [
        'Structured Cat6/Cat6A cabling with certified Fluke channel testing',
        'Fiber optic cable pulling, fusion splicing, and OTDR verification',
        'Enterprise UniFi / Cisco / MikroTik dual-band Wi-Fi 6 Access Points',
        'Multi-story roaming without Wi-Fi dropouts or reconnection lag',
        'Bandwidth management, failover dual-ISP WAN load balancing',
        'Server rack patch panel cable management and labeling'
      ],
      benefits: [
        'Rock-solid internet connectivity for 5 to 500+ simultaneous devices',
        'Isolated guest networks to prevent access to private company databases',
        'Automatic failover between Ethio Telecom / Safaricom connections',
        'Organized server racks with clear numerical patch port mapping'
      ],
      process: [
        { step: 1, title: 'RF Heatmap & Cable Pathway Plan', description: 'Analyze wall attenuation and calculate wireless signal coverage.' },
        { step: 2, title: 'Trunking & Cable Pulling', description: 'Install PVC cable trays, RJ45 Keystone jacks, and server cabinets.' },
        { step: 3, title: 'Routing & Access Point Setup', description: 'Configure VLANs, DHCP pools, QoS voice prioritization, and firewall rules.' },
        { step: 4, title: 'Throughput & Roaming Verification', description: 'Perform speed and packet loss stress tests across all zones.' }
      ],
      subServices: [
        'Structured Cat6/Cat6A cabling',
        'Fiber optic backbone splicing',
        'High-density office Wi-Fi',
        'Managed switches & VLAN setup',
        'Dual-WAN router load balancing',
        'Server rack installation & cleanup'
      ],
      faqs: [
        { question: 'Can you merge Ethio Telecom and Safaricom lines together?', answer: 'Yes, we deploy dual-WAN multi-gigabit load-balancing routers with instant seamless failover so you never experience internet downtime.' }
      ],
      estimatedStartingPrice: 12000,
      popular: true
    },
    {
      id: 'srv-04',
      slug: 'it-support',
      title: 'IT Support & Software Solutions',
      category: 'Information Technology',
      shortDescription: 'Complete corporate IT assistance, Windows/Linux/Mac server support, automated cloud backups, hardware repairs, and malware removal.',
      fullDescription: 'Ensure uninterrupted business productivity with DIGITAL INSTALL’s dedicated IT support desk and on-site engineering team. We manage workstation deployments, Windows Server & Active Directory setups, automated offsite cloud backups, hardware SSD/RAM upgrades, printer networking, and enterprise antivirus defense.',
      icon: 'Laptop',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop',
      features: [
        'Windows 10/11 Pro & Windows Server genuine installation & optimization',
        'Hardware diagnostics, component level repairs, SSD and RAM upgrades',
        'Automated local NAS and secure cloud backup pipelines (3-2-1 strategy)',
        'Enterprise antivirus, ransomware defense, and firewall management',
        'Network printer, scanner, and POS terminal integration',
        'Remote helpdesk ticketing with fast SLA response times'
      ],
      benefits: [
        'Zero data loss with scheduled automated snapshots',
        'Dramatically faster workstation boot and application loading speeds',
        'Affordable monthly IT maintenance retainer plans for businesses',
        'Clear documentation of all IT assets and software licenses'
      ],
      process: [
        { step: 1, title: 'System Diagnostics & Health Audit', description: 'Inspect hardware thermals, drive health (S.M.A.R.T.), and security patches.' },
        { step: 2, title: 'Remediation & Upgrades', description: 'Perform OS rebuilds, NVMe SSD cloning, and software updates.' },
        { step: 3, title: 'Security & Backup Setup', description: 'Deploy cloud backup agent and configure endpoint security rules.' },
        { step: 4, title: 'Ongoing SLA Monitoring', description: '24/7 proactive monitoring and periodic preventative maintenance visits.' }
      ],
      subServices: [
        'Windows/Linux OS configuration',
        'Computer & laptop repair',
        'Data recovery & backup automation',
        'Office software & email setup',
        'IT equipment procurement',
        'Monthly IT support retainer'
      ],
      faqs: [
        { question: 'Do you offer monthly IT support contracts for small and medium businesses?', answer: 'Yes! We have customizable monthly SLA packages covering preventative visits, emergency on-site dispatch, and unlimited remote helpdesk.' }
      ],
      estimatedStartingPrice: 8000,
      popular: false
    },
    {
      id: 'srv-05',
      slug: 'smart-home',
      title: 'Smart Home & Building Automation',
      category: 'Smart Technologies',
      shortDescription: 'Intelligent touch switches, automated curtain motors, scene lighting, smart climate thermostats, and voice assistant integration.',
      fullDescription: 'Transform your villa, apartment, or commercial boardroom into an intelligent automated space. Control your lighting, climate, motorized curtains, water pumps, and security from intuitive in-wall glass touch screens, your smartphone, or voice commands with Google Assistant and Amazon Alexa.',
      icon: 'Home',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop',
      features: [
        'Luxury tempered glass touch switches compatible with standard Ethiopian wall backboxes',
        'Automated motorized curtain and blind tracking with scheduling',
        'Intelligent water tank level monitoring and automatic pump control',
        'Smart scene creation (e.g. "Cinema Mode", "Away from Home", "Good Morning")',
        'Integrated energy consumption metering on your smartphone',
        'Local hub architecture that continues working even if the internet is down'
      ],
      benefits: [
        'Modern luxury convenience with effortless fingertip control',
        'Significant energy savings through automated occupancy timers',
        'Prevent water overflow and pump dry-running damage',
        'Adds high market valuation to residential and commercial real estate'
      ],
      process: [
        { step: 1, title: 'Lifestyle & Architecture Mapping', description: 'Consult with homeowners/architects on automation goals and switch placements.' },
        { step: 2, title: 'Neutral Line & Hub Preparation', description: 'Ensure neutral wiring pathways and centralized Zigbee/Matter gateways.' },
        { step: 3, title: 'Device Installation & Calibrations', description: 'Mount smart switches, motor rails, and smart door locks.' },
        { step: 4, title: 'Scene Customization & Training', description: 'Program custom automation rules and train household members on app controls.' }
      ],
      subServices: [
        'Smart lighting & touch switches',
        'Motorized curtain automation',
        'Smart water pump & tank controllers',
        'Smart biometric door locks',
        'Voice assistant integration',
        'Multi-room audio distribution'
      ],
      faqs: [
        { question: 'Can smart home switches be installed in existing Ethiopian homes without rewiring?', answer: 'Yes! We have both neutral and no-neutral smart switch options designed to fit standard 86mm Ethiopian wall conduit boxes.' }
      ],
      estimatedStartingPrice: 22000,
      popular: true
    },
    {
      id: 'srv-06',
      slug: 'maintenance-support',
      title: 'Preventative Maintenance & Warranty Services',
      category: 'Technical Support',
      shortDescription: 'Periodic engineering inspections, electrical load testing, camera cleaning, network tuning, and emergency repair response.',
      fullDescription: 'Keep your technology infrastructure in peak operating condition with proactive preventative maintenance. DIGITAL INSTALL provides tailored Annual Maintenance Contracts (AMC) for banks, embassies, commercial towers, hotels, and residences with priority emergency response, spare part discounts, and comprehensive warranty coverage.',
      icon: 'Wrench',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
      features: [
        'Scheduled quarterly inspections of electrical switchgear, CCTV, and networks',
        'Thermal imaging scanning of electrical panels to catch hot spots before fires occur',
        'Camera lens cleaning, focus calibration, and IR night filter testing',
        'NVR hard drive health checks and backup footage archiving',
        'Network switch firmware updates and throughput optimization',
        'Dedicated 24/7 emergency dispatch helpline with 2-hour Addis Ababa SLA'
      ],
      benefits: [
        'Prevents costly catastrophic equipment downtime and business interruption',
        'Extends the lifespan of expensive technology investments by 40%+',
        'Priority access to our certified engineering technicians',
        'Transparent digital maintenance log reports with photo proof'
      ],
      process: [
        { step: 1, title: 'Asset Inventory & Baseline Audit', description: 'Catalog all connected devices, serial numbers, and existing health metrics.' },
        { step: 2, title: 'Custom AMC Schedule', description: 'Establish quarterly or bi-monthly inspection milestones based on your facility size.' },
        { step: 3, title: 'Hands-on Preventative Visits', description: 'Execute comprehensive multi-point checklist with specialized calibration tools.' },
        { step: 4, title: 'Detailed PDF Maintenance Report', description: 'Generate certified report detailing actions taken, voltage readings, and recommendations.' }
      ],
      subServices: [
        'Annual Maintenance Contracts (AMC)',
        'Thermal imaging panel audits',
        'CCTV system health tuning',
        'Network cabling recertification',
        'Emergency breakdown dispatch',
        'Equipment RMA & warranty processing'
      ],
      faqs: [
        { question: 'What is included in an Annual Maintenance Contract?', answer: 'An AMC includes regular scheduled maintenance visits, emergency repair labor, discounted replacement parts, and digital service completion reports.' }
      ],
      estimatedStartingPrice: 9500,
      popular: false
    }
  ];

  const products: Product[] = [
    // Electrical Products
    {
      id: 'prod-el-01',
      sku: 'DI-EL-MDB-12WAY',
      name: 'Schneider 12-Way Three Phase Distribution Board',
      slug: 'schneider-12-way-distribution-board',
      category: 'electrical',
      categoryName: 'Electrical Equipment',
      brand: 'Schneider Electric',
      description: 'Heavy-duty flush/surface mount metal distribution board with transparent door, built-in neutral/earth brass bars, and IP40 protection. Ideal for commercial offices and luxury residences.',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Poles': '3 Phase + Neutral (12 Ways)',
        'Rated Voltage': '415V AC / 50Hz',
        'Enclosure': 'Electro-galvanized Steel with Powder Coating',
        'Standard': 'IEC 61439-3',
        'Mounting': 'Flush & Surface Mount'
      },
      price: 18500,
      discountPrice: 16900,
      stock: 14,
      lowStockThreshold: 3,
      warrantyMonths: 24,
      featured: true,
      status: 'ACTIVE',
      createdAt: '2026-01-15T08:00:00.000Z',
      updatedAt: '2026-01-15T08:00:00.000Z'
    },
    {
      id: 'prod-el-02',
      sku: 'DI-EL-CBL-4MM',
      name: 'Pure Copper Flexible Cable 4mm² (100m Roll)',
      slug: 'pure-copper-cable-4mm-100m',
      category: 'electrical',
      categoryName: 'Electrical Equipment',
      brand: 'Ducab / Nexans Grade',
      description: '100% pure electrolytic high-conductivity copper insulated wire with flame-retardant PVC sheath. Certified for heavy socket lines and high-current electrical appliances.',
      images: [
        'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Conductor Size': '4.0 mm²',
        'Core Material': 'Oxygen-Free Pure Copper (99.9%)',
        'Length': '100 Meters Coil',
        'Voltage Rating': '450/750V',
        'Insulation': 'Flame Retardant PVC (Red/Black/Yellow/Blue)'
      },
      price: 9200,
      discountPrice: 8500,
      stock: 45,
      lowStockThreshold: 10,
      warrantyMonths: 36,
      featured: true,
      status: 'ACTIVE',
      createdAt: '2026-01-16T08:00:00.000Z',
      updatedAt: '2026-01-16T08:00:00.000Z'
    },
    {
      id: 'prod-el-03',
      sku: 'DI-EL-SPD-4P',
      name: 'ABB Type 2 Surge Protective Device (SPD) 40kA',
      slug: 'abb-surge-protective-device-40ka',
      category: 'electrical',
      categoryName: 'Electrical Equipment',
      brand: 'ABB',
      description: '4-Pole DIN rail surge protection device designed to protect sensitive equipment and electrical installations against lightning strikes and power grid voltage spikes in Ethiopia.',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Discharge Current': 'Imax 40kA / In 20kA',
        'Poles': '3P + N (4 Module DIN Rail)',
        'Response Time': '< 25 ns',
        'Status Indicator': 'Green (Normal) / Red (Replace)'
      },
      price: 6800,
      discountPrice: undefined,
      stock: 22,
      lowStockThreshold: 5,
      warrantyMonths: 24,
      featured: false,
      status: 'ACTIVE',
      createdAt: '2026-01-17T08:00:00.000Z',
      updatedAt: '2026-01-17T08:00:00.000Z'
    },

    // Security Products
    {
      id: 'prod-sec-01',
      sku: 'DI-SEC-CAM-4K',
      name: 'Hikvision 4K 8MP ColorVu Smart IP Turret Camera',
      slug: 'hikvision-4k-colorvu-smart-ip-camera',
      category: 'security',
      categoryName: 'CCTV & Security',
      brand: 'Hikvision',
      description: 'Ultra-HD 8MP IP surveillance camera equipped with F1.0 super aperture for full 24/7 vivid color night vision. Features AcuSense AI target classification (human and vehicle) and built-in microphone.',
      images: [
        'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Resolution': '8MP (3840 × 2160) @ 20fps',
        'Lens': '2.8mm Fixed Lens (102° FOV)',
        'Night Vision': 'ColorVu up to 40m Warm Light',
        'Audio': 'Built-in Noise-Cancelling Microphone',
        'Ingress Protection': 'IP67 Weatherproof Metal Housing',
        'Power': 'PoE (802.3af) or 12V DC'
      },
      price: 11500,
      discountPrice: 10200,
      stock: 28,
      lowStockThreshold: 6,
      warrantyMonths: 24,
      featured: true,
      status: 'ACTIVE',
      createdAt: '2026-01-18T08:00:00.000Z',
      updatedAt: '2026-01-18T08:00:00.000Z'
    },
    {
      id: 'prod-sec-02',
      sku: 'DI-SEC-NVR-16CH',
      name: 'Dahua 16-Channel 4K PoE Network Video Recorder',
      slug: 'dahua-16-channel-4k-poe-nvr',
      category: 'security',
      categoryName: 'CCTV & Security',
      brand: 'Dahua Technology',
      description: 'Enterprise 16-channel NVR with 16 independent built-in PoE ports for plug-and-play camera installation. Supports dual 4K HDMI outputs and dual SATA hard drive bays up to 20TB.',
      images: [
        'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Channels': '16 Channels with 16 Built-in PoE Ports',
        'Bandwidth': 'Up to 256 Mbps Incoming Bandwidth',
        'Storage': '2 SATA Interfaces (Up to 10TB per HDD)',
        'Compression': 'Smart H.265+ / H.264+',
        'AI Features': 'Facial Recognition, Perimeter Protection, SMD Plus'
      },
      price: 24000,
      discountPrice: 22500,
      stock: 8,
      lowStockThreshold: 2,
      warrantyMonths: 24,
      featured: true,
      status: 'ACTIVE',
      createdAt: '2026-01-19T08:00:00.000Z',
      updatedAt: '2026-01-19T08:00:00.000Z'
    },
    {
      id: 'prod-sec-03',
      sku: 'DI-SEC-ACC-BIO',
      name: 'ZKTeco Facial & Fingerprint Biometric Access Terminal',
      slug: 'zkteco-facial-biometric-access-terminal',
      category: 'security',
      categoryName: 'CCTV & Security',
      brand: 'ZKTeco',
      description: 'Touchless facial recognition and fingerprint time attendance terminal with electromagnetic lock relay control. Includes companion management software with automated attendance payroll export.',
      images: [
        'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Capacity': '3,000 Faces / 3,000 Fingerprints / 10,000 Cards',
        'Display': '4.3-inch IPS Touch Screen',
        'Communication': 'TCP/IP, Wi-Fi, USB-Host',
        'Access Interface': '3rd Party Electric Lock, Door Sensor, Exit Button'
      },
      price: 19500,
      discountPrice: undefined,
      stock: 12,
      lowStockThreshold: 4,
      warrantyMonths: 18,
      featured: false,
      status: 'ACTIVE',
      createdAt: '2026-01-20T08:00:00.000Z',
      updatedAt: '2026-01-20T08:00:00.000Z'
    },

    // Networking Products
    {
      id: 'prod-net-01',
      sku: 'DI-NET-AP-U6PRO',
      name: 'Ubiquiti UniFi U6-Pro Wi-Fi 6 Enterprise Access Point',
      slug: 'ubiquiti-unifi-u6-pro-wifi6-access-point',
      category: 'networking',
      categoryName: 'Networking & Wi-Fi',
      brand: 'Ubiquiti Networks',
      description: 'High-performance dual-band Wi-Fi 6 access point delivering up to 5.3 Gbps aggregate throughput. Ideal for high-density environments, luxury villas, and multi-tenant offices.',
      images: [
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Wi-Fi Standard': 'Wi-Fi 6 (802.11ax) 4x4 MU-MIMO',
        'Throughput': 'Up to 4.8 Gbps (5 GHz) + 573.5 Mbps (2.4 GHz)',
        'Coverage': 'Up to 140 m² (1,500 ft²)',
        'Connected Clients': '350+ Concurrent Devices',
        'Power Method': 'PoE+ (802.3at)'
      },
      price: 16500,
      discountPrice: 15200,
      stock: 19,
      lowStockThreshold: 4,
      warrantyMonths: 12,
      featured: true,
      status: 'ACTIVE',
      createdAt: '2026-01-21T08:00:00.000Z',
      updatedAt: '2026-01-21T08:00:00.000Z'
    },
    {
      id: 'prod-net-02',
      sku: 'DI-NET-SW-24POE',
      name: 'Cisco CBS250 24-Port Gigabit Managed PoE+ Switch',
      slug: 'cisco-cbs250-24port-gigabit-poe-switch',
      category: 'networking',
      categoryName: 'Networking & Wi-Fi',
      brand: 'Cisco Business',
      description: 'Smart managed 24-port Gigabit Ethernet switch with 195W total PoE+ power budget and 4 dedicated Gigabit SFP fiber uplink slots. Features Layer 3 static routing and robust web GUI.',
      images: [
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Ports': '24 × 10/100/1000 PoE+ Ports + 4 × Gigabit SFP Uplinks',
        'PoE Power Budget': '195W Total PoE+',
        'Switching Capacity': '56 Gbps',
        'Form Factor': '1U 19-inch Rack Mountable'
      },
      price: 36000,
      discountPrice: 33500,
      stock: 6,
      lowStockThreshold: 2,
      warrantyMonths: 24,
      featured: true,
      status: 'ACTIVE',
      createdAt: '2026-01-22T08:00:00.000Z',
      updatedAt: '2026-01-22T08:00:00.000Z'
    },
    {
      id: 'prod-net-03',
      sku: 'DI-NET-CBL-CAT6',
      name: 'D-Link Cat6 UTP Solid Pure Copper Cable (305m Box)',
      slug: 'dlink-cat6-utp-cable-305m',
      category: 'networking',
      categoryName: 'Networking & Wi-Fi',
      brand: 'D-Link',
      description: '23 AWG solid bare copper 4-pair unshielded twisted pair (UTP) network cable box with central PE separator. Verified to 250 MHz frequency bandwidth for Gigabit data transmission.',
      images: [
        'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Conductor': '23 AWG Solid Bare Copper',
        'Length': '305 Meters (1000 ft) Easy-Pull Box',
        'Bandwidth': 'Up to 250 MHz',
        'Jacket': 'CM / LSZH Flame Retardant'
      },
      price: 11000,
      discountPrice: 9900,
      stock: 35,
      lowStockThreshold: 8,
      warrantyMonths: 60,
      featured: false,
      status: 'ACTIVE',
      createdAt: '2026-01-23T08:00:00.000Z',
      updatedAt: '2026-01-23T08:00:00.000Z'
    },

    // IT Products
    {
      id: 'prod-it-01',
      sku: 'DI-IT-SSD-1TB',
      name: 'Samsung 980 Pro 1TB NVMe PCIe 4.0 SSD',
      slug: 'samsung-980-pro-1tb-nvme-ssd',
      category: 'it',
      categoryName: 'IT & Computing',
      brand: 'Samsung',
      description: 'Blazing fast solid state drive with read speeds up to 7,000 MB/s. Perfect for high-performance engineering workstations, video editing rigs, and commercial servers.',
      images: [
        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Capacity': '1TB NVMe M.2 2280',
        'Sequential Read': 'Up to 7,000 MB/s',
        'Sequential Write': 'Up to 5,000 MB/s',
        'Endurance': '600 TBW (Terabytes Written)'
      },
      price: 8500,
      discountPrice: 7800,
      stock: 25,
      lowStockThreshold: 5,
      warrantyMonths: 36,
      featured: true,
      status: 'ACTIVE',
      createdAt: '2026-01-24T08:00:00.000Z',
      updatedAt: '2026-01-24T08:00:00.000Z'
    },
    {
      id: 'prod-it-02',
      sku: 'DI-IT-RAM-16GB',
      name: 'Kingston Fury Beast 16GB DDR4 3200MHz Desktop RAM',
      slug: 'kingston-fury-beast-16gb-ddr4-ram',
      category: 'it',
      categoryName: 'IT & Computing',
      brand: 'Kingston',
      description: 'High-reliability low-profile aluminum heat spreader memory module engineered to upgrade office PCs and workstation multitasking performance.',
      images: [
        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Capacity': '16GB (1 × 16GB)',
        'Speed': 'DDR4-3200 MHz CL16',
        'Heatspreader': 'Black Anodized Aluminum',
        'Compatibility': 'Intel & AMD Motherboards'
      },
      price: 4200,
      discountPrice: 3850,
      stock: 30,
      lowStockThreshold: 6,
      warrantyMonths: 24,
      featured: false,
      status: 'ACTIVE',
      createdAt: '2026-01-25T08:00:00.000Z',
      updatedAt: '2026-01-25T08:00:00.000Z'
    },
    {
      id: 'prod-it-03',
      sku: 'DI-IT-UPS-1500VA',
      name: 'APC Easy UPS Line-Interactive 1500VA / 865W',
      slug: 'apc-easy-ups-1500va-865w',
      category: 'it',
      categoryName: 'IT & Computing',
      brand: 'APC by Schneider',
      description: 'Automatic Voltage Regulation (AVR) uninterruptible power supply providing battery backup power and surge protection for servers, NVRs, and desktop computers during Ethiopian grid fluctuations.',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop'
      ],
      specifications: {
        'Output Power': '1500VA / 865 Watts',
        'Outlets': '4 Universal Battery Protected + 2 Surge Only',
        'Input Voltage Range': '140 - 300V AC (Built-in AVR)',
        'Typical Recharge Time': '6 Hours'
      },
      price: 19800,
      discountPrice: 18200,
      stock: 9,
      lowStockThreshold: 3,
      warrantyMonths: 24,
      featured: true,
      status: 'ACTIVE',
      createdAt: '2026-01-26T08:00:00.000Z',
      updatedAt: '2026-01-26T08:00:00.000Z'
    }
  ];

  const projects: Project[] = [
    {
      id: 'prj-01',
      projectNumber: 'DI-PRJ-2026-00001',
      customerId: 'usr-cust-01',
      customerName: 'Abebe Kebede (Horizon Real Estate)',
      customerEmail: 'customer@horizon-et.com',
      customerPhone: '+251 911 889 900',
      quoteId: 'qt-01',
      title: 'Bole Olympia Luxury Penthouse Smart Automation & CCTV',
      type: 'RESIDENTIAL',
      location: 'Bole Olympia, Addis Ababa',
      description: 'Turnkey electrical panel overhaul, 14-zone smart tempered touch switch automation, 4K ColorVu security cameras, and 1Gbps unified mesh Wi-Fi 6 coverage for a 650m² luxury penthouse.',
      scopeOfWork: [
        'Main distribution board rebuild with Schneider 3-phase switchgear',
        '14-zone Zigbee smart light switches & motorized curtain rails',
        '6 × 4K Hikvision ColorVu IP cameras with 30-day NVR recording',
        '3 × UniFi U6-Pro Wi-Fi 6 access points with seamless roaming',
        'Water tank automatic level controller with mobile telemetry'
      ],
      budget: 345000,
      startDate: '2026-01-15T08:00:00.000Z',
      targetCompletionDate: '2026-02-28T17:00:00.000Z',
      actualCompletionDate: '2026-02-24T16:00:00.000Z',
      assignedTechnicianIds: ['usr-tech-01'],
      assignedTechnicianNames: ['Dawit Bekele'],
      status: 'COMPLETED',
      progressPercentage: 100,
      milestones: [
        { id: 'm1', title: 'Site Inspection & Engineering Blueprints', status: 'COMPLETED', dueDate: '2026-01-18', completedAt: '2026-01-17', notes: 'Approved by lead architect.' },
        { id: 'm2', title: 'Conduit Channeling & Cabling Infrastructure', status: 'COMPLETED', dueDate: '2026-01-30', completedAt: '2026-01-29', notes: 'Cat6 UTP and 4mm copper lines pulled.' },
        { id: 'm3', title: 'Equipment Mounting & Distribution Board Setup', status: 'COMPLETED', dueDate: '2026-02-12', completedAt: '2026-02-11', notes: 'Schneider MDB and cameras mounted.' },
        { id: 'm4', title: 'Smart Scenes Programming & Testing', status: 'COMPLETED', dueDate: '2026-02-20', completedAt: '2026-02-19', notes: 'Automation scenes and mobile app synced.' },
        { id: 'm5', title: 'Client Walkthrough & Warranty Handover', status: 'COMPLETED', dueDate: '2026-02-24', completedAt: '2026-02-24', notes: 'Signed acceptance certificate.' }
      ],
      photos: [
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop', caption: 'Completed living hall smart scene lighting', date: '2026-02-24', stage: 'Final Delivery' },
        { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop', caption: 'Custom 3-Phase Schneider distribution panel', date: '2026-02-12', stage: 'Distribution' },
        { url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1000&auto=format&fit=crop', caption: 'Perimeter ColorVu IP surveillance camera', date: '2026-02-15', stage: 'Security' }
      ],
      documents: [
        { name: 'Electrical_Schematic_Diagram.pdf', url: '#', size: '2.4 MB', date: '2026-01-18' },
        { name: 'Commissioning_Warranty_Certificate.pdf', url: '#', size: '1.1 MB', date: '2026-02-24' }
      ],
      isFeatured: true,
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
      tags: ['Smart Home', 'CCTV', 'Electrical', 'Residential'],
      createdAt: '2026-01-15T08:00:00.000Z',
      updatedAt: '2026-02-24T16:00:00.000Z'
    },
    {
      id: 'prj-02',
      projectNumber: 'DI-PRJ-2026-00002',
      customerId: 'usr-cust-02',
      customerName: 'Tigist Haile (Grand Mall Bole)',
      customerEmail: 'customer2@grandmall.et',
      customerPhone: '+251 922 445 566',
      quoteId: 'qt-02',
      title: 'Grand Mall Bole - 32 Camera CCTV & Mall Public Wi-Fi',
      type: 'COMMERCIAL',
      location: 'Airport Road, Bole, Addis Ababa',
      description: 'Commercial 32-channel AI IP surveillance network covering retail corridors, parking basement, and cash desks, alongside dual-WAN high-capacity public guest Wi-Fi for 400+ simultaneous shoppers.',
      scopeOfWork: [
        '32 × 4K Dahua/Hikvision IP dome & bullet cameras with Starlight IR',
        '2 × 16-Channel 4K NVR with 16TB enterprise video storage array',
        '8 × UniFi U6-Pro High-Density Wi-Fi Access Points',
        '24-Port PoE+ Cisco switches with fiber optic backbone between floors',
        'Captive portal branded login page for mall visitors'
      ],
      budget: 520000,
      startDate: '2026-02-01T08:00:00.000Z',
      targetCompletionDate: '2026-03-15T17:00:00.000Z',
      assignedTechnicianIds: ['usr-tech-01'],
      assignedTechnicianNames: ['Dawit Bekele'],
      status: 'INSTALLATION',
      progressPercentage: 65,
      milestones: [
        { id: 'm1', title: 'Floor Survey & Fiber Pathway Routing', status: 'COMPLETED', dueDate: '2026-02-05', completedAt: '2026-02-04', notes: 'Vertical risers mapped.' },
        { id: 'm2', title: 'Structured Cat6 Cabling & Server Rack Setup', status: 'COMPLETED', dueDate: '2026-02-18', completedAt: '2026-02-17', notes: '32 camera drops terminated and tested.' },
        { id: 'm3', title: 'Camera & Access Point Installation', status: 'IN_PROGRESS', dueDate: '2026-02-28', notes: '22 of 32 cameras currently mounted.' },
        { id: 'm4', title: 'Control Room NVR Matrix & TV Wall Calibration', status: 'PENDING', dueDate: '2026-03-08' },
        { id: 'm5', title: 'Final Stress Test & Staff Handover', status: 'PENDING', dueDate: '2026-03-15' }
      ],
      photos: [
        { url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop', caption: 'Server rack patch panel termination in progress', date: '2026-02-17', stage: 'Infrastructure' },
        { url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1000&auto=format&fit=crop', caption: 'Corridor CCTV coverage verification', date: '2026-02-20', stage: 'Testing' }
      ],
      documents: [
        { name: 'GrandMall_Network_Topology.pdf', url: '#', size: '3.8 MB', date: '2026-02-05' }
      ],
      isFeatured: true,
      featuredImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop',
      tags: ['CCTV', 'Networking', 'Commercial', 'Wi-Fi'],
      createdAt: '2026-02-01T08:00:00.000Z',
      updatedAt: '2026-02-20T11:00:00.000Z'
    },
    {
      id: 'prj-03',
      projectNumber: 'DI-PRJ-2026-00003',
      customerId: 'usr-cust-01',
      customerName: 'Abebe Kebede (Horizon Industrial Park)',
      customerEmail: 'customer@horizon-et.com',
      customerPhone: '+251 911 889 900',
      title: 'Hawassa Textile Facility Industrial Power Distribution & Earthing',
      type: 'INDUSTRIAL',
      location: 'Hawassa Industrial Zone, Sidama Region',
      description: 'Heavy industrial 400A main switchboard installation, motor control center wiring, and low-resistance earthing grounding pit (<2Ω) for a high-output fabric production facility.',
      scopeOfWork: [
        '400A Main Switchboard assembly with digital power meter & surge protection',
        'Armored XLPE cable pulling in galvanized steel cable trays',
        'Chemical earthing pit installation with copper earth rods and bentonite',
        'Thermographic electrical survey of all machine power feeds'
      ],
      budget: 890000,
      startDate: '2026-02-15T08:00:00.000Z',
      targetCompletionDate: '2026-04-10T17:00:00.000Z',
      assignedTechnicianIds: ['usr-tech-01'],
      assignedTechnicianNames: ['Dawit Bekele'],
      status: 'MATERIALS',
      progressPercentage: 25,
      milestones: [
        { id: 'm1', title: 'Industrial Load Calculations & EEP Approvals', status: 'COMPLETED', dueDate: '2026-02-20', completedAt: '2026-02-19' },
        { id: 'm2', title: 'Heavy Switchgear Delivery & On-Site Staging', status: 'IN_PROGRESS', dueDate: '2026-03-02', notes: 'Switchboard components cleared customs.' },
        { id: 'm3', title: 'Cable Tray Fabrication & Armored Cable Laying', status: 'PENDING', dueDate: '2026-03-18' },
        { id: 'm4', title: 'Earthing Testing & Insulation Resistance Checks', status: 'PENDING', dueDate: '2026-03-30' },
        { id: 'm5', title: 'Factory Commissioning & Safety Certification', status: 'PENDING', dueDate: '2026-04-10' }
      ],
      photos: [
        { url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop', caption: 'Industrial switchboard staging at workshop', date: '2026-02-20', stage: 'Planning' }
      ],
      documents: [
        { name: 'Industrial_Earthing_Calculation.pdf', url: '#', size: '1.9 MB', date: '2026-02-19' }
      ],
      isFeatured: false,
      featuredImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
      tags: ['Industrial', 'Electrical', 'Earthing'],
      createdAt: '2026-02-15T08:00:00.000Z',
      updatedAt: '2026-02-20T12:00:00.000Z'
    }
  ];

  const quotes: Quote[] = [
    {
      id: 'qt-01',
      quoteNumber: 'DI-QT-2026-00001',
      customerId: 'usr-cust-01',
      customerName: 'Abebe Kebede',
      customerEmail: 'customer@horizon-et.com',
      customerPhone: '+251 911 889 900',
      customerLocation: 'Bole Olympia, Addis Ababa',
      propertyType: 'RESIDENTIAL',
      requiredServices: ['electrical-engineering', 'smart-home', 'cctv-security'],
      projectDescription: 'Complete electrical overhaul for 650m² luxury penthouse with smart lighting touch switches, 6 IP security cameras, and automated water tank controller.',
      estimatedBudget: '300,000 - 400,000 ETB',
      preferredDate: '2026-01-20',
      status: 'APPROVED',
      assignedStaffId: 'usr-sales-01',
      assignedStaffName: 'Marta Worku',
      items: [
        { id: 'qi-1', description: 'Schneider 12-Way 3-Phase Distribution Board & Breakers', type: 'MATERIAL', quantity: 1, unit: 'Set', unitPrice: 18500, totalPrice: 18500 },
        { id: 'qi-2', description: 'Pure Copper 4mm² & 2.5mm² Cable Coils', type: 'MATERIAL', quantity: 6, unit: 'Rolls', unitPrice: 8500, totalPrice: 51000 },
        { id: 'qi-3', description: 'Smart Touch Wall Switches (Glass Black) + Zigbee Gateway', type: 'MATERIAL', quantity: 14, unit: 'Pcs', unitPrice: 3200, totalPrice: 44800 },
        { id: 'qi-4', description: 'Hikvision 4K ColorVu Turret IP Cameras + 8CH NVR', type: 'MATERIAL', quantity: 6, unit: 'Units', unitPrice: 10200, totalPrice: 61200 },
        { id: 'qi-5', description: 'UniFi U6-Pro Wi-Fi 6 Access Points', type: 'MATERIAL', quantity: 3, unit: 'Units', unitPrice: 15200, totalPrice: 45600 },
        { id: 'qi-6', description: 'Conduit, J-Boxes, RJ45 Keystone & Hardware Accessories', type: 'MATERIAL', quantity: 1, unit: 'Lot', unitPrice: 22000, totalPrice: 22000 },
        { id: 'qi-7', description: 'Senior Electrical & Network Certified Engineering Labor', type: 'LABOR', quantity: 12, unit: 'Days', unitPrice: 4500, totalPrice: 54000 },
        { id: 'qi-8', description: 'System Commissioning, App Configuration & Testing', type: 'SERVICE', quantity: 1, unit: 'Project', unitPrice: 12000, totalPrice: 12000 }
      ],
      subtotal: 309100,
      taxRate: 0.15,
      taxAmount: 46365,
      discount: 10465,
      totalAmount: 345000,
      adminNotes: 'Customer approved quotation. Converted to project DI-PRJ-2026-00001.',
      validUntil: '2026-02-15T00:00:00.000Z',
      approvedAt: '2026-01-14T10:30:00.000Z',
      convertedProjectId: 'prj-01',
      createdAt: '2026-01-11T09:00:00.000Z',
      updatedAt: '2026-01-14T10:30:00.000Z'
    },
    {
      id: 'qt-02',
      quoteNumber: 'DI-QT-2026-00002',
      customerId: 'usr-cust-02',
      customerName: 'Tigist Haile',
      customerEmail: 'customer2@grandmall.et',
      customerPhone: '+251 922 445 566',
      customerLocation: 'Airport Road, Bole, Addis Ababa',
      propertyType: 'COMMERCIAL',
      requiredServices: ['cctv-security', 'networking-wifi'],
      projectDescription: 'Commercial 32-camera surveillance coverage for multi-story shopping mall and high-capacity guest Wi-Fi access.',
      estimatedBudget: '500,000 - 600,000 ETB',
      preferredDate: '2026-02-05',
      status: 'APPROVED',
      assignedStaffId: 'usr-sales-01',
      assignedStaffName: 'Marta Worku',
      items: [
        { id: 'qi-21', description: '4K ColorVu IP CCTV Cameras & 16-CH NVRs', type: 'MATERIAL', quantity: 32, unit: 'Units', unitPrice: 7800, totalPrice: 249600 },
        { id: 'qi-22', description: 'Cisco 24-Port PoE+ Gigabit Managed Switches', type: 'MATERIAL', quantity: 2, unit: 'Units', unitPrice: 33500, totalPrice: 67000 },
        { id: 'qi-23', description: 'UniFi U6-Pro High Density Wi-Fi 6 Access Points', type: 'MATERIAL', quantity: 8, unit: 'Units', unitPrice: 15200, totalPrice: 121600 },
        { id: 'qi-24', description: 'Cat6 Cable Drums & Server Cabinet Integration', type: 'MATERIAL', quantity: 4, unit: 'Boxes', unitPrice: 9900, totalPrice: 39600 },
        { id: 'qi-25', description: 'Installation, Conduit Pulling & Commissioning Labor', type: 'LABOR', quantity: 1, unit: 'Turnkey', unitPrice: 42200, totalPrice: 42200 }
      ],
      subtotal: 520000,
      taxRate: 0.15,
      taxAmount: 78000,
      discount: 78000,
      totalAmount: 520000,
      adminNotes: 'Price agreed with commercial management team. Converted to project DI-PRJ-2026-00002.',
      validUntil: '2026-02-28T00:00:00.000Z',
      approvedAt: '2026-01-30T15:00:00.000Z',
      convertedProjectId: 'prj-02',
      createdAt: '2026-01-26T11:00:00.000Z',
      updatedAt: '2026-01-30T15:00:00.000Z'
    },
    {
      id: 'qt-03',
      quoteNumber: 'DI-QT-2026-00003',
      customerId: 'usr-cust-01',
      customerName: 'Abebe Kebede',
      customerEmail: 'customer@horizon-et.com',
      customerPhone: '+251 911 889 900',
      customerLocation: 'CMC Heights, Yeka Sub-City, Addis Ababa',
      propertyType: 'RESIDENTIAL',
      requiredServices: ['electrical-engineering', 'maintenance-support'],
      projectDescription: 'Preventative electrical audit, thermal imaging test for 24-apartment block distribution panels, and replacement of outdated surge protectors.',
      estimatedBudget: '80,000 - 120,000 ETB',
      preferredDate: '2026-03-05',
      status: 'QUOTED',
      assignedStaffId: 'usr-sales-01',
      assignedStaffName: 'Marta Worku',
      items: [
        { id: 'qi-31', description: 'Thermal Imaging Diagnostic Scan (24 Electrical Panels)', type: 'SERVICE', quantity: 24, unit: 'Panels', unitPrice: 1500, totalPrice: 36000 },
        { id: 'qi-32', description: 'ABB 40kA 4-Pole Surge Protective Devices', type: 'MATERIAL', quantity: 6, unit: 'Units', unitPrice: 6800, totalPrice: 40800 },
        { id: 'qi-33', description: 'Earth Resistance Megger Testing & Neutral Balance Audit', type: 'SERVICE', quantity: 1, unit: 'Audit', unitPrice: 18000, totalPrice: 18000 },
        { id: 'qi-34', description: 'Certified Engineering Master Report & Recommendations', type: 'SERVICE', quantity: 1, unit: 'Report', unitPrice: 8000, totalPrice: 8000 }
      ],
      subtotal: 102800,
      taxRate: 0.15,
      taxAmount: 15420,
      discount: 3220,
      totalAmount: 115000,
      adminNotes: 'Formal quotation prepared and dispatched to customer for digital review and approval.',
      validUntil: '2026-03-25T00:00:00.000Z',
      createdAt: '2026-02-20T10:15:00.000Z',
      updatedAt: '2026-02-21T14:20:00.000Z'
    },
    {
      id: 'qt-04',
      quoteNumber: 'DI-QT-2026-00004',
      customerId: 'usr-cust-02',
      customerName: 'Tigist Haile',
      customerEmail: 'customer2@grandmall.et',
      customerPhone: '+251 922 445 566',
      customerLocation: 'Bole Medhanealem, Addis Ababa',
      propertyType: 'COMMERCIAL',
      requiredServices: ['it-support', 'networking-wifi'],
      projectDescription: 'Corporate office IT setup for 18 workstations, automated network NAS backup, and firewall installation.',
      estimatedBudget: '150,000 ETB',
      preferredDate: '2026-03-10',
      status: 'REVIEWING',
      items: [],
      subtotal: 0,
      taxRate: 0.15,
      taxAmount: 0,
      discount: 0,
      totalAmount: 0,
      customerNotes: 'Please include high-capacity NAS storage options in the quote proposal.',
      createdAt: '2026-02-23T08:45:00.000Z',
      updatedAt: '2026-02-23T09:00:00.000Z'
    }
  ];

  const orders: Order[] = [
    {
      id: 'ord-01',
      orderNumber: 'DI-ORD-2026-00001',
      customerId: 'usr-cust-01',
      customerName: 'Abebe Kebede',
      customerEmail: 'customer@horizon-et.com',
      customerPhone: '+251 911 889 900',
      shippingAddress: 'Bole Olympia, House 412',
      city: 'Addis Ababa',
      subCity: 'Bole',
      orderType: 'PURCHASE',
      items: [
        { productId: 'prod-sec-01', productName: 'Hikvision 4K 8MP ColorVu Smart IP Turret Camera', sku: 'DI-SEC-CAM-4K', price: 10200, quantity: 2, totalPrice: 20400 },
        { productId: 'prod-net-01', productName: 'Ubiquiti UniFi U6-Pro Wi-Fi 6 Enterprise Access Point', sku: 'DI-NET-AP-U6PRO', price: 15200, quantity: 1, totalPrice: 15200 }
      ],
      subtotal: 35600,
      taxAmount: 5340,
      deliveryFee: 500,
      totalAmount: 41440,
      paymentMethod: 'TELEBIRR',
      paymentStatus: 'PAID',
      status: 'DELIVERED',
      notes: 'Delivered directly to site with inspection slip.',
      createdAt: '2026-02-10T09:30:00.000Z',
      updatedAt: '2026-02-12T14:00:00.000Z'
    },
    {
      id: 'ord-02',
      orderNumber: 'DI-ORD-2026-00002',
      customerId: 'usr-cust-02',
      customerName: 'Tigist Haile',
      customerEmail: 'customer2@grandmall.et',
      customerPhone: '+251 922 445 566',
      shippingAddress: 'Grand Mall Bole, Management Office',
      city: 'Addis Ababa',
      subCity: 'Bole',
      orderType: 'PURCHASE',
      items: [
        { productId: 'prod-it-03', productName: 'APC Easy UPS Line-Interactive 1500VA / 865W', sku: 'DI-IT-UPS-1500VA', price: 18200, quantity: 2, totalPrice: 36400 }
      ],
      subtotal: 36400,
      taxAmount: 5460,
      deliveryFee: 0,
      totalAmount: 41860,
      paymentMethod: 'CBE_BIRR',
      paymentStatus: 'PAID',
      status: 'PROCESSING',
      notes: 'Customer requested testing prior to site dispatch.',
      createdAt: '2026-02-22T11:20:00.000Z',
      updatedAt: '2026-02-22T11:30:00.000Z'
    }
  ];

  const warranties: Warranty[] = [
    {
      id: 'wr-01',
      warrantyNumber: 'DI-WR-2026-00001',
      customerId: 'usr-cust-01',
      customerName: 'Abebe Kebede',
      customerEmail: 'customer@horizon-et.com',
      customerPhone: '+251 911 889 900',
      projectId: 'prj-01',
      projectName: 'Bole Olympia Luxury Penthouse Smart Automation & CCTV',
      productName: 'Turnkey Electrical, Smart Touch & Hikvision 4K CCTV Installation',
      serialNumber: 'HK-CV8M-2026-09481',
      installationDate: '2026-02-24T00:00:00.000Z',
      startDate: '2026-02-24T00:00:00.000Z',
      endDate: '2028-02-24T00:00:00.000Z', // 24 months
      warrantyType: 'COMPREHENSIVE',
      coverageDetails: 'Full coverage for equipment defects on Hikvision cameras, Schneider switchgear, smart switches, and 12-month free labor on all cabling.',
      status: 'ACTIVE',
      claimsCount: 0,
      createdAt: '2026-02-24T16:30:00.000Z'
    },
    {
      id: 'wr-02',
      warrantyNumber: 'DI-WR-2026-00002',
      customerId: 'usr-cust-01',
      customerName: 'Abebe Kebede',
      customerEmail: 'customer@horizon-et.com',
      productId: 'prod-net-01',
      productName: 'Ubiquiti UniFi U6-Pro Wi-Fi 6 Enterprise Access Point',
      serialNumber: 'UBNT-U6P-992147A',
      installationDate: '2026-02-12T00:00:00.000Z',
      startDate: '2026-02-12T00:00:00.000Z',
      endDate: '2027-02-12T00:00:00.000Z',
      warrantyType: 'EQUIPMENT_WARRANTY',
      coverageDetails: 'Manufacturer replacement warranty against hardware controller failures and PoE transceiver defects.',
      status: 'ACTIVE',
      claimsCount: 0,
      createdAt: '2026-02-12T14:30:00.000Z'
    }
  ];

  const claims: WarrantyClaim[] = [];

  const tickets: SupportTicket[] = [
    {
      id: 'tk-01',
      ticketNumber: 'DI-TK-2026-00001',
      customerId: 'usr-cust-01',
      customerName: 'Abebe Kebede',
      customerEmail: 'customer@horizon-et.com',
      customerPhone: '+251 911 889 900',
      category: 'CCTV',
      priority: 'NORMAL',
      status: 'IN_PROGRESS',
      subject: 'Camera 4 (Balcony) remote push notification schedule adjustment',
      initialMessage: 'Good afternoon DIGITAL INSTALL team. We would like to adjust the smart AcuSense motion alerts on Camera 4 so it only sends mobile alerts between 11:00 PM and 6:00 AM instead of 24/7.',
      assignedStaffId: 'usr-tech-01',
      assignedStaffName: 'Dawit Bekele',
      messages: [
        {
          id: 'msg-1',
          ticketId: 'tk-01',
          senderId: 'usr-cust-01',
          senderName: 'Abebe Kebede',
          senderRole: 'CUSTOMER',
          message: 'Good afternoon DIGITAL INSTALL team. We would like to adjust the smart AcuSense motion alerts on Camera 4 so it only sends mobile alerts between 11:00 PM and 6:00 AM instead of 24/7.',
          createdAt: '2026-02-24T18:00:00.000Z'
        },
        {
          id: 'msg-2',
          ticketId: 'tk-01',
          senderId: 'usr-tech-01',
          senderName: 'Dawit Bekele',
          senderRole: 'TECHNICIAN',
          message: 'Hello Ato Abebe! I have accessed the NVR portal remotely and programmed the time arming schedule for Camera 4 specifically for 23:00 to 06:00 daily. Please test tonight and let me know if the alerts match your preference!',
          createdAt: '2026-02-24T19:15:00.000Z'
        }
      ],
      createdAt: '2026-02-24T18:00:00.000Z',
      updatedAt: '2026-02-24T19:15:00.000Z'
    }
  ];

  const contactMessages: ContactMessage[] = [
    {
      id: 'cm-01',
      name: 'Dr. Henok Solomon',
      phone: '+251 911 556 677',
      email: 'henok.s@gmail.com',
      service: 'Smart Home Solutions',
      location: 'Old Airport / Sarbet, Addis Ababa',
      message: 'Hello, I am constructing a G+2 villa in Sarbet and looking for complete smart lighting, video door entry, and CCTV design. When can an engineer visit the site?',
      status: 'CONTACTED',
      createdAt: '2026-02-22T09:00:00.000Z'
    }
  ];

  const settings: CompanySettings = {
    companyName: 'DIGITAL INSTALL',
    tagline: 'Engineering & Technology Solutions',
    slogan: 'DESIGN • SUPPLY • INSTALL • SUPPORT',
    logoUrl: '/logo.svg',
    primaryPhone: '+251 911 000 111',
    secondaryPhone: '+251 116 290 880',
    whatsApp: '+251 911 000 111',
    email: 'info@digitalinstall-et.com',
    supportEmail: 'support@digitalinstall-et.com',
    address: 'Bole Sub-City, Africa Avenue (Airport Road), Near Edna Mall, Addis Ababa, Ethiopia',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    businessHours: 'Monday - Saturday: 8:00 AM - 6:00 PM (Emergency Support 24/7)',
    currency: 'ETB',
    currencySymbol: 'ETB',
    defaultTaxRate: 0.15,
    defaultWarrantyDays: 365,
    tinNumber: '0098472911',
    licenseNumber: 'ENG-AA-2026-8849',
    socials: {
      facebook: 'https://facebook.com/digitalinstall.et',
      telegram: 'https://t.me/digitalinstall_et',
      linkedin: 'https://linkedin.com/company/digitalinstall-et'
    }
  };

  const auditLogs: AuditLog[] = [
    {
      id: 'aud-01',
      userId: 'usr-admin-01',
      userName: 'Yohannes Getachew',
      userRole: 'SUPER_ADMIN',
      action: 'SYSTEM_INITIALIZED',
      entityType: 'SETTINGS',
      details: 'DIGITAL INSTALL Production platform initialized with enterprise database schema and baseline parameters.',
      ipAddress: '197.156.104.12',
      createdAt: '2026-01-10T08:00:00.000Z'
    },
    {
      id: 'aud-02',
      userId: 'usr-sales-01',
      userName: 'Marta Worku',
      userRole: 'SALES',
      action: 'QUOTE_ISSUED',
      entityType: 'QUOTE',
      entityId: 'qt-01',
      details: 'Issued formal quotation DI-QT-2026-00001 for customer Abebe Kebede (345,000 ETB).',
      ipAddress: '197.156.104.14',
      createdAt: '2026-01-11T10:00:00.000Z'
    },
    {
      id: 'aud-03',
      userId: 'usr-cust-01',
      userName: 'Abebe Kebede',
      userRole: 'CUSTOMER',
      action: 'QUOTE_APPROVED',
      entityType: 'QUOTE',
      entityId: 'qt-01',
      details: 'Customer digitally signed and approved quotation DI-QT-2026-00001.',
      ipAddress: '213.55.78.22',
      createdAt: '2026-01-14T10:30:00.000Z'
    },
    {
      id: 'aud-04',
      userId: 'usr-tech-01',
      userName: 'Dawit Bekele',
      userRole: 'TECHNICIAN',
      action: 'PROJECT_COMPLETED',
      entityType: 'PROJECT',
      entityId: 'prj-01',
      details: 'Project DI-PRJ-2026-00001 milestone 5 completed. Handover certificate registered.',
      ipAddress: '197.156.104.18',
      createdAt: '2026-02-24T16:00:00.000Z'
    }
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-01',
      userId: 'usr-cust-01',
      title: 'Project Handover Complete',
      message: 'Your project DI-PRJ-2026-00001 is now 100% completed and your 24-month warranty certificate DI-WR-2026-00001 has been registered.',
      link: '/account?tab=warranties',
      type: 'SUCCESS',
      isRead: false,
      createdAt: '2026-02-24T16:30:00.000Z'
    },
    {
      id: 'notif-02',
      userId: 'usr-cust-01',
      title: 'Quotation Ready for Review',
      message: 'New quotation DI-QT-2026-00003 for CMC Heights Electrical Diagnostic has been prepared for your approval.',
      link: '/account?tab=quotes',
      type: 'INFO',
      isRead: false,
      createdAt: '2026-02-21T14:20:00.000Z'
    },
    {
      id: 'notif-03',
      userId: 'usr-admin-01',
      title: 'New Quotation Request',
      message: 'Customer Tigist Haile submitted quotation request DI-QT-2026-00004 for Corporate IT & Networking.',
      link: '/admin/quotes',
      type: 'INFO',
      isRead: false,
      createdAt: '2026-02-23T08:45:00.000Z'
    }
  ];

  return {
    users,
    customers,
    staff,
    services,
    products,
    projects,
    quotes,
    orders,
    warranties,
    claims,
    tickets,
    contactMessages,
    settings,
    auditLogs,
    notifications
  };
}

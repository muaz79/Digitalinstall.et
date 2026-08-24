import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useCart } from '../../context/CartContext.js';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Menu,
  X,
  ShoppingCart,
  Shield,
  User,
  ChevronDown,
  Zap,
  ShieldCheck,
  Wifi,
  Laptop,
  Home,
  Wrench,
  FileText,
  LogOut,
  Sliders
} from 'lucide-react';

interface HeaderProps {
  onOpenQuoteModal: (serviceSlug?: string) => void;
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuoteModal, currentPath, navigate }) => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isStaff = user && ['SUPER_ADMIN', 'ADMIN', 'SALES', 'SHOP_MANAGER', 'TECHNICIAN'].includes(user.role);

  const servicesList = [
    { slug: 'electrical-engineering', title: 'Electrical Engineering', icon: Zap, desc: 'Distribution boards, wiring, surge protection' },
    { slug: 'cctv-security', title: 'CCTV & Security', icon: ShieldCheck, desc: '4K ColorVu IP cameras, access control, alarms' },
    { slug: 'networking-wifi', title: 'Networking & Wi-Fi', icon: Wifi, desc: 'Cat6/Fiber structured cabling, mesh Wi-Fi 6' },
    { slug: 'it-support', title: 'IT Support & Software', icon: Laptop, desc: 'Workstations, cloud backup, OS & repair' },
    { slug: 'smart-home', title: 'Smart Home Automation', icon: Home, desc: 'Touch glass switches, motorized curtains, scenes' },
    { slug: 'maintenance-support', title: 'Maintenance & AMC', icon: Wrench, desc: 'Preventative thermal scans, warranty SLAs' }
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-[#07111F] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-[11px]">
            <a href="tel:+251911000111" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#1F6FEB]" />
              <span className="font-semibold text-white">+251 911 000 111</span>
            </a>
            <span className="hidden sm:inline-block text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1F6FEB]" />
              <span>Bole Sub-City, Addis Ababa</span>
            </div>
            <span className="hidden md:inline-block text-slate-600">•</span>
            <div className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1F6FEB]" />
              <span>Mon-Sat: 8:00 AM - 6:00 PM</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="font-medium text-slate-400">DESIGN • SUPPLY • INSTALL • SUPPORT</span>
            <span className="text-slate-600">|</span>
            <button
              id="header-warranty-btn"
              onClick={() => navigate('/warranty-support')}
              className="text-slate-300 hover:text-white font-medium hover:underline flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-[#1F6FEB]" />
              Warranty Check
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-[#07111F] flex items-center justify-center border border-[#1F6FEB]/30 shadow-md group-hover:border-[#1F6FEB] transition-all">
              <div className="relative">
                <Zap className="w-6 h-6 text-[#1F6FEB]" />
                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-[#07111F]" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-[#07111F]">DIGITAL</span>
                <span className="text-xl font-black tracking-tight text-[#1F6FEB]">INSTALL</span>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-bold text-slate-500">
                Engineering & Tech Solutions
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-home"
              onClick={() => navigate('/')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentPath === '/' ? 'text-[#1F6FEB] bg-blue-50' : 'text-slate-700 hover:text-[#1F6FEB] hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                id="nav-services-btn"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onClick={() => navigate('/services')}
                className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                  currentPath.startsWith('/services') ? 'text-[#1F6FEB] bg-blue-50' : 'text-slate-700 hover:text-[#1F6FEB] hover:bg-slate-50'
                }`}
              >
                Services
                <ChevronDown className="w-4 h-4" />
              </button>

              {servicesDropdownOpen && (
                <div
                  id="services-menu-dropdown"
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 grid gap-1 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Our Core Capabilities</span>
                    <button
                      onClick={() => { setServicesDropdownOpen(false); navigate('/services'); }}
                      className="text-xs text-[#1F6FEB] font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  {servicesList.map(s => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.slug}
                        id={`nav-service-${s.slug}`}
                        onClick={() => {
                          setServicesDropdownOpen(false);
                          navigate(`/services/${s.slug}`);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-blue-50 text-[#1F6FEB] group-hover:bg-[#1F6FEB] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#1F6FEB] transition-colors">{s.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{s.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              id="nav-shop"
              onClick={() => navigate('/shop')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentPath.startsWith('/shop') ? 'text-[#1F6FEB] bg-blue-50' : 'text-slate-700 hover:text-[#1F6FEB] hover:bg-slate-50'
              }`}
            >
              Shop Catalog
            </button>

            <button
              id="nav-projects"
              onClick={() => navigate('/projects')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentPath.startsWith('/projects') ? 'text-[#1F6FEB] bg-blue-50' : 'text-slate-700 hover:text-[#1F6FEB] hover:bg-slate-50'
              }`}
            >
              Projects
            </button>

            <button
              id="nav-warranty"
              onClick={() => navigate('/warranty-support')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentPath === '/warranty-support' ? 'text-[#1F6FEB] bg-blue-50' : 'text-slate-700 hover:text-[#1F6FEB] hover:bg-slate-50'
              }`}
            >
              Warranty & Support
            </button>

            <button
              id="nav-about"
              onClick={() => navigate('/about')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentPath === '/about' ? 'text-[#1F6FEB] bg-blue-50' : 'text-slate-700 hover:text-[#1F6FEB] hover:bg-slate-50'
              }`}
            >
              About
            </button>

            <button
              id="nav-contact"
              onClick={() => navigate('/contact')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentPath === '/contact' ? 'text-[#1F6FEB] bg-blue-50' : 'text-slate-700 hover:text-[#1F6FEB] hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Cart Icon */}
            <button
              id="header-cart-btn"
              onClick={() => navigate('/cart')}
              className="relative p-2.5 text-slate-700 hover:text-[#1F6FEB] hover:bg-slate-100 rounded-xl transition-colors"
              title="View Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1F6FEB] text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  id="header-user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:pr-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#07111F] text-white font-bold text-xs flex items-center justify-center">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">{user.name}</span>
                    <span className="text-[10px] font-semibold text-[#1F6FEB] tracking-tight">{user.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div
                    id="user-menu-dropdown"
                    onMouseLeave={() => setUserMenuOpen(false)}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 grid gap-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    {isStaff && (
                      <button
                        id="user-menu-admin"
                        onClick={() => { setUserMenuOpen(false); navigate('/admin'); }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 flex items-center gap-2 transition-colors"
                      >
                        <Sliders className="w-4 h-4" />
                        Admin Operations Hub
                      </button>
                    )}

                    <button
                      id="user-menu-portal"
                      onClick={() => { setUserMenuOpen(false); navigate('/account'); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                    >
                      <User className="w-4 h-4 text-[#1F6FEB]" />
                      Customer Portal (/account)
                    </button>

                    <button
                      id="user-menu-quotes"
                      onClick={() => { setUserMenuOpen(false); navigate('/account?tab=quotes'); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                      My Quotations & Projects
                    </button>

                    <button
                      id="user-menu-logout"
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4 text-[#1F6FEB]" />
                Sign In
              </button>
            )}

            {/* Request Quote Button */}
            <button
              id="header-request-quote-btn"
              onClick={() => onOpenQuoteModal()}
              className="bg-[#1F6FEB] hover:bg-[#1558C0] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Request Quote</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 lg:hidden rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Home
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigate('/services'); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Services & Engineering
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigate('/shop'); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Shop & Equipment Sales
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigate('/projects'); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Project Showcase
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigate('/warranty-support'); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Warranty & Support Desk
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigate('/about'); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            About DIGITAL INSTALL
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigate('/contact'); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Contact & Office Map
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/account'); }}
                  className="w-full py-2.5 px-3 bg-slate-100 text-slate-900 font-bold text-sm rounded-xl text-center"
                >
                  My Customer Portal ({user.name})
                </button>
                {isStaff && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/admin'); }}
                    className="w-full py-2.5 px-3 bg-purple-600 text-white font-bold text-sm rounded-xl text-center"
                  >
                    Admin Dashboard
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                className="w-full py-2.5 px-3 bg-[#07111F] text-white font-bold text-sm rounded-xl text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

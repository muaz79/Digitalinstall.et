import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useNotification } from '../../context/NotificationContext.js';
import { X, CheckCircle2, Zap, ShieldCheck, Wifi, Laptop, Home, Wrench, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import { Quote } from '../../types/database.js';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultServiceSlug?: string;
  onQuoteSubmitted?: (quote: Quote) => void;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
  defaultServiceSlug,
  onQuoteSubmitted
}) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<Quote | null>(null);

  // Form Fields
  const [selectedServices, setSelectedServices] = useState<string[]>(() => {
    if (defaultServiceSlug) {
      const map: Record<string, string> = {
        'electrical-engineering': 'Electrical Engineering',
        'cctv-security': 'CCTV & Security Systems',
        'networking-wifi': 'Networking & Wi-Fi',
        'it-support': 'IT Support & Software',
        'smart-home': 'Smart Home Automation',
        'maintenance-support': 'Maintenance & AMC'
      };
      return [map[defaultServiceSlug] || 'Electrical Engineering'];
    }
    return ['Electrical Engineering'];
  });

  const [propertyType, setPropertyType] = useState<'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'INSTITUTIONAL'>('COMMERCIAL');
  const [projectDescription, setProjectDescription] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('50,000 - 150,000 ETB');
  const [preferredDate, setPreferredDate] = useState('');

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+251 9');
  const [location, setLocation] = useState('Bole, Addis Ababa');
  const [customerNotes, setCustomerNotes] = useState('');

  if (!isOpen) return null;

  const services = [
    { name: 'Electrical Engineering', icon: Zap, desc: 'Distribution boards, conduit wiring, backup power' },
    { name: 'CCTV & Security Systems', icon: ShieldCheck, desc: '4K ColorVu IP cameras, NVRs, biometric access' },
    { name: 'Networking & Wi-Fi', icon: Wifi, desc: 'Cat6 structured cabling, fiber links, enterprise mesh' },
    { name: 'IT Support & Software', icon: Laptop, desc: 'Server setup, workstation fleet maintenance, recovery' },
    { name: 'Smart Home Automation', icon: Home, desc: 'Touch glass switches, motorized curtains, mobile control' },
    { name: 'Maintenance & AMC', icon: Wrench, desc: '24/7 SLA emergency repairs, periodic thermal scans' }
  ];

  const toggleService = (srvName: string) => {
    if (selectedServices.includes(srvName)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== srvName));
      }
    } else {
      setSelectedServices([...selectedServices, srvName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !location || !projectDescription) {
      showToast('Missing Fields', 'Please complete all required fields.', 'WARNING');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          location,
          propertyType,
          requiredServices: selectedServices,
          projectDescription,
          estimatedBudget,
          preferredDate,
          customerNotes
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      setSubmittedQuote(data.quote);
      showToast('Quotation Request Submitted', `Reference: ${data.quote.quoteNumber}`, 'SUCCESS');
      if (onQuoteSubmitted) {
        onQuoteSubmitted(data.quote);
      }
    } catch (err: any) {
      showToast('Submission Failed', err.message, 'ALERT');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedQuote(null);
    setStep(1);
    onClose();
  };

  return (
    <div id="quote-request-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#07111F] text-white p-6 relative flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-[#1F6FEB] uppercase tracking-wider">
              Official Engineering Estimation
            </span>
            <h3 className="text-xl font-black text-white">Request Quotation & Engineering Proposal</h3>
          </div>
          <button
            id="btn-close-quote-modal"
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedQuote ? (
          /* Confirmation State */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-slate-900">Quotation Request Received!</h4>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Thank you, <span className="font-semibold text-slate-900">{submittedQuote.customerName}</span>. Your request has been dispatched to our engineering team in Addis Ababa.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Quote Reference:</span>
                <span className="font-mono font-bold text-[#1F6FEB] text-sm">{submittedQuote.quoteNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Target Location:</span>
                <span className="font-semibold text-slate-800">{submittedQuote.customerLocation}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Services Selected:</span>
                <span className="font-semibold text-slate-800">{submittedQuote.requiredServices.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Estimated Turnaround:</span>
                <span className="font-semibold text-emerald-700">Within 24 Hours</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                id="btn-quote-done"
                onClick={handleReset}
                className="px-6 py-3 bg-[#07111F] text-white font-bold text-sm rounded-xl hover:bg-slate-900 transition-colors"
              >
                Close & Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Multi-step wizard */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${step === 1 ? 'bg-[#1F6FEB] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  1
                </div>
                <span className="text-xs font-bold text-slate-800">Services</span>
              </div>
              <div className="w-12 h-0.5 bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${step === 2 ? 'bg-[#1F6FEB] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  2
                </div>
                <span className="text-xs font-bold text-slate-800">Project Scope</span>
              </div>
              <div className="w-12 h-0.5 bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${step === 3 ? 'bg-[#1F6FEB] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  3
                </div>
                <span className="text-xs font-bold text-slate-800">Contact & Submit</span>
              </div>
            </div>

            {/* STEP 1: SERVICES */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Select Required Engineering Services</h4>
                  <p className="text-xs text-slate-500">You can select multiple systems for integrated turnkey deployment.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map(s => {
                    const Icon = s.icon;
                    const isSelected = selectedServices.includes(s.name);
                    return (
                      <div
                        key={s.name}
                        id={`quote-service-card-${s.name.replace(/[^a-zA-Z]/g, '')}`}
                        onClick={() => toggleService(s.name)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                          isSelected
                            ? 'border-[#1F6FEB] bg-blue-50/50 shadow-xs ring-1 ring-[#1F6FEB]/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#1F6FEB] text-white' : 'bg-slate-100 text-slate-700'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900">{s.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{s.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    id="btn-quote-step1-next"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <span>Next: Project Scope</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PROJECT SCOPE & PROPERTY TYPE */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Property Type & Specifications</h4>
                  <p className="text-xs text-slate-500">Provide details about your facility and requirements.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'INSTITUTIONAL'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      id={`btn-prop-type-${type.toLowerCase()}`}
                      onClick={() => setPropertyType(type)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                        propertyType === type
                          ? 'border-[#1F6FEB] bg-[#1F6FEB] text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Describe Project Requirements / Scope of Work *
                  </label>
                  <textarea
                    id="quote-input-description"
                    rows={4}
                    value={projectDescription}
                    onChange={e => setProjectDescription(e.target.value)}
                    placeholder="E.g., We need 16 IP cameras with NVR, Cat6 structured cabling for 24 workstations, and backup power distribution board setup for a 3-floor commercial office."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Budget Range</label>
                    <select
                      id="quote-select-budget"
                      value={estimatedBudget}
                      onChange={e => setEstimatedBudget(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                    >
                      <option value="Under 50,000 ETB">Under 50,000 ETB</option>
                      <option value="50,000 - 150,000 ETB">50,000 - 150,000 ETB</option>
                      <option value="150,000 - 500,000 ETB">150,000 - 500,000 ETB</option>
                      <option value="500,000 - 2,000,000 ETB">500,000 - 2,000,000 ETB</option>
                      <option value="Above 2,000,000 ETB">Above 2,000,000 ETB</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Start Date</label>
                    <input
                      id="quote-input-date"
                      type="date"
                      value={preferredDate}
                      onChange={e => setPreferredDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    id="btn-quote-step2-next"
                    onClick={() => {
                      if (!projectDescription) {
                        showToast('Scope Required', 'Please enter a brief project description.', 'WARNING');
                        return;
                      }
                      setStep(3);
                    }}
                    className="px-6 py-2.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <span>Next: Contact Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT & SUBMIT */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Your Contact & Site Location</h4>
                  <p className="text-xs text-slate-500">Our engineering estimator will send the itemized proposal to this contact.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Company Name *</label>
                    <input
                      id="quote-input-name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Horizon Real Estate PLC"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      id="quote-input-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. procurement@horizon-et.com"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      id="quote-input-phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+251 911 234 567"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Site Location / City *</label>
                    <input
                      id="quote-input-location"
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Bole Medhanialem, Addis Ababa"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes / Access Instructions</label>
                  <input
                    id="quote-input-notes"
                    type="text"
                    value={customerNotes}
                    onChange={e => setCustomerNotes(e.target.value)}
                    placeholder="e.g. Site visits possible on weekday mornings after 10 AM."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                  />
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    type="submit"
                    id="btn-submit-quotation-final"
                    disabled={loading}
                    className="px-6 py-3 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-95"
                  >
                    {loading ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Quotation Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

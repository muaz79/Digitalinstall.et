import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext.js';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ChevronRight, MessageSquare, Shield } from 'lucide-react';

interface ContactPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const { showToast } = useNotification();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+251 9');
  const [subject, setSubject] = useState('General Engineering Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      showToast('Missing Fields', 'Please complete all required fields.', 'WARNING');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setSent(true);
      showToast('Message Sent', 'Thank you! An engineer will contact you shortly.', 'SUCCESS');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      showToast('Error', err.message, 'ALERT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-page" className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-[#07111F] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F6FEB] font-bold">Contact Headquarters</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1F6FEB] text-white">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">Addis Ababa Headquarters</span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Contact & Engineering Dispatch
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Reach our central engineering offices on Bole Road for project consultations, site surveys, wholesale hardware orders, and 24/7 emergency response.
          </p>
        </div>
      </section>

      {/* Main Form & Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & Office Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Head Office Coordinates</h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#1F6FEB] flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Physical Location:</strong>
                    <span>Bole Road, Mega Building 4th Floor, Suite 408</span>
                    <span className="block text-slate-500">Addis Ababa, Ethiopia</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Phone & Emergency Hotline:</strong>
                    <a href="tel:+251902329715" className="text-[#1F6FEB] font-bold block">+251 902329715</a>
                    <a href="tel:+25941365596" className="text-slate-700 block">+251 941365596 (Landline)</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Official Inquiries:</strong>
                    <a href="mailto:info@digitalinstall.et" className="text-[#1F6FEB] block">info@digitalinstall.et</a>
                    <a href="mailto:support@digitalinstall.et" className="text-slate-700 block">support@digitalinstall.et</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Working Hours:</strong>
                    <span>Monday – Friday: 8:30 AM – 6:00 PM</span>
                    <span className="block">Saturday: 8:30 AM – 1:00 PM</span>
                    <span className="block text-emerald-700 font-bold mt-1">24/7 Emergency Support for Contract Clients</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Quotation Card */}
            <div className="bg-[#07111F] text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800 shadow-xl">
              <h4 className="text-base font-bold text-white">Need a Formal Project Estimate?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use our automated quotation estimator to customize single-line electrical schedules, CCTV camera counts, and server racks.
              </p>
              <button
                onClick={() => onOpenQuoteModal()}
                className="w-full py-3 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <span>Launch Quotation Wizard</span>
              </button>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">Send Direct Dispatch</span>
                <h3 className="text-xl font-bold text-slate-900">Engineering Consultation Request</h3>
                <p className="text-xs text-slate-500">
                  Fill in your details and requirements. Our engineering manager will reply within 4 business hours.
                </p>
              </div>

              {sent ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-950">Thank You! Your Request Has Been Dispatched.</h4>
                  <p className="text-xs text-emerald-800">
                    A technical specialist will review your specifications and reach out via phone/email.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="px-5 py-2.5 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Abebe Balcha"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone Number (Ethiopia) *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+251 9..."
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Subject / Area of Interest</label>
                      <select
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                      >
                        <option value="General Engineering Inquiry">General Engineering Inquiry</option>
                        <option value="Electrical Installation Project">Electrical Installation Project</option>
                        <option value="CCTV & Security System">CCTV & Security System</option>
                        <option value="Fiber / Network Infrastructure">Fiber / Network Infrastructure</option>
                        <option value="Smart Home Automation">Smart Home Automation</option>
                        <option value="Annual Maintenance Contract (AMC)">Annual Maintenance Contract (AMC)</option>
                        <option value="Hardware Procurement / Wholesale">Hardware Procurement / Wholesale</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Message & Requirements Details *</label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Please describe your facility type, location in Addis Ababa / regional city, and any specific technical requirements..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    id="btn-contact-submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Transmitting Message...' : 'Send Message to Engineering Desk'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

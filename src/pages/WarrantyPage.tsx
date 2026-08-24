import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNotification } from '../context/NotificationContext.js';
import { ShieldCheck, Search, CheckCircle2, AlertCircle, FileText, Wrench, Clock, Shield, ChevronRight } from 'lucide-react';
import { DocumentViewerModal } from '../components/public/DocumentViewerModal.js';

interface WarrantyPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const WarrantyPage: React.FC<WarrantyPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  // Claim Form State
  const [claimWarrantyId, setClaimWarrantyId] = useState('');
  const [claimIssue, setClaimIssue] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certWarrantyId, setCertWarrantyId] = useState('');

  // Handle URL query params (e.g. from homepage lookup)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      setSearchQuery(q);
      handleSearch(q);
    }
  }, []);

  const handleSearch = async (queryVal = searchQuery) => {
    if (!queryVal.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/warranties/verify?query=${encodeURIComponent(queryVal.trim())}`);
      const data = await res.json();
      if (res.ok && data.found) {
        setVerificationResult(data.warranty);
        setClaimWarrantyId(data.warranty.warrantyNumber);
      } else {
        setVerificationResult(null);
      }
    } catch (e) {
      setVerificationResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Sign In Required', 'Please sign in to file an official warranty claim.', 'INFO');
      navigate('/login');
      return;
    }

    if (!claimWarrantyId || !claimIssue) {
      showToast('Missing Info', 'Please provide warranty number and issue description.', 'WARNING');
      return;
    }

    setClaimSubmitting(true);
    try {
      const res = await fetch('/api/warranties/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warrantyId: claimWarrantyId,
          issueDescription: claimIssue
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit claim');

      setClaimSuccess(data.claim.claimNumber);
      showToast('Claim Filed', `Claim ${data.claim.claimNumber} registered. Our tech team will contact you.`, 'SUCCESS');
      setClaimIssue('');
    } catch (err: any) {
      showToast('Claim Error', err.message, 'ALERT');
    } finally {
      setClaimSubmitting(false);
    }
  };

  return (
    <div id="warranty-page" className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-[#07111F] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F6FEB] font-bold">Warranty & Assurance</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1F6FEB] text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">Quality Guarantee</span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Warranty Verification & Support Desk
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Every installation and equipment supplied by DIGITAL INSTALL includes verifiable digital warranty certificates, on-site technician response SLAs, and genuine replacement coverage.
          </p>
        </div>
      </section>

      {/* Main Verification & Claim Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Certificate Search & Live Verification Result */}
          <div className="lg:col-span-7 space-y-6">
            {/* Search Box */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Verify Certificate or Serial Number</h3>
                <p className="text-xs text-slate-500">
                  Search by Certificate Reference (e.g. <span className="font-mono font-bold text-slate-800">DI-WR-2026-00412</span>) or Serial (e.g. <span className="font-mono font-bold text-slate-800">SN-HIK-4K-9921</span>).
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter Certificate or Hardware Serial Number..."
                  className="flex-1 p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                />
                <button
                  id="btn-search-warranty"
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="px-6 py-3 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </div>
            </div>

            {/* Verification Result Card */}
            {loading ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
                <div className="w-6 h-6 border-2 border-[#1F6FEB] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Querying official Ethiopian engineering registry...
              </div>
            ) : searched && !verificationResult ? (
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
                <h4 className="text-sm font-bold text-rose-950">No Active Warranty Record Found</h4>
                <p className="text-xs text-rose-800 max-w-md mx-auto">
                  We could not find an issued warranty certificate matching '{searchQuery}'. Please double check the certificate number or reach out to our support desk.
                </p>
              </div>
            ) : verificationResult ? (
              <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        Official Verified Certificate
                      </span>
                      <h4 className="text-lg font-black text-slate-900 font-mono">
                        {verificationResult.warrantyNumber}
                      </h4>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                    {verificationResult.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 font-medium">Customer / Estate:</span>
                    <div className="font-bold text-slate-900">{verificationResult.customerName}</div>

                    <div className="mt-2 text-slate-500 font-medium">Associated Project:</div>
                    <div className="font-bold text-slate-900">{verificationResult.projectName}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 font-medium">Days Remaining:</span>
                    <div className="text-base font-black text-emerald-700 font-mono">
                      {verificationResult.daysRemaining} Days
                    </div>

                    <div className="mt-2 text-slate-500 font-medium">Serial No:</div>
                    <div className="font-mono text-slate-800">{verificationResult.serialNumber}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-900 block">Coverage Entitlements:</span>
                  <p>{verificationResult.coverageDetails}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setCertWarrantyId(verificationResult.warrantyNumber);
                      setCertModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#1F6FEB] hover:underline flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View & Print Official PDF Certificate</span>
                  </button>

                  <button
                    onClick={() => setClaimWarrantyId(verificationResult.warrantyNumber)}
                    className="px-4 py-2 bg-[#07111F] text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition-colors"
                  >
                    File Claim for this Record
                  </button>
                </div>
              </div>
            ) : null}

            {/* SLA Entitlements Box */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Standard DIGITAL INSTALL Warranty SLAs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <Clock className="w-4 h-4 text-[#1F6FEB]" />
                  <div className="font-bold text-slate-900">2-Hour SLA</div>
                  <div className="text-[11px] text-slate-500">Emergency breakdown response in Addis Ababa.</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  <div className="font-bold text-slate-900">Free Replacement</div>
                  <div className="text-[11px] text-slate-500">Immediate swap of defective hardware units.</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <div className="font-bold text-slate-900">24-Month Coverage</div>
                  <div className="text-[11px] text-slate-500">Workmanship & material defect guarantee.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: File a Warranty Claim / Service Request */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Fast Resolution Desk
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Submit a Warranty Claim</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Experiencing an equipment glitch or power irregularity? Our field engineering team will dispatch a specialist.
                </p>
              </div>

              {claimSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-950">Claim Successfully Registered!</h4>
                  <p className="text-xs text-emerald-800">
                    Claim Ref: <span className="font-mono font-bold">{claimSuccess}</span>. A technician has been assigned and will contact your site.
                  </p>
                  <button
                    onClick={() => setClaimSuccess(null)}
                    className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    File Another Claim
                  </button>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Warranty Certificate / Serial Number *
                    </label>
                    <input
                      type="text"
                      value={claimWarrantyId}
                      onChange={e => setClaimWarrantyId(e.target.value)}
                      placeholder="e.g. DI-WR-2026-00412"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Describe the Malfunction or Glitch *
                    </label>
                    <textarea
                      rows={4}
                      value={claimIssue}
                      onChange={e => setClaimIssue(e.target.value)}
                      placeholder="Describe what occurred (e.g., Camera 4 is showing no signal after power cut, or breaker #3 in main panel tripped)."
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    id="btn-submit-warranty-claim"
                    disabled={claimSubmitting}
                    className="w-full py-3.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {claimSubmitting ? 'Registering Claim...' : 'Submit Claim to Engineering Desk'}
                  </button>

                  {!user && (
                    <p className="text-[11px] text-slate-500 text-center">
                      Note: You will be prompted to sign in or create a customer profile to track technician updates.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {certModalOpen && (
        <DocumentViewerModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          type="WARRANTY_CERTIFICATE"
          dataId={certWarrantyId}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, FileText, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { Quote, Order, Warranty, Project, CompanySettings } from '../../types/database.js';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'QUOTATION' | 'TAX_INVOICE' | 'WARRANTY_CERTIFICATE' | 'PROJECT_HANDOVER';
  dataId: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  type,
  dataId
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docData, setDocData] = useState<any>(null);

  useEffect(() => {
    if (!isOpen || !dataId) return;

    const fetchDoc = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = '';
        if (type === 'QUOTATION') endpoint = `/api/documents/quote/${dataId}`;
        if (type === 'TAX_INVOICE') endpoint = `/api/documents/order/${dataId}`;
        if (type === 'WARRANTY_CERTIFICATE') endpoint = `/api/documents/warranty/${dataId}`;
        if (type === 'PROJECT_HANDOVER') endpoint = `/api/documents/project/${dataId}`;

        const res = await fetch(endpoint);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load document');
        setDocData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [isOpen, type, dataId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const company: CompanySettings = docData?.company || {
    companyName: 'DIGITAL INSTALL',
    tagline: 'Engineering & Technology Solutions',
    phone: '+251 902329715',
    email: 'info@digitalinstall-et.com',
    tinNumber: '0098472911',
    vatNumber: 'ET-VAT-2026-991',
    address: 'Africa Avenue, Chiro Sub-City, OROMIA, Ethiopia'
  };

  return (
    <div id="document-viewer-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-[#07111F] text-white px-6 py-4 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#1F6FEB]" />
            <span className="text-sm font-bold tracking-wide">
              {type === 'QUOTATION' && 'Official Engineering Quotation'}
              {type === 'TAX_INVOICE' && 'Official Tax Invoice / Order Receipt'}
              {type === 'WARRANTY_CERTIFICATE' && 'Turnkey Equipment & Installation Warranty Certificate'}
              {type === 'PROJECT_HANDOVER' && 'Project Handover & Commissioning Report'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-print-doc"
              onClick={handlePrint}
              className="px-4 py-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              id="btn-close-doc"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 bg-slate-100/60 print:bg-white print:p-0">
          {loading ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              <div className="w-8 h-8 border-3 border-[#1F6FEB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Generating secure document certificate...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-rose-600 text-sm font-medium">
              Error: {error}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto bg-white border border-slate-300 p-8 sm:p-12 shadow-md rounded-xl print:border-none print:shadow-none print:p-4 text-slate-900 font-sans">
              {/* Header Letterhead */}
              <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-4">
                <div>
                  <div className="text-2xl font-black tracking-tight text-[#07111F]">
                    DIGITAL <span className="text-[#1F6FEB]">INSTALL</span>
                  </div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                    Engineering & Technology Solutions
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
                    <div>{company.address}</div>
                    <div>Tel: {company.primaryPhone || '+251902329715'} | Email: {company.email || 'info@digitalinstall.et'}</div>
                    <div>TIN: {company.tinNumber || '0098472911'} | License: {company.licenseNumber || 'ENG-AA-2026-8849'}</div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800">
                    {type.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* TYPE 1: QUOTATION */}
              {type === 'QUOTATION' && docData.quote && (
                <div className="mt-8 space-y-6">
                  {/* Metadata block */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Quotation Ref:</span>
                      <div className="font-mono font-bold text-[#1F6FEB] text-sm">{docData.quote.quoteNumber}</div>
                      <div className="mt-2 text-slate-500 font-medium">Customer:</div>
                      <div className="font-bold text-slate-900">{docData.quote.customerName}</div>
                      <div className="text-slate-600">{docData.quote.customerLocation}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 font-medium">Status:</span>
                      <div className="font-bold text-slate-900">{docData.quote.status}</div>
                      <div className="mt-2 text-slate-500 font-medium">Valid Until:</div>
                      <div className="font-semibold text-slate-800">
                        {docData.quote.validUntil
                          ? new Date(docData.quote.validUntil).toLocaleDateString()
                          : '30 Days from Issue'}
                      </div>
                    </div>
                  </div>

                  {/* Scope description */}
                  <div>
                    <h5 className="text-xs font-bold uppercase text-slate-600 tracking-wider mb-1">Scope of Works</h5>
                    <p className="text-xs text-slate-700 bg-slate-50/50 p-3 rounded-lg border border-slate-200">
                      {docData.quote.projectDescription}
                    </p>
                  </div>

                  {/* Itemized Line Items Table */}
                  <div>
                    <h5 className="text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">Itemized Bill of Quantities (BOQ)</h5>
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-y-2 border-slate-800 bg-slate-100 font-bold text-slate-900">
                          <th className="py-2 px-2">#</th>
                          <th className="py-2 px-2">Description / Specifications</th>
                          <th className="py-2 px-2">Type</th>
                          <th className="py-2 px-2 text-center">Qty</th>
                          <th className="py-2 px-2 text-right">Unit Price (ETB)</th>
                          <th className="py-2 px-2 text-right">Total (ETB)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {docData.quote.items?.map((item: any, idx: number) => (
                          <tr key={item.id || idx}>
                            <td className="py-2 px-2 font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-2 px-2 font-medium text-slate-800">{item.description}</td>
                            <td className="py-2 px-2 text-slate-500">{item.type}</td>
                            <td className="py-2 px-2 text-center font-mono">{item.quantity} {item.unit || 'unit'}</td>
                            <td className="py-2 px-2 text-right font-mono">{item.unitPrice.toLocaleString()}</td>
                            <td className="py-2 px-2 text-right font-mono font-bold">{item.totalPrice.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end pt-4">
                    <div className="w-64 space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-mono font-semibold">ETB {docData.quote.subtotal?.toLocaleString()}</span>
                      </div>
                      {docData.quote.discount > 0 && (
                        <div className="flex justify-between py-1 text-emerald-700 border-b border-slate-200">
                          <span>Discount Applied:</span>
                          <span className="font-mono font-semibold">- ETB {docData.quote.discount?.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">VAT (15%):</span>
                        <span className="font-mono font-semibold">ETB {docData.quote.taxAmount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t-2 border-slate-900 font-bold text-sm text-slate-950">
                        <span>Total (ETB):</span>
                        <span className="font-mono text-[#1F6FEB]">ETB {docData.quote.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TYPE 2: TAX INVOICE */}
              {type === 'TAX_INVOICE' && docData.order && (
                <div className="mt-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Invoice No:</span>
                      <div className="font-mono font-bold text-[#1F6FEB] text-sm">{docData.order.orderNumber}</div>
                      <div className="mt-2 text-slate-500 font-medium">Billed To:</div>
                      <div className="font-bold text-slate-900">{docData.order.customerName}</div>
                      <div className="text-slate-600">{docData.order.shippingAddress}, {docData.order.city}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 font-medium">Payment Method:</span>
                      <div className="font-bold text-slate-900">{docData.order.paymentMethod}</div>
                      <div className="mt-2 text-slate-500 font-medium">Payment Status:</div>
                      <div className="font-semibold text-emerald-700">{docData.order.paymentStatus}</div>
                    </div>
                  </div>

                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-y-2 border-slate-800 bg-slate-100 font-bold text-slate-900">
                        <th className="py-2 px-2">Item Description</th>
                        <th className="py-2 px-2">SKU</th>
                        <th className="py-2 px-2 text-center">Qty</th>
                        <th className="py-2 px-2 text-right">Unit Price (ETB)</th>
                        <th className="py-2 px-2 text-right">Total (ETB)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {docData.order.items?.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-2 px-2 font-medium text-slate-800">{item.productName}</td>
                          <td className="py-2 px-2 font-mono text-slate-500">{item.sku}</td>
                          <td className="py-2 px-2 text-center font-mono">{item.quantity}</td>
                          <td className="py-2 px-2 text-right font-mono">{item.price.toLocaleString()}</td>
                          <td className="py-2 px-2 text-right font-mono font-bold">{item.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-end pt-4">
                    <div className="w-64 space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-mono">ETB {docData.order.subtotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">VAT (15%):</span>
                        <span className="font-mono">ETB {docData.order.taxAmount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">Delivery Fee:</span>
                        <span className="font-mono">ETB {docData.order.deliveryFee?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t-2 border-slate-900 font-bold text-sm">
                        <span>Total Paid (ETB):</span>
                        <span className="font-mono text-[#1F6FEB]">ETB {docData.order.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TYPE 3: WARRANTY CERTIFICATE */}
              {type === 'WARRANTY_CERTIFICATE' && docData.warranty && (
                <div className="mt-8 space-y-6 border-2 border-dashed border-[#1F6FEB]/40 p-6 rounded-2xl bg-blue-50/20">
                  <div className="text-center space-y-1">
                    <ShieldCheck className="w-12 h-12 text-[#1F6FEB] mx-auto" />
                    <h3 className="text-xl font-black uppercase tracking-wider text-[#07111F]">
                      Official Certificate of Warranty & Assurance
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Certificate No: {docData.warranty.warrantyNumber}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Issued To:</span>
                      <div className="font-bold text-slate-900 text-sm">{docData.warranty.customerName}</div>
                      <div className="text-slate-600">{docData.warranty.customerEmail}</div>

                      <div className="mt-3 text-slate-500 font-medium">Project / Installation:</div>
                      <div className="font-bold text-slate-900">{docData.warranty.projectName}</div>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-slate-500 font-medium">Serial Number:</span>
                      <div className="font-mono font-bold text-slate-900">{docData.warranty.serialNumber}</div>

                      <div className="mt-3 text-slate-500 font-medium">Warranty Period:</div>
                      <div className="font-semibold text-emerald-700">
                        {new Date(docData.warranty.startDate).toLocaleDateString()} — {new Date(docData.warranty.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <h5 className="font-bold text-slate-900 uppercase tracking-wide">Coverage & Guarantee Terms</h5>
                    <p className="text-slate-600 leading-relaxed">{docData.warranty.coverageDetails}</p>
                    <p className="text-[11px] text-slate-500 italic">
                      Includes on-site technician response, defective component replacements, and preventative quarterly calibrations in accordance with IEC engineering standards.
                    </p>
                  </div>
                </div>
              )}

              {/* Signatures & Seal */}
              <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-600">
                <div>
                  <div className="h-10 border-b border-slate-400 w-48 mb-2 flex items-end">
                    <span className="font-script text-lg text-slate-700 italic">Yohannes G.</span>
                  </div>
                  <div className="font-bold text-slate-900">Authorized Engineering Signatory</div>
                  <div>DIGITAL INSTALL PLC</div>
                </div>

                <div className="text-right">
                  <div className="inline-block border-2 border-emerald-600 rounded-lg p-2 text-emerald-800 font-mono text-[10px] uppercase font-bold text-center tracking-wider bg-emerald-50/50">
                    <div>DIGITAL INSTALL PLC</div>
                    <div>SEAL OF VERIFIED ENGINEERING</div>
                    <div>★ ADDIS ABABA ★</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

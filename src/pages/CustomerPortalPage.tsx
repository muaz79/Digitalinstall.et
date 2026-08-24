import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNotification } from '../context/NotificationContext.js';
import { Quote, Project, Order, Warranty, SupportTicket } from '../types/database.js';
import {
  User,
  FileText,
  Building,
  ShoppingBag,
  ShieldCheck,
  LifeBuoy,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Send,
  Eye,
  ChevronRight,
  Download,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';
import { DocumentViewerModal } from '../components/public/DocumentViewerModal.js';

interface CustomerPortalPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const CustomerPortalPage: React.FC<CustomerPortalPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const { user, token } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'quotes' | 'projects' | 'orders' | 'warranties' | 'tickets'>('quotes');

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals for PDF Viewer
  const [viewerType, setViewerType] = useState<any>(null);
  const [viewerId, setViewerId] = useState<string | null>(null);

  // New Ticket State
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState<'ELECTRICAL' | 'CCTV' | 'NETWORKING' | 'SMART_HOME' | 'GENERAL'>('ELECTRICAL');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketSubmitting, setTicketSubmitting] = useState(false);

  // Ticket Message Reply State
  const [replyMessage, setReplyMessage] = useState('');
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);

  // Check URL query param for default tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['quotes', 'projects', 'orders', 'warranties', 'tickets'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, []);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [qRes, pRes, oRes, wRes, tRes] = await Promise.all([
        fetch('/api/quotes/my-quotes', { headers }),
        fetch('/api/projects', { headers }),
        fetch('/api/orders/my-orders', { headers }),
        fetch('/api/warranties/my-warranties', { headers }),
        fetch('/api/tickets/my-tickets', { headers })
      ]);

      const [qData, pData, oData, wData, tData] = await Promise.all([
        qRes.json(),
        pRes.json(),
        oRes.json(),
        wRes.json(),
        tRes.json()
      ]);

      setQuotes(qData.quotes || []);
      setProjects(pData.projects || []);
      setOrders(oData.orders || []);
      setWarranties(wData.warranties || []);
      setTickets(tData.tickets || []);
    } catch (e) {
      console.error('Failed to load user portal data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleQuoteAction = async (quoteId: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/quotes/${quoteId}/customer-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update quote status');

      showToast('Status Updated', `Quote marked as ${action}.`, 'SUCCESS');
      fetchData();
    } catch (err: any) {
      showToast('Error', err.message, 'ALERT');
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketMessage) return;

    setTicketSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: newTicketSubject,
          category: newTicketCategory,
          message: newTicketMessage
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create ticket');

      showToast('Ticket Opened', `Support Ticket ${data.ticket.ticketNumber} created.`, 'SUCCESS');
      setTicketModalOpen(false);
      setNewTicketSubject('');
      setNewTicketMessage('');
      fetchData();
    } catch (err: any) {
      showToast('Error', err.message, 'ALERT');
    } finally {
      setTicketSubmitting(false);
    }
  };

  const handleSendTicketReply = async (ticketId: string) => {
    if (!replyMessage.trim()) return;

    try {
      const res = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: replyMessage })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post message');

      setReplyMessage('');
      showToast('Message Sent', 'Your update was posted to the engineering ticket.', 'SUCCESS');
      setActiveTicket(data.ticket);
      fetchData();
    } catch (err: any) {
      showToast('Error', err.message, 'ALERT');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-md">
        <User className="w-12 h-12 text-[#1F6FEB] mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Sign In to Access Customer Portal</h2>
        <p className="text-xs text-slate-500">
          Review your project quotations, milestones, equipment invoices, and open support tickets.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          Sign In / Demo Login
        </button>
      </div>
    );
  }

  return (
    <div id="customer-portal-page" className="space-y-8 pb-20">
      {/* Portal Header */}
      <section className="bg-[#07111F] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-slate-300">Customer Engineering Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-slate-400">
              {user.email} • {user.role} Account • {user.phone || '+251 911 223 344'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-4 py-2.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Quotation</span>
            </button>
            <button
              onClick={() => setTicketModalOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <LifeBuoy className="w-4 h-4 text-emerald-400" />
              <span>Open Support Ticket</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tabs Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { key: 'quotes', label: `My Quotations (${quotes.length})`, icon: FileText },
            { key: 'projects', label: `Active Projects (${projects.length})`, icon: Building },
            { key: 'orders', label: `Equipment Orders (${orders.length})`, icon: ShoppingBag },
            { key: 'warranties', label: `Warranties (${warranties.length})`, icon: ShieldCheck },
            { key: 'tickets', label: `Support Tickets (${tickets.length})`, icon: LifeBuoy }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
                  activeTab === t.key
                    ? 'bg-[#07111F] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Quotes */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            {quotes.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Quotations Requested Yet</h3>
                <p className="text-xs text-slate-500">Submit your electrical or CCTV requirements to receive an official estimate.</p>
                <button
                  onClick={() => onOpenQuoteModal()}
                  className="px-4 py-2 bg-[#1F6FEB] text-white text-xs font-bold rounded-xl"
                >
                  Request Quotation Now
                </button>
              </div>
            ) : (
              quotes.map(q => {
                const isPrepared = q.status === 'PREPARED' || q.status === 'SENT_TO_CUSTOMER';
                const isApproved = q.status === 'APPROVED';
                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#1F6FEB] bg-blue-50 px-2 py-0.5 rounded-md">
                            {q.quoteNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{q.serviceType}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Location: {q.siteLocation}, {q.city} • Requested: {new Date(q.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isPrepared
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                    </div>

                    {/* Scope & Line Items */}
                    <div className="text-xs text-slate-600 space-y-2">
                      <p><strong>Description:</strong> {q.description}</p>
                      {q.lineItems && q.lineItems.length > 0 && (
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                            Itemized BOQ Schedule:
                          </div>
                          {q.lineItems.map((li, idx) => (
                            <div key={idx} className="flex justify-between text-[11px] text-slate-700">
                              <span>{li.quantity}x {li.description}</span>
                              <span className="font-mono font-bold">ETB {li.totalAmount?.toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                            <span>Official Estimate Total:</span>
                            <span className="font-mono text-[#1F6FEB]">ETB {q.estimatedTotal?.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setViewerType('QUOTATION_PROFORMA');
                          setViewerId(q.id);
                        }}
                        className="text-xs font-bold text-[#1F6FEB] hover:underline flex items-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Official PDF Proforma</span>
                      </button>

                      {isPrepared && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuoteAction(q.id, 'APPROVED')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Approve & Launch Project</span>
                          </button>
                          <button
                            onClick={() => handleQuoteAction(q.id, 'REJECTED')}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {projects.map(p => (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1F6FEB] bg-blue-50 px-2 py-0.5 rounded-md">
                        {p.projectNumber}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{p.location} • Stage: {p.status}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1F6FEB] font-mono">{p.progressPercentage}% Complete</span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1F6FEB] to-emerald-500"
                    style={{ width: `${p.progressPercentage}%` }}
                  />
                </div>

                {/* Milestones list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 text-xs">
                  {p.milestones.map((m, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border ${
                        m.status === 'COMPLETED'
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold ring-1 ring-[#1F6FEB]/20'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {m.status === 'COMPLETED' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span className="truncate">{m.title}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {p.status === 'COMPLETED' && (
                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => {
                        setViewerType('PROJECT_HANDOVER');
                        setViewerId(p.id);
                      }}
                      className="text-xs font-bold text-[#1F6FEB] hover:underline flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download Signed Handover Certificate</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Equipment Orders Placed</h3>
                <p className="text-xs text-slate-500">Visit our store to purchase certified hardware with genuine warranties.</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-4 py-2 bg-[#1F6FEB] text-white text-xs font-bold rounded-xl"
                >
                  Browse Store
                </button>
              </div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1F6FEB] bg-blue-50 px-2 py-0.5 rounded-md">
                          {o.orderNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{o.paymentMethod}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Date: {new Date(o.createdAt).toLocaleDateString()} • Shipping to: {o.shippingAddress}, {o.city}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {o.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-700">{item.quantity}x {item.productName} ({item.brand})</span>
                        <span className="font-mono font-bold text-slate-900">ETB {item.totalPrice?.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-sm text-slate-950 pt-2">
                      <span>Total (Incl. 15% VAT):</span>
                      <span className="font-mono text-[#1F6FEB]">ETB {o.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => {
                        setViewerType('TAX_INVOICE');
                        setViewerId(o.id);
                      }}
                      className="text-xs font-bold text-[#1F6FEB] hover:underline flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View & Print Official Tax Invoice</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Warranties */}
        {activeTab === 'warranties' && (
          <div className="space-y-4">
            {warranties.map(w => (
              <div key={w.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900">{w.warrantyNumber}</span>
                      <div className="text-[11px] text-slate-500">Project: {w.projectName}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {w.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-slate-500">Hardware / Serial:</span>
                    <div className="font-mono font-bold text-slate-900">{w.serialNumber}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Coverage Duration:</span>
                    <div className="font-bold text-slate-900">{w.durationMonths} Months</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => {
                      setViewerType('WARRANTY_CERTIFICATE');
                      setViewerId(w.warrantyNumber);
                    }}
                    className="text-xs font-bold text-[#1F6FEB] hover:underline flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Official Certificate</span>
                  </button>

                  <button
                    onClick={() => navigate(`/warranty-support?q=${w.warrantyNumber}`)}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    File Claim
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Support Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Engineering Tickets & Inquiries</h3>
              <button
                onClick={() => setTicketModalOpen(true)}
                className="px-4 py-2 bg-[#1F6FEB] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Ticket</span>
              </button>
            </div>

            {tickets.map(t => (
              <div key={t.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1F6FEB] bg-blue-50 px-2 py-0.5 rounded-md">
                        {t.ticketNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{t.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{t.subject}</h4>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    t.status === 'RESOLVED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : t.status === 'IN_PROGRESS'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {t.status}
                  </span>
                </div>

                {/* Messages Thread */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl max-h-64 overflow-y-auto">
                  {t.messages.map(m => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        m.senderRole === 'CUSTOMER'
                          ? 'bg-blue-50 border border-blue-100 ml-6 text-slate-800'
                          : 'bg-white border border-slate-200 mr-6 text-slate-900 shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                        <span>{m.senderName} ({m.senderRole})</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed">{m.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={activeTicket?.id === t.id ? replyMessage : ''}
                    onFocus={() => setActiveTicket(t)}
                    onChange={e => {
                      setActiveTicket(t);
                      setReplyMessage(e.target.value);
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleSendTicketReply(t.id)}
                    placeholder="Type an update or reply to assigned technician..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                  />
                  <button
                    onClick={() => handleSendTicketReply(t.id)}
                    className="px-4 py-2.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Open Engineering Support Ticket</h3>
              <button onClick={() => setTicketModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={newTicketCategory}
                  onChange={e => setNewTicketCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="ELECTRICAL">Electrical & Power System</option>
                  <option value="CCTV">CCTV & Camera Feeds</option>
                  <option value="NETWORKING">Fiber & Wi-Fi Network</option>
                  <option value="SMART_HOME">Smart Touch Panel / Automation</option>
                  <option value="GENERAL">General Maintenance SLA</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Problem Title *</label>
                <input
                  type="text"
                  value={newTicketSubject}
                  onChange={e => setNewTicketSubject(e.target.value)}
                  placeholder="e.g. UPS battery alert in 2nd Floor Server Rack"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Technical Explanation *</label>
                <textarea
                  rows={4}
                  value={newTicketMessage}
                  onChange={e => setNewTicketMessage(e.target.value)}
                  placeholder="Explain the symptom, when it started, and affected floor/rooms..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ticketSubmitting}
                  className="px-6 py-2.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {ticketSubmitting ? 'Opening Ticket...' : 'Dispatch Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Document Viewer Modal */}
      {viewerType && viewerId && (
        <DocumentViewerModal
          isOpen={!!viewerType}
          onClose={() => {
            setViewerType(null);
            setViewerId(null);
          }}
          type={viewerType}
          dataId={viewerId}
        />
      )}
    </div>
  );
};

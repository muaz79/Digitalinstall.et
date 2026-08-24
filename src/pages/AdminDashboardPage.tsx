import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNotification } from '../context/NotificationContext.js';
import { Quote, Project, Order, Product, Warranty, SupportTicket, AuditLog } from '../types/database.js';
import {
  BarChart3,
  FileText,
  Building,
  ShoppingBag,
  ShieldCheck,
  LifeBuoy,
  Users,
  Settings,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Package,
  Wrench,
  Search,
  Eye,
  Send,
  Trash2,
  Edit,
  Shield,
  Layers,
  FileCheck
} from 'lucide-react';
import { DocumentViewerModal } from '../components/public/DocumentViewerModal.js';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { user, token } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'quotes' | 'projects' | 'inventory' | 'orders' | 'warranties' | 'tickets' | 'audit' | 'settings'
  >('overview');

  const [metrics, setMetrics] = useState<any>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // PDF Viewer Modal State
  const [viewerType, setViewerType] = useState<any>(null);
  const [viewerId, setViewerId] = useState<string | null>(null);

  // Line Item Editor State for Quotes
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [lineItemDesc, setLineItemDesc] = useState('');
  const [lineItemQty, setLineItemQty] = useState(1);
  const [lineItemUnit, setLineItemUnit] = useState('Pcs');
  const [lineItemPrice, setLineItemPrice] = useState(1000);

  // New Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'electrical' | 'cctv' | 'networking' | 'smart-home' | 'cables'>('electrical');
  const [newProdBrand, setNewProdBrand] = useState('Schneider Electric');
  const [newProdPrice, setNewProdPrice] = useState(4500);
  const [newProdStock, setNewProdStock] = useState(25);
  const [newProdDesc, setNewProdDesc] = useState('');

  // Ticket Response State
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [adminTicketReply, setAdminTicketReply] = useState('');

  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [mRes, qRes, pRes, oRes, prodRes, wRes, tRes, aRes] = await Promise.all([
        fetch('/api/admin/metrics', { headers }),
        fetch('/api/quotes', { headers }),
        fetch('/api/projects', { headers }),
        fetch('/api/orders', { headers }),
        fetch('/api/products?all=true', { headers }),
        fetch('/api/warranties/my-warranties', { headers }),
        fetch('/api/tickets', { headers }),
        fetch('/api/admin/audit-logs', { headers })
      ]);

      const [mData, qData, pData, oData, prodData, wData, tData, aData] = await Promise.all([
        mRes.json(),
        qRes.json(),
        pRes.json(),
        oRes.json(),
        prodRes.json(),
        wRes.json(),
        tRes.json(),
        aRes.json()
      ]);

      setMetrics(mData.metrics);
      setQuotes(qData.quotes || []);
      setProjects(pData.projects || []);
      setOrders(oData.orders || []);
      setProducts(prodData.products || []);
      setWarranties(wData.warranties || []);
      setTickets(tData.tickets || []);
      setAuditLogs(aData.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  // Quote Management Actions
  const handleAddLineItem = () => {
    if (!editingQuote || !lineItemDesc) return;
    const newItem = {
      description: lineItemDesc,
      quantity: lineItemQty,
      unit: lineItemUnit,
      unitPrice: lineItemPrice,
      totalAmount: lineItemQty * lineItemPrice
    };
    const updatedLineItems = [...(editingQuote.lineItems || []), newItem];
    const newTotal = updatedLineItems.reduce((sum, item) => sum + item.totalAmount, 0);

    setEditingQuote({
      ...editingQuote,
      lineItems: updatedLineItems,
      estimatedTotal: newTotal
    });
    setLineItemDesc('');
  };

  const handleSaveQuoteBOQ = async () => {
    if (!editingQuote) return;
    try {
      const res = await fetch(`/api/quotes/${editingQuote.id}/prepare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          lineItems: editingQuote.lineItems,
          estimatedTotal: editingQuote.estimatedTotal,
          sendToCustomer: true
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update quote');

      showToast('Quotation Prepared & Sent', `Quote ${data.quote.quoteNumber} sent to client.`, 'SUCCESS');
      setEditingQuote(null);
      fetchAdminData();
    } catch (err: any) {
      showToast('Error', err.message, 'ALERT');
    }
  };

  const handleConvertQuoteToProject = async (quoteId: string) => {
    try {
      const res = await fetch(`/api/quotes/${quoteId}/convert-to-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          assignedTechnicians: ['usr-tech-01', 'usr-tech-02'],
          assignedTechnicianNames: ['Dawit Bekele (Lead)', 'Yohannes Getachew']
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to convert quote');

      showToast('Project Created', `Project ${data.project.projectNumber} created and initialized.`, 'SUCCESS');
      fetchAdminData();
    } catch (err: any) {
      showToast('Error', err.message, 'ALERT');
    }
  };

  // Milestone Progress Update
  const handleUpdateMilestone = async (projectId: string, milestoneIndex: number, newStatus: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedMilestones = [...project.milestones];
    updatedMilestones[milestoneIndex].status = newStatus as any;

    const completedCount = updatedMilestones.filter(m => m.status === 'COMPLETED').length;
    const progressPercentage = Math.round((completedCount / updatedMilestones.length) * 100);
    const overallStatus = progressPercentage === 100 ? 'COMPLETED' : 'IN_PROGRESS';

    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          milestones: updatedMilestones,
          progressPercentage,
          status: overallStatus
        })
      });
      if (!res.ok) throw new Error('Failed to update project milestone');

      showToast('Milestone Updated', `Progress is now ${progressPercentage}%`, 'SUCCESS');
      fetchAdminData();
    } catch (err: any) {
      showToast('Error', err.message, 'ALERT');
    }
  };

  // Add Product to Inventory
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProdName,
          sku: newProdSku,
          category: newProdCategory,
          brand: newProdBrand,
          price: newProdPrice,
          stock: newProdStock,
          description: newProdDesc,
          images: ['https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600&auto=format&fit=crop'],
          warrantyMonths: 24
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add product');

      showToast('Product Created', `${newProdName} added to inventory.`, 'SUCCESS');
      setProductModalOpen(false);
      fetchAdminData();
    } catch (err: any) {
      showToast('Error', err.message, 'ALERT');
    }
  };

  // Admin Ticket Reply
  const handleAdminTicketReply = async (ticketId: string) => {
    if (!adminTicketReply.trim()) return;

    try {
      const res = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: adminTicketReply,
          senderRole: 'ENGINEER'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reply');

      setAdminTicketReply('');
      showToast('Technician Reply Sent', 'Customer notified.', 'SUCCESS');
      setActiveTicket(data.ticket);
      fetchAdminData();
    } catch (err: any) {
      showToast('Error', err.message, 'ALERT');
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'RESOLVED' })
      });
      if (!res.ok) throw new Error('Failed to resolve ticket');

      showToast('Ticket Resolved', 'Ticket status updated to RESOLVED.', 'SUCCESS');
      fetchAdminData();
    } catch (err: any) {
      showToast('Error', err.message, 'ALERT');
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-md">
        <Shield className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Administrator Access Only</h2>
        <p className="text-xs text-slate-500">
          You need an Administrator account to access the company operations dashboard. Please use the demo role switcher at the bottom to switch to "Admin".
        </p>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-page" className="space-y-8 pb-20">
      {/* Admin Top Header */}
      <section className="bg-[#07111F] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span className="text-xs font-bold text-[#1F6FEB] tracking-wider uppercase">
                DIGITAL INSTALL Operations Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Enterprise Engineering Management
            </h1>
            <p className="text-xs text-slate-400">
              Active Administrator: {user.name} ({user.email}) • Ethiopian Standard Operational Suite
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setProductModalOpen(true)}
              className="px-4 py-2.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock SKU</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { key: 'overview', label: 'KPI Overview', icon: BarChart3 },
            { key: 'quotes', label: `Quotes (${quotes.length})`, icon: FileText },
            { key: 'projects', label: `Projects (${projects.length})`, icon: Building },
            { key: 'inventory', label: `Shop Inventory (${products.length})`, icon: Package },
            { key: 'orders', label: `Equipment Orders (${orders.length})`, icon: ShoppingBag },
            { key: 'warranties', label: 'Warranties & SLA', icon: ShieldCheck },
            { key: 'tickets', label: `Support Desk (${tickets.length})`, icon: LifeBuoy },
            { key: 'audit', label: 'Audit Logs', icon: Layers }
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

        {/* TAB 1: KPI OVERVIEW */}
        {activeTab === 'overview' && metrics && (
          <div className="space-y-8">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Revenue</span>
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  ETB {metrics.totalRevenue?.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Verified sales & project contracts</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Active Projects</span>
                  <Building className="w-5 h-5 text-[#1F6FEB]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {metrics.totalProjects}
                </div>
                <div className="text-[11px] text-blue-600 font-semibold">
                  {projects.filter(p => p.status === 'IN_PROGRESS').length} In Progress / Staging
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Quotes</span>
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {metrics.totalQuotes}
                </div>
                <div className="text-[11px] text-amber-600 font-semibold">
                  {quotes.filter(q => q.status === 'PENDING').length} Awaiting BOQ Pricing
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Open Tickets</span>
                  <LifeBuoy className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {metrics.openTickets}
                </div>
                <div className="text-[11px] text-purple-600 font-semibold">
                  2-Hour Emergency SLA Active
                </div>
              </div>
            </div>

            {/* Quick Action Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Pending Quotes */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Recent Customer RFPs Requiring Review
                  </h3>
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className="text-xs font-bold text-[#1F6FEB] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {quotes.slice(0, 4).map(q => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#1F6FEB]">{q.quoteNumber}</span>
                          <span className="font-bold text-slate-800">{q.customerName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{q.serviceType} • {q.siteLocation}</div>
                      </div>

                      <button
                        onClick={() => {
                          setEditingQuote(q);
                          setActiveTab('quotes');
                        }}
                        className="px-3 py-1.5 bg-[#07111F] text-white rounded-lg font-bold text-[11px] hover:bg-slate-800 transition-colors"
                      >
                        Prepare BOQ
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Projects Status */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Live Engineering Deployments
                  </h3>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs font-bold text-[#1F6FEB] hover:underline"
                  >
                    Manage
                  </button>
                </div>

                <div className="space-y-3">
                  {projects.slice(0, 4).map(p => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{p.title}</span>
                        <span className="font-mono font-bold text-[#1F6FEB]">{p.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1F6FEB]"
                          style={{ width: `${p.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUOTATIONS MANAGEMENT */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            {editingQuote && (
              <div className="bg-white rounded-3xl border-2 border-[#1F6FEB] p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#1F6FEB] uppercase tracking-wider">
                      Itemized Cost Estimator (BOQ)
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Pricing BOQ for Quote {editingQuote.quoteNumber} ({editingQuote.customerName})
                    </h3>
                  </div>
                  <button onClick={() => setEditingQuote(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕ Close</button>
                </div>

                {/* Add Line Item Form */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">Add Line Item / Material / Labor</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Item Description (e.g. 4-Core Fiber Cable 500m or Schneider 3-Phase Panel)"
                      value={lineItemDesc}
                      onChange={e => setLineItemDesc(e.target.value)}
                      className="sm:col-span-6 p-2 rounded-xl border border-slate-300 bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={lineItemQty}
                      onChange={e => setLineItemQty(Number(e.target.value))}
                      className="sm:col-span-2 p-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Unit Price (ETB)"
                      value={lineItemPrice}
                      onChange={e => setLineItemPrice(Number(e.target.value))}
                      className="sm:col-span-2 p-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddLineItem}
                      className="sm:col-span-2 px-3 py-2 bg-[#1F6FEB] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Line items table */}
                <div className="space-y-2 text-xs">
                  {editingQuote.lineItems?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                      <span className="font-semibold text-slate-800">{item.quantity}x {item.description}</span>
                      <span className="font-mono font-bold text-slate-900">ETB {item.totalAmount?.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl flex justify-between items-center font-bold text-sm">
                    <span>Estimated Total (BOQ):</span>
                    <span className="font-mono text-emerald-400 text-base">ETB {editingQuote.estimatedTotal?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingQuote(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveQuoteBOQ}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Prepared Proforma to Customer</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {quotes.map(q => (
                <div key={q.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1F6FEB] bg-blue-50 px-2 py-0.5 rounded-md">
                          {q.quoteNumber}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{q.customerName} ({q.customerPhone})</h4>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Service: <strong>{q.serviceType}</strong> • Site: {q.siteLocation}, {q.city}
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      q.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : q.status === 'PREPARED'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {q.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{q.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setViewerType('QUOTATION_PROFORMA');
                        setViewerId(q.id);
                      }}
                      className="text-xs font-bold text-[#1F6FEB] hover:underline flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View PDF Proforma</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingQuote(q)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Line Items</span>
                      </button>

                      {q.status === 'APPROVED' && (
                        <button
                          onClick={() => handleConvertQuoteToProject(q.id)}
                          className="px-4 py-1.5 bg-[#07111F] hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
                        >
                          <Building className="w-3.5 h-3.5 text-[#1F6FEB]" />
                          <span>Initialize Project & Staging</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROJECTS & MILESTONES */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {projects.map(p => (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1F6FEB] bg-blue-50 px-2 py-0.5 rounded-md">
                        {p.projectNumber}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Client: {p.customerName} • Lead Engineer: {p.assignedTechnicianNames?.join(', ')}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1F6FEB] font-mono">{p.progressPercentage}% Completed</span>
                  </div>
                </div>

                {/* Milestones status modifier */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Engineering Milestones & Technicians Progress Updates
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {p.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3"
                      >
                        <div className="font-bold text-slate-900">{m.title}</div>
                        <select
                          value={m.status}
                          onChange={e => handleUpdateMilestone(p.id, idx, e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setViewerType('PROJECT_HANDOVER');
                      setViewerId(p.id);
                    }}
                    className="text-xs font-bold text-[#1F6FEB] hover:underline flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Handover Document</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SHOP INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Inventory & Equipment Stock</h3>
              <button
                onClick={() => setProductModalOpen(true)}
                className="px-4 py-2 bg-[#1F6FEB] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Brand</th>
                      <th className="p-4">Price (ETB)</th>
                      <th className="p-4">Stock Level</th>
                      <th className="p-4">Warranty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-slate-700">{prod.sku}</td>
                        <td className="p-4 font-bold text-slate-900">{prod.name}</td>
                        <td className="p-4 text-slate-600">{prod.brand}</td>
                        <td className="p-4 font-mono font-bold text-slate-900">ETB {prod.price.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                            prod.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {prod.stock} Units
                          </span>
                        </td>
                        <td className="p-4 text-slate-600">{prod.warrantyMonths} Mo</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS & DELIVERIES */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1F6FEB] bg-blue-50 px-2 py-0.5 rounded-md">
                        {o.orderNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{o.customerName}</h4>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Phone: {o.customerPhone} • Shipping: {o.shippingAddress}, {o.city}
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {o.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Payment: {o.paymentMethod}</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    Total: ETB {o.totalAmount?.toLocaleString()}
                  </span>
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
                    <span>View & Print Tax Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: SUPPORT DESK & TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
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
                    <div className="text-xs text-slate-500 mt-0.5">Customer: {t.customerName}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {t.status}
                    </span>
                    {t.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleResolveTicket(t.id)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Thread */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl max-h-60 overflow-y-auto text-xs">
                  {t.messages.map(m => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl ${
                        m.senderRole === 'ENGINEER' || m.senderRole === 'ADMIN'
                          ? 'bg-blue-50 text-slate-900 border border-blue-200 ml-6'
                          : 'bg-white text-slate-800 border border-slate-200 mr-6 shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                        <span>{m.senderName} ({m.senderRole})</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p>{m.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={activeTicket?.id === t.id ? adminTicketReply : ''}
                    onFocus={() => setActiveTicket(t)}
                    onChange={e => {
                      setActiveTicket(t);
                      setAdminTicketReply(e.target.value);
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleAdminTicketReply(t.id)}
                    placeholder="Dispatch technician reply or instructions..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                  />
                  <button
                    onClick={() => handleAdminTicketReply(t.id)}
                    className="px-4 py-2.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 7: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">System Audit & Compliance Logs</h3>
              <p className="text-xs text-slate-500">Immutable ledger of quotation actions, status changes, and user activities.</p>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600">{log.userName} ({log.userRole})</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Entity: {log.entityType} ({log.entityId})</div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Creation Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Equipment SKU</h3>
              <button onClick={() => setProductModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="e.g. Cisco Catalyst 24-Port Gigabit Switch"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={e => setNewProdSku(e.target.value)}
                    placeholder="e.g. CS-CAT-24G"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={e => setNewProdBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (ETB) *</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={e => setNewProdStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newProdCategory}
                  onChange={e => setNewProdCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="electrical">Electrical & Power</option>
                  <option value="cctv">CCTV & Surveillance</option>
                  <option value="networking">Networking & Fiber</option>
                  <option value="smart-home">Smart Home & Automation</option>
                  <option value="cables">Cables & Tools</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  placeholder="Hardware specifications and technical attributes..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold rounded-xl shadow-md"
                >
                  Add Product to Shop
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

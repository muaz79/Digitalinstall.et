import React, { useState } from 'react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useNotification } from '../context/NotificationContext.js';
import { Trash2, ArrowRight, ShieldCheck, CheckCircle2, ShoppingBag, FileText, ChevronRight } from 'lucide-react';
import { DocumentViewerModal } from '../components/public/DocumentViewerModal.js';

interface CartPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, formatETB } = useCart();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+251 9');
  const [shippingAddress, setShippingAddress] = useState('Bole Sub-City, House 1024');
  const [city, setCity] = useState('Addis Ababa');
  const [subCity, setSubCity] = useState('Bole');
  const [orderType, setOrderType] = useState<'PURCHASE' | 'QUOTE_REQUEST'>('PURCHASE');
  const [paymentMethod, setPaymentMethod] = useState<'TELEBIRR' | 'CBE_BIRR' | 'CASH_ON_DELIVERY' | 'BANK_TRANSFER' | 'INVOICE_QUOTE'>('TELEBIRR');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [viewInvoiceModalOpen, setViewInvoiceModalOpen] = useState(false);

  const taxAmount = subtotal * 0.15;
  const deliveryFee = subtotal > 20000 || subtotal === 0 ? 0 : 500;
  const totalAmount = subtotal + taxAmount + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!name || !email || !phone || !shippingAddress) {
      showToast('Missing Details', 'Please provide delivery name, email, phone, and address.', 'WARNING');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        name,
        email,
        phone,
        shippingAddress,
        city,
        subCity,
        orderType,
        paymentMethod,
        items: items.map(i => ({
          productId: i.product.id,
          quantity: i.quantity
        })),
        notes
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      setPlacedOrder(data.order);
      clearCart();
      showToast('Order Created!', `Order Ref: ${data.order.orderNumber}`, 'SUCCESS');
    } catch (err: any) {
      showToast('Order Failed', err.message, 'ALERT');
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Thank You for Your Order!</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Your order has been registered under reference <span className="font-mono font-bold text-[#1F6FEB]">{placedOrder.orderNumber}</span>.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-2.5 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Customer:</span>
            <span className="font-bold text-slate-900">{placedOrder.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Payment Method:</span>
            <span className="font-bold text-slate-900">{placedOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Total Amount (Incl. 15% VAT):</span>
            <span className="font-mono font-bold text-[#1F6FEB] text-sm">ETB {placedOrder.totalAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Delivery Location:</span>
            <span className="font-semibold text-slate-800">{placedOrder.shippingAddress}, {placedOrder.city}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            onClick={() => setViewInvoiceModalOpen(true)}
            className="px-6 py-3 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>View & Print Official Tax Invoice</span>
          </button>
          <button
            onClick={() => navigate('/account?tab=orders')}
            className="px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Track in Customer Portal
          </button>
        </div>

        {viewInvoiceModalOpen && (
          <DocumentViewerModal
            isOpen={viewInvoiceModalOpen}
            onClose={() => setViewInvoiceModalOpen(false)}
            type="TAX_INVOICE"
            dataId={placedOrder.id}
          />
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 sm:p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-5 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your Equipment Cart is Empty</h2>
          <p className="text-xs text-slate-500 mt-1">Browse our certified catalog to select electrical, CCTV, or networking hardware.</p>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-md transition-colors"
        >
          <span>Explore Equipment Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div id="cart-page" className="space-y-12 pb-20">
      {/* Header */}
      <section className="bg-[#07111F] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('/shop')} className="hover:text-white">Shop</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F6FEB] font-bold">Shopping Cart & Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Equipment Cart ({items.length} {items.length === 1 ? 'Item' : 'Items'})
          </h1>
        </div>
      </section>

      {/* Cart Content & Checkout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Item list */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
              {items.map(({ product, quantity }) => {
                const activePrice = product.discountPrice ?? product.price;
                return (
                  <div key={product.id} className="p-4 sm:p-6 flex gap-4 items-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                      <img src={product.images[0]} alt="" className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono text-slate-400">{product.sku}</div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{product.name}</h4>
                      <div className="text-xs font-mono font-bold text-slate-950 mt-1">
                        {formatETB(activePrice)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 rounded bg-white font-bold text-xs hover:bg-slate-200"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 rounded bg-white font-bold text-xs hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center px-2">
              <button
                onClick={() => navigate('/shop')}
                className="text-xs font-bold text-[#1F6FEB] hover:underline"
              >
                + Add More Products
              </button>
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-600 font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Right: Checkout & Delivery Form */}
          <div className="lg:col-span-5">
            <form onSubmit={handleCheckout} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Delivery Details & Payment
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer / Company Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Delivery Address (Addis Ababa / City) *</label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    placeholder="e.g. Bole Medhanialem, Behind Edna Mall"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1F6FEB] outline-hidden"
                    required
                  />
                </div>

                {/* Payment Selection */}
                <div className="pt-2">
                  <label className="block font-bold text-slate-700 mb-1.5">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'TELEBIRR', label: 'Telebirr Pay' },
                      { key: 'CBE_BIRR', label: 'CBE Birr' },
                      { key: 'CASH_ON_DELIVERY', label: 'Cash On Delivery' },
                      { key: 'BANK_TRANSFER', label: 'Bank Transfer' },
                      { key: 'INVOICE_QUOTE', label: 'Official Proforma' }
                    ].map(pm => (
                      <button
                        key={pm.key}
                        type="button"
                        onClick={() => setPaymentMethod(pm.key as any)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                          paymentMethod === pm.key
                            ? 'border-[#1F6FEB] bg-blue-50/60 text-[#1F6FEB] ring-1 ring-[#1F6FEB]/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">{formatETB(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>VAT (15%):</span>
                  <span className="font-mono font-semibold">{formatETB(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee:</span>
                  <span className="font-mono font-semibold">
                    {deliveryFee === 0 ? 'FREE (Over 20,000 ETB)' : formatETB(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="font-mono text-[#1F6FEB] text-base">{formatETB(totalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                id="btn-place-order-submit"
                disabled={loading}
                className="w-full py-4 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing Order...' : 'Confirm Order & Request Delivery'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

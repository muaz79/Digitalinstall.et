import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.js';
import { useNotification } from '../context/NotificationContext.js';
import { Product } from '../types/database.js';
import { ShoppingCart, ShieldCheck, CheckCircle2, ChevronRight, ArrowLeft, Tag, Truck, Award, FileText } from 'lucide-react';

interface ProductDetailPageProps {
  idOrSlug: string;
  navigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ idOrSlug, navigate, onOpenQuoteModal }) => {
  const { addToCart, formatETB } = useCart();
  const { showToast } = useNotification();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${idOrSlug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Product not found');
        setProduct(data.product);
        setSelectedImage(data.product.images[0] || '');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="py-28 text-center text-slate-500 text-sm">
        <div className="w-8 h-8 border-3 border-[#1F6FEB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading product specifications...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto my-20 bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
        <p className="text-rose-600 font-bold">Product not found.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const activePrice = product.discountPrice ?? product.price;

  const handleAdd = () => {
    if (!inStock) return;
    addToCart(product, quantity);
    showToast('Added to Cart', `${quantity}x ${product.name} added to your cart.`, 'SUCCESS');
  };

  return (
    <div id="product-detail-page" className="space-y-12 pb-20">
      {/* Breadcrumb Header */}
      <section className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <button onClick={() => navigate('/')} className="hover:text-slate-900">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('/shop')} className="hover:text-slate-900">Shop Catalog</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F6FEB] font-bold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shop</span>
          </button>
        </div>
      </section>

      {/* Main Specs & Purchase Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Images */}
          <div className="lg:col-span-6 space-y-4">
            <div className="h-96 sm:h-[480px] bg-slate-100 rounded-3xl border border-slate-200 p-8 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl bg-slate-100 p-2 border-2 transition-all flex items-center justify-center flex-shrink-0 ${
                      selectedImage === img ? 'border-[#1F6FEB] shadow-xs' : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Box */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#07111F] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {product.brand}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">SKU: {product.sku}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-950 font-mono">
                  {formatETB(activePrice)}
                </span>
                {product.discountPrice && (
                  <span className="text-base text-slate-400 line-through font-mono">
                    {formatETB(product.price)}
                  </span>
                )}
                <span className="text-xs text-slate-500 font-medium">(Excl. VAT)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  inStock
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {inStock ? `In Stock (${product.stock} units available)` : 'Awaiting Stock'}
                </span>
                <span className="text-xs text-slate-500">• Delivery in Addis Ababa within 24 Hours</span>
              </div>

              {/* Quantity & Add to Cart Controls */}
              {inStock && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1 w-32 justify-between">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-sm text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    id="btn-product-add-cart"
                    onClick={handleAdd}
                    className="flex-1 py-3.5 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add {quantity} Unit(s) to Cart</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => onOpenQuoteModal()}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Tag className="w-4 h-4 text-[#1F6FEB]" />
                <span>Request Project / Wholesale Quotation</span>
              </button>
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">{product.warrantyMonths}-Month Warranty</div>
                  <div className="text-[10px] text-slate-500">Official Certificate Included</div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-[#1F6FEB] flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Addis Ababa Delivery</div>
                  <div className="text-[10px] text-slate-500">Free over 20,000 ETB</div>
                </div>
              </div>
            </div>

            {/* Technical Specifications Table */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Technical Specifications
                </h3>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="p-3 flex justify-between">
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="font-bold text-slate-900 text-right">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

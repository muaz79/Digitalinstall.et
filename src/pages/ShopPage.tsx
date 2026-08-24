import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.js';
import { useNotification } from '../context/NotificationContext.js';
import { Product } from '../types/database.js';
import { ShoppingCart, Search, Filter, Check, ShieldCheck, Tag, Zap, ChevronRight, Eye } from 'lucide-react';

interface ShopPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const { addToCart, formatETB } = useCart();
  const { showToast } = useNotification();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`${url}?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const categories = [
    { key: 'all', label: 'All Equipment' },
    { key: 'electrical', label: 'Electrical & Power' },
    { key: 'cctv', label: 'CCTV & Security' },
    { key: 'networking', label: 'Networking & Fiber' },
    { key: 'smart-home', label: 'Smart Home' },
    { key: 'cables', label: 'Cables & Tools' }
  ];

  const brands = ['all', 'Schneider Electric', 'Hikvision', 'Cisco', 'Tuya Smart', 'D-Link', 'Legrand', 'ABB'];

  const filteredProducts = products.filter(p => {
    if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
    return true;
  });

  const handleAddToCart = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (prod.stock <= 0) {
      showToast('Out of Stock', 'This item is currently awaiting inventory replenishment.', 'WARNING');
      return;
    }
    addToCart(prod, 1);
    showToast('Added to Cart', `${prod.name} added to your equipment cart.`, 'SUCCESS');
  };

  return (
    <div id="shop-page" className="space-y-12 pb-20">
      {/* Shop Header */}
      <section className="bg-[#07111F] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1F6FEB] font-bold">Equipment Store</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F6FEB]">Genuine Guaranteed Hardware</span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                Electrical & Technology Equipment Sales
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
                Purchase direct genuine inventory with verified Ethiopian warranty certificates or request wholesale quantity quotations.
              </p>
            </div>

            <button
              onClick={() => onOpenQuoteModal()}
              className="self-start md:self-auto px-5 py-3 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <Tag className="w-4 h-4" />
              <span>Request Bulk Project Quote</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Catalog View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters & Search Toolbar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products by SKU, name or brand..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1F6FEB] focus:border-[#1F6FEB] outline-hidden bg-slate-50"
              />
            </div>

            {/* Brand Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-600 flex-shrink-0">Brand:</span>
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 outline-hidden"
              >
                {brands.map(b => (
                  <option key={b} value={b}>
                    {b === 'all' ? 'All Brands' : b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {categories.map(c => (
              <button
                key={c.key}
                id={`cat-btn-${c.key}`}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === c.key
                    ? 'bg-[#1F6FEB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center text-slate-500 text-sm">
            <div className="w-8 h-8 border-3 border-[#1F6FEB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading certified inventory catalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <p className="text-base font-bold text-slate-700">No equipment found matching your filter.</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or selecting "All Equipment".</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const inStock = product.stock > 0;
              const hasDiscount = !!product.discountPrice;
              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  onClick={() => navigate(`/shop/${product.slug || product.id}`)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-[#1F6FEB]/50 transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
                >
                  <div>
                    {/* Image Area */}
                    <div className="h-52 relative overflow-hidden bg-slate-100 flex items-center justify-center p-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="bg-[#07111F]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                          {product.brand}
                        </span>
                        {hasDiscount && (
                          <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            SAVE
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          inStock
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {inStock ? `${product.stock} In Stock` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2.5">
                      <div className="text-[10px] font-mono text-slate-400">{product.sku}</div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1F6FEB] transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{product.warrantyMonths}-Month Official Warranty</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Add to Cart Footer */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                    <div>
                      {hasDiscount ? (
                        <div className="flex flex-col">
                          <span className="text-base font-black text-slate-950 font-mono">
                            {formatETB(product.discountPrice!)}
                          </span>
                          <span className="text-[11px] text-slate-400 line-through font-mono">
                            {formatETB(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-base font-black text-slate-950 font-mono">
                          {formatETB(product.price)}
                        </span>
                      )}
                    </div>

                    <button
                      id={`btn-add-cart-${product.id}`}
                      disabled={!inStock}
                      onClick={e => handleAddToCart(product, e)}
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        inStock
                          ? 'bg-[#1F6FEB] hover:bg-[#1558C0] text-white shadow-xs active:scale-95'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                      title={inStock ? 'Add to Cart' : 'Out of stock'}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

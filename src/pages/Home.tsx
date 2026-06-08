import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ProductCard from '@/components/ProductCard';

const HERO = 'https://d64gsuwffb70l.cloudfront.net/6a2502df6d2d5ba36acdc0a1_1780810805370_ff5ef0c2.png';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsResponse, collectionsResponse] = await Promise.all([
          apiFetch<{ products: any[] }>('/api/products?featured=true&limit=8'),
          apiFetch<{ collections: any[] }>('/api/collections'),
        ]);

        setFeatured((productsResponse.products || []).slice(0, 8));
        setCollections((collectionsResponse.collections || []).filter((c) => c.handle !== 'new-arrivals' && c.handle !== 'sale').slice(0, 6));
      } catch (error) {
        console.error('Failed to load storefront data', error);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center">
        <img src={HERO} alt="Shop" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-lg text-white">
            <p className="text-[#FF6B6B] font-semibold mb-3 tracking-wide">NEW SEASON · 2026</p>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">Elevate Your Everyday</h1>
            <p className="text-lg opacity-90 mb-8">Discover 50+ curated products across electronics, fashion, home, beauty and more — all with free shipping.</p>
            <div className="flex gap-4">
              <Link to="/products" className="bg-[#FF6B6B] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#ff5252] transition-colors">Shop Now</Link>
              <Link to="/collections/new-arrivals" className="bg-white text-[#2C2C2C] px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors">New Arrivals</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, t: 'Free Shipping', s: 'On all orders' },
            { icon: RefreshCw, t: 'Easy Returns', s: '30-day policy' },
            { icon: ShieldCheck, t: 'Secure Payment', s: 'Encrypted checkout' },
            { icon: Headphones, t: '24/7 Support', s: 'Always here to help' }
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <p.icon className="text-[#FF6B6B]" size={28} />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{p.t}</p>
                <p className="text-xs text-gray-500">{p.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center mb-2">Shop by Category</h2>
        <p className="text-center text-gray-500 mb-10">Find exactly what you're looking for</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map(c => (
            <Link key={c.id} to={`/collections/${c.handle}`}
              className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 h-40 flex flex-col justify-end hover:shadow-lg transition-shadow group overflow-hidden">
              <div className="absolute inset-0 bg-[#FF6B6B]/0 group-hover:bg-[#FF6B6B]/5 transition-colors" />
              <h3 className="text-xl font-bold text-[#2C2C2C] relative">{c.title}</h3>
              <p className="text-sm text-gray-600 relative">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-gray-500">Handpicked favorites just for you</p>
          </div>
          <Link to="/products" className="text-[#FF6B6B] font-semibold hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;

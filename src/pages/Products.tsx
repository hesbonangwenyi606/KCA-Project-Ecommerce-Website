import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const Products: React.FC = () => {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('All');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(250);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { products } = await apiFetch<{ products: any[] }>('/api/products');
        setProducts(products || []);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const types = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.product_type).filter(Boolean)))], [products]);

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const price = (p.has_variants && p.variants?.length ? p.variants[0].price : p.price) / 100;
      if (type !== 'All' && p.product_type !== type) return false;
      if (price > maxPrice) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !(p.product_type || '').toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    const getP = (p: any) => p.has_variants && p.variants?.length ? p.variants[0].price : p.price;
    if (sort === 'price-asc') list = [...list].sort((a, b) => getP(a) - getP(b));
    if (sort === 'price-desc') list = [...list].sort((a, b) => getP(b) - getP(a));
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, type, sort, maxPrice, q]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-1">{q ? `Results for "${q}"` : 'All Products'}</h1>
        <p className="text-gray-500 mb-6">{filtered.length} products</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <aside className="lg:w-60 flex-shrink-0 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-1">
                {types.map(t => (
                  <button key={t} onClick={() => setType(t)}
                    className={`block text-sm py-1 ${type === t ? 'text-[#FF6B6B] font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Max Price: ${maxPrice}</h3>
              <input type="range" min={10} max={250} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#FF6B6B]" />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex justify-end mb-4">
              <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-gray-500">No products match your filters.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;

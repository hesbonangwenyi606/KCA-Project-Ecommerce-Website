import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const CollectionPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!handle) return;
      setLoading(true);
      const { data: col } = await supabase.from('ecom_collections').select('*').eq('handle', handle).single();
      if (!col) { setLoading(false); return; }
      setCollection(col);
      const { data: links } = await supabase.from('ecom_product_collections').select('product_id, position').eq('collection_id', col.id).order('position');
      if (!links?.length) { setProducts([]); setLoading(false); return; }
      const ids = links.map(l => l.product_id);
      const { data: prods } = await supabase.from('ecom_products').select('*, variants:ecom_product_variants(*)').in('id', ids).eq('status', 'active');
      setProducts(ids.map(id => prods?.find(p => p.id === id)).filter(Boolean));
      setLoading(false);
    };
    run();
  }, [handle]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? <p className="text-gray-500">Loading...</p> : !collection ? <p>Collection not found</p> : (
          <>
            <h1 className="text-3xl font-bold mb-1">{collection.title}</h1>
            <p className="text-gray-500 mb-6">{collection.description} · {products.length} products</p>
            {products.length === 0 ? <p className="text-gray-500">No products in this collection yet.</p> : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CollectionPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';

const Wishlist: React.FC = () => {
  const { wishlist } = useCart();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!wishlist.length) { setProducts([]); return; }
    supabase.from('ecom_products').select('*, variants:ecom_product_variants(*)').in('id', wishlist)
      .then(({ data }) => setProducts(data || []));
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        {products.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={56} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
            <Link to="/products" className="bg-[#FF6B6B] text-white px-8 py-3 rounded-lg font-semibold inline-block">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;

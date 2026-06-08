import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Heart, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';

interface Collection { id: string; title: string; handle: string; }

const Header: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, wishlist } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('ecom_collections').select('id,title,handle').eq('is_visible', true).order('sort_order')
      .then(({ data }) => setCollections(data || []));
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="bg-[#2C2C2C] text-white text-center text-xs py-2 tracking-wide">
        FREE SHIPPING ON ALL ORDERS · SHOP THE NEW COLLECTION
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-[#2C2C2C]">
            LUMA<span className="text-[#FF6B6B]">.</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {collections.slice(0, 7).map(c => (
              <Link key={c.id} to={`/collections/${c.handle}`} className="text-sm font-medium text-gray-700 hover:text-[#FF6B6B] transition-colors">
                {c.title}
              </Link>
            ))}
          </nav>
          <form onSubmit={submitSearch} className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 w-48 lg:w-56">
            <Search size={16} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="bg-transparent outline-none text-sm px-2 w-full" />
          </form>
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="relative">
              <Heart size={22} className="text-gray-700 hover:text-[#FF6B6B]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF6B6B] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingBag size={22} className="text-gray-700 hover:text-[#FF6B6B]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF6B6B] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 px-4 py-3 space-y-2">
          <form onSubmit={submitSearch} className="flex items-center bg-gray-100 rounded-full px-3 py-2 mb-2">
            <Search size={16} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-transparent outline-none text-sm px-2 w-full" />
          </form>
          {collections.map(c => (
            <Link key={c.id} to={`/collections/${c.handle}`} onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">
              {c.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;

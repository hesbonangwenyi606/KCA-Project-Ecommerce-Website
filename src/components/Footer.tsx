import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2C2C2C] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="text-2xl font-extrabold text-white">LUMA<span className="text-[#FF6B6B]">.</span></Link>
          <p className="mt-3 text-sm text-gray-400">Premium products for modern living. Curated, quality, delivered.</p>
          <div className="flex gap-3 mt-4">
            <Instagram size={20} className="hover:text-[#FF6B6B] cursor-pointer" />
            <Twitter size={20} className="hover:text-[#FF6B6B] cursor-pointer" />
            <Facebook size={20} className="hover:text-[#FF6B6B] cursor-pointer" />
            <Youtube size={20} className="hover:text-[#FF6B6B] cursor-pointer" />
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/collections/new-arrivals" className="hover:text-white">New Arrivals</Link></li>
            <li><Link to="/collections/sale" className="hover:text-white">Sale</Link></li>
            <li><Link to="/collections/electronics" className="hover:text-white">Electronics</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/info/shipping-info" className="hover:text-white">Shipping Info</Link></li>
            <li><Link to="/info/returns" className="hover:text-white">Returns</Link></li>
            <li><Link to="/info/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/info/contact-us" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/info/about" className="hover:text-white">About</Link></li>
            <li><Link to="/info/careers" className="hover:text-white">Careers</Link></li>
            <li><Link to="/info/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/info/terms" className="hover:text-white">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} LUMA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

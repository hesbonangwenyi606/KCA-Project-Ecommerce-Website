import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">Your cart is empty.</p>
            <Link to="/products" className="bg-[#FF6B6B] text-white px-8 py-3 rounded-lg font-semibold inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.product_id + (item.variant_id || '')} className="flex gap-4 border border-gray-100 rounded-xl p-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-50" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.variant_title && <p className="text-sm text-gray-500">{item.variant_title}</p>}
                    <p className="font-bold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)} className="p-2"><Minus size={14} /></button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)} className="p-2"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.product_id, item.variant_id)} className="text-gray-400 hover:text-[#FF6B6B] flex items-center gap-1 text-sm">
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-6 h-fit">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
              <div className="flex justify-between text-sm mb-2"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
              <div className="flex justify-between text-sm mb-4 text-gray-500"><span>Tax</span><span>Calculated at checkout</span></div>
              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span><span>{formatPrice(cartSubtotal)}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="w-full mt-6 bg-[#FF6B6B] text-white py-3.5 rounded-lg font-semibold hover:bg-[#ff5252]">
                Proceed to Checkout
              </button>
              <Link to="/products" className="block text-center mt-3 text-sm text-gray-500 hover:text-gray-900">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;

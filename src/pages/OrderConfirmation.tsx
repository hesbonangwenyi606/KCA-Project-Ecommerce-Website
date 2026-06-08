import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice } from '@/lib/format';

const OrderConfirmation: React.FC = () => {
  const { state } = useLocation() as any;
  const orderId = state?.orderId;
  const total = state?.total;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
        <CheckCircle size={72} className="mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-3">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-2">Your payment was successful and your order is confirmed.</p>
        {orderId && <p className="text-sm text-gray-500 mb-1">Order ID: <span className="font-mono">{orderId.slice(0, 8)}</span></p>}
        {total != null && <p className="text-sm text-gray-500 mb-8">Total Paid: {formatPrice(total)}</p>}
        <p className="text-gray-600 mb-8">A confirmation email is on its way to your inbox.</p>
        <Link to="/products" className="bg-[#FF6B6B] text-white px-8 py-3.5 rounded-lg font-semibold inline-block hover:bg-[#ff5252]">
          Continue Shopping
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;

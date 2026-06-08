import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, PROJECT_ID, SHIPPING_RULES } from '@/lib/format';

const STRIPE_ACCOUNT_ID = 'acct_1TfZNJHpYNEVuBdu';
const stripePromise = loadStripe('pk_live_51OJhJBHdGQpsHqInIzu7c6PzGPSH0yImD4xfpofvxvFZs0VFhPRXZCyEgYkkhOtBOXFWvssYASs851mflwQvjnrl00T6DbUwWZ', { stripeAccount: STRIPE_ACCOUNT_ID });

function PaymentForm({ onSuccess }: { onSuccess: (pi: any) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true); setError('');
    const { error: err, paymentIntent } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
    if (err) { setError(err.message || 'Payment failed'); setLoading(false); }
    else if (paymentIntent?.status === 'succeeded') onSuccess(paymentIntent);
    else setLoading(false);
  };

  return (
    <form onSubmit={submit}>
      <PaymentElement />
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      <button type="submit" disabled={!stripe || loading}
        className="w-full mt-5 bg-[#FF6B6B] text-white py-3.5 rounded-lg font-semibold hover:bg-[#ff5252] disabled:opacity-60">
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

const Checkout: React.FC = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [shipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [addr, setAddr] = useState({ name: '', email: '', address: '', city: '', state: '', zip: '', country: 'US' });

  useEffect(() => {
    if (!cart.length) return;
    // calculate shipping (free per rules)
    supabase.functions.invoke('calculate-shipping', {
      body: { cartItems: cart, shippingRules: SHIPPING_RULES, subtotal: cartSubtotal }
    });
  }, []);

  useEffect(() => {
    if (addr.state.length === 2 && cartSubtotal > 0) {
      supabase.functions.invoke('calculate-tax', { body: { state: addr.state, subtotal: cartSubtotal } })
        .then(({ data }) => { if (data?.success) setTax(data.taxCents); });
    }
  }, [addr.state, cartSubtotal]);

  const total = cartSubtotal + shipping + tax;

  const initPayment = async () => {
    setPaymentError('');
    const { data, error } = await supabase.functions.invoke('create-payment-intent', { body: { amount: total, currency: 'usd' } });
    if (error || !data?.clientSecret) { setPaymentError('Unable to initialize payment. Please try again.'); return; }
    setClientSecret(data.clientSecret);
  };

  const handleSuccess = async (pi: any) => {
    const { data: customer } = await supabase.from('ecom_customers')
      .upsert({ email: addr.email, name: addr.name }, { onConflict: 'email' }).select('id').single();
    const { data: order } = await supabase.from('ecom_orders').insert({
      customer_id: customer?.id, status: 'paid', subtotal: cartSubtotal, tax, shipping,
      total, shipping_address: addr, stripe_payment_intent_id: pi.id
    }).select('id').single();
    if (order) {
      const items = cart.map(i => ({
        order_id: order.id, product_id: i.product_id, variant_id: i.variant_id || null,
        product_name: i.name, variant_title: i.variant_title || null, sku: i.sku || null,
        quantity: i.quantity, unit_price: i.price, total: i.price * i.quantity
      }));
      await supabase.from('ecom_order_items').insert(items);
      const { data: orderItems } = await supabase.from('ecom_order_items').select('*').eq('order_id', order.id);
      try {
        await fetch(`https://famous.ai/api/ecommerce/${PROJECT_ID}/send-confirmation`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id, customerEmail: addr.email, customerName: addr.name, orderItems, subtotal: cartSubtotal, shipping, tax, total, shippingAddress: addr })
        });
      } catch { /* noop */ }
      try {
        await fetch(`https://famous.ai/api/crm/${PROJECT_ID}/subscribe`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: addr.email, name: addr.name, source: 'checkout', tags: ['customer'] })
        });
      } catch { /* noop */ }
    }
    clearCart();
    navigate('/order-confirmation', { state: { orderId: order?.id, total } });
  };

  const formOk = addr.name && addr.email && addr.address && addr.city && addr.state && addr.zip;

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-500 mb-6">Your cart is empty.</p>
          <button onClick={() => navigate('/products')} className="bg-[#FF6B6B] text-white px-8 py-3 rounded-lg font-semibold">Shop Products</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full grid lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <input placeholder="Full Name" className="col-span-2 border border-gray-200 p-3 rounded-lg" value={addr.name} onChange={e => setAddr({ ...addr, name: e.target.value })} />
            <input placeholder="Email" className="col-span-2 border border-gray-200 p-3 rounded-lg" value={addr.email} onChange={e => setAddr({ ...addr, email: e.target.value })} />
            <input placeholder="Address" className="col-span-2 border border-gray-200 p-3 rounded-lg" value={addr.address} onChange={e => setAddr({ ...addr, address: e.target.value })} />
            <input placeholder="City" className="border border-gray-200 p-3 rounded-lg" value={addr.city} onChange={e => setAddr({ ...addr, city: e.target.value })} />
            <input placeholder="State (e.g. CA)" maxLength={2} className="border border-gray-200 p-3 rounded-lg uppercase" value={addr.state} onChange={e => setAddr({ ...addr, state: e.target.value.toUpperCase() })} />
            <input placeholder="ZIP Code" className="border border-gray-200 p-3 rounded-lg" value={addr.zip} onChange={e => setAddr({ ...addr, zip: e.target.value })} />
            <input placeholder="Country" className="border border-gray-200 p-3 rounded-lg" value={addr.country} onChange={e => setAddr({ ...addr, country: e.target.value })} />
          </div>

          <h2 className="font-semibold mb-3">Payment</h2>
          {!clientSecret ? (
            <>
              {paymentError && <p className="text-red-500 text-sm mb-2">{paymentError}</p>}
              <button onClick={initPayment} disabled={!formOk}
                className="w-full bg-[#2C2C2C] text-white py-3.5 rounded-lg font-semibold hover:bg-black disabled:opacity-50">
                {formOk ? 'Continue to Payment' : 'Fill in shipping details'}
              </button>
            </>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm onSuccess={handleSuccess} />
            </Elements>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cart.map(i => (
              <div key={i.product_id + (i.variant_id || '')} className="flex gap-3 items-center">
                <img src={i.image} alt={i.name} className="w-12 h-12 object-cover rounded bg-white" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-xs text-gray-500">{i.variant_title ? i.variant_title + ' · ' : ''}Qty {i.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(i.price * i.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
